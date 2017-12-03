// ** Model **
var model = {
    categoriesList: [
      {name: 'Prominat Points of Interest', value: 'points of interest'},
      {name: 'Restaurants', value: 'restaurants'},
      {name: 'Schools', value: 'schools'},
      {name: 'Gas Stations', value: 'gas stations'}
    ],
    locations: [
    ],
    current_content: '',
    map_bounds: '',
    saved_category: "points of interest"
  };


// ** Viewmodel **
var Categories = function(data) {
  this.category_name = ko.observable(data.name);
  this.category_value = ko.observable(data.value);
};

var Locations = function(data) {
  this.location_name = ko.observable(data.name);
  this.location_address = ko.observable(data.formatted_address);
  this.location_geometry = data.geometry.location;
  this.marker = data.marker;
  this.venuID = data.venuID;
};

function initMap() {

  var ViewModel = function() {
    var map;
    var usCenter = {lat: 39.8283, lng: -98.5795};
    var self = this;
    self.markers = [];
    var categories_list = model.categoriesList;
    var locations_list = model.locations;

    // Initialize the categories List.
    self.categories = ko.observableArray([]);
    self.selected = ko.observable(model.categoriesList[0].value);
    categories_list.forEach(function(category) {
      self.categories.push(new Categories(category));
    }); // End of Model.categories List.

    // Initialize the locations.
    self.locations = ko.observableArray([]);
    locations_list.forEach(function(location) {
      self.locations.push(new Locations(location));
    });

    var new_category = self.selected();
    // Create a new Google Map centered in the US.
    map = new google.maps.Map(document.getElementById('map'), {
      center: usCenter,
      zoom: 4,
      styles:
      [
        {
          stylers: [{ visibility: 'simplified' }]
        },
        {
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers:[{visibility: 'on', color: '#d59563'}]
        },
        {
          featureType: 'administrative.province',
          stylers:[{visibility: 'on', color: '#d59563'}]
       },
       {
          featureType: 'administrative.country',
          elementType: 'labels',
          stylers:[{visibility: 'on', color: '#d59563'}]
       },
       {
          featureType: 'administrative.country',
          elementType:'geometry.stroke',
          stylers:[{visibility: 'on', color: '#d59563'}]
       }
      ]
    });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      searchBox.addListener('places_changed', function() {
        // Clear all markers with the start of a new search.
        self.hideMarkers(self.markers);
        new_category = self.selected();

        // Update the model with the new selected category.
        model.saved_category = new_category;
        newSearch = input.value + ' ' + new_category;
        self.peformSearch(newSearch);
      });  // End Search box listener for places changed.

      // Create an InfoWidnow.
      infoWindow = new google.maps.InfoWindow();

      // Initialize servcie as the Places Services Object.
      service = new google.maps.places.PlacesService(map);

      // Style the markers a bit. This will be our defalut marker icon.  Color
      // is Blue.
      var defaultIcon = makeMarkerIcon('0091ff');

      // Create a "highlighted location" marker color for when the user
      // mouses over the marker.  Color is Yellow.
      var highlightedIcon = makeMarkerIcon('FFFF24');

      // Added closeclick event on the infoWindow to set content back to empty
      // and readjust the map back to the original bounds of the search to
      // keep the map positon from being skewed.
      google.maps.event.addListener(infoWindow, 'closeclick', function() {
        infoWindow.setContent('');
        bounds = model.map_bounds;
        map.fitBounds(bounds);
      });

      // Performs a new search using the query entered by the user from the
      // input box from the map.
      // function peformSearch(newSearch) {
      self.peformSearch = function(newSearch) {
        var usCenter = new google.maps.LatLng(39.8283, 98.5795);
        var request = {
          location: usCenter,
          radius: '500',
          query: newSearch
        };
          service.textSearch(request, callback);
        };

      // Callback function to process the results of the places search.
      function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }

        // locations_list used to load the locatons results into the model.
        locations_list = [];

        // Empty out the observable array with the removeALL.
        self.locations.removeAll();

        // Initialize the bounds to contain the bounds of all the locations.
        var bounds = new google.maps.LatLngBounds();

        // Add each location to locations_list, create a marker for it and
        // extend the bounds.
        for (var i = 0; result = results[i]; i++) {
          locations_list.push(result);
          self.addMarker(result);
          bounds.extend(result.geometry.location);
         }

          // Loop thru the list and create an Object for each one containing
          // the data you want to keep and resue.
          locations_list.forEach(function(location) {
            self.locations.push( new Locations(location) );
          });  // End of Model.categoriesList

        map.fitBounds(bounds);
        model.map_bounds = bounds;
      } // End callback function

      // Open InfoWindow.  Pass in the location name lat & lng
      self.getInfoWindowContent = function(location, name, lat, lng) {

        var pos = {
          lat: lat,
          lng: lng
          };
        infoWindow.setPosition(pos);

        // Use the Foursquare API to retreive the Fromatted addreess and two
        // pictures.  Two AJAX requests will be necessary.  The first one to
        // get the Foursquare ID of the location (where the location was
        // obatained from Google places).  The second AJAX reqest will take
        // that Foursquare ID and retreive two pictures from the list of
        // pictures that are availble.
        var client_id = 'YWDXDQNTJCBA5VGTOVEAAS5ZXF1HMCA0MPBJGIUZZ4AGM05O';
        var client_secret = 'Z03QBTYLREFDF2WBK3KPGCVBCPKWVDR4XF2SCDYGDLCJ5QIW';

        // Foursquare required parameter for date of related info.
        var version = '20171001';
        var ll = lat + ',' + lng;  // Foursquare lat & long
        var query = name;  // Foursquare Query String

        // Foursquare intent parameter, finds near exact match
        var intent = 'match';
        var limit = 1;   // Foursquare number to limit results to.

        // Foursquare Venue url for the API request.
        var venue_url = 'https://api.foursquare.com/v2/venues/search';
        var photoSize = '300';
        var venuID = '';
        var content = '';
        var photo = [];
        var i = 0;
        var photo_count;
        console.log('v= ' + version);
        console.log('ll= ' + ll);
        console.log('query= ' + query);
        console.log('intent= ' + intent);
        // begin first AJAX JQuery to obtain the formatted address and the
        // Foursquare ID of the place.
        $.ajax({
          type: 'GET',
          dataType: 'jsonp',
          cache: false,
          url: venue_url + '?' +
               'v=' + version +
               '&ll=' + ll +
               '&query=' + query +
               '&intent=' + intent +
               '&limit=' + limit +
               '&client_id=' + client_id +
               '&client_secret=' + client_secret,
          async: true,
          success: function(data) {
            if (data.meta.code == 200) {

              // Error check if no venue is found.
              if (!data.response.venues[0]) {
                console.log('venues = 0 - no data');
                alert('No Foursqure data available, please select another ' +
                      'location');
              }
              var venuID = data.response.venues[0].id;
              console.log('id = ' + data.response.venues[0].id);
              location.venuID = venuID;
              content = content + '<div id="infoWindowText"><h1>' +
                data.response.venues[0].name + '</h1>' +
                '<p>Address: ' +
                data.response.venues[0].location.formattedAddress[0] + ', ' +
                data.response.venues[0].location.formattedAddress[1] +
                '</p></div>';
              // Perform a second AJAX to get photos.
              $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                cache: false,
                url: 'https://api.foursquare.com/v2/venues' + '/' + venuID +
                  '/photos' +
                  '?' +
                  'v=' + version +
                  '&client_id=' + client_id +
                  '&client_secret=' + client_secret,
                async: true,
                success: function(data) {
                  if (data.meta.code === 200) {
                    // Handle error if no pictures are available by checking if
                    // the photos count from foursquare is zero.
                    if (data.response.photos.count == 0) {
                      content = content;
                      alert('Sorry Picture images are not available from' +
                        'Foursquare. Please select another location.');
                    } else {
                      photo_count = data.response.photos.count;

                      // Error check to see if only one photo is available then
                      // set the photo counter to 1 otherwise get the first 2
                      // photos.
                      if (photo_count == 1) {
                        photo_count = 1;
                      } else {
                        photo_count = 2;
                      }
                      content = content + '<div class="center">';
                      while (i < photo_count) {
                        photo[i] = data.response.photos.items[i].prefix +
                          'cap' + photoSize +
                          data.response.photos.items[i].suffix;
                        content = content + '<img class="img-contain" src="' +
                          photo[i] + '"/>';
                        i++;
                      }
                      content = content + '</div>';
                      content = content + '<br><br><p>Address and Photos' +
                        ' provided by <a href="http://www.Foursquare.com"' +
                        ' target="_blank">Foursquare.com</a>';
                      model.current_content=content;
                      infoWindow.setContent(content);
                      infoWindow.open(map, location.marker);
                    } // End Else
                  } // End If
                } //End success function photo AJAX query
              });  // End photo AJAX request
            } // End first if statement;
          }  // End first AJAX success function.
        });  // End first AJAX request for venu search.
      };  // End getInfoWindowContent function.

    // Create a marker for each location.
    // function addMarker(place) {
    self.addMarker = function(place) {
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: defaultIcon,
        visible: true
      });
      place.marker = marker;
      model.current_content = '';
      self.markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        marker.setAnimation(null);
        self.toggleBounce(marker);
        self.stopAnimation(marker);
        service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          self.getInfoWindowContent(result,
                                    result.name,
                                    result.geometry.location.lat(),
                                    result.geometry.location.lng()
                                  );
          infoWindow.open(map, marker);
         });
      });

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
       this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
       this.setIcon(defaultIcon);
      });
    }; // End addMarker

    // This function will loop through the listings and hide them all.
    self.hideMarkers = function (markers) {
      for (var i = 0; i < markers.length; i++) {
        // markers[i].setMap(null);
        markers[i].setVisible(false);
      }
    };

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an
    // origin of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+
        markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 0),
        new google.maps.Size(21,34));
      return markerImage;
    }

    // FILTER AREA.  Let's do some Filtering on our list.
    // Attribution for Filter:  Two websites were used to formulate my version
    // of the Filter search box used on this project.
    // 1. http://www.knockmeout.net/2011/04/utility-functions-in-
    //      knockoutjs.html
    // 2. https://www.codeproject.com/Articles/822879/
    //      Searching-filtering-and-sorting-with-KnockoutJS-in
    self.filter = ko.observable('');
    self.filteredLocations = ko.computed(function() {
      return ko.utils.arrayFilter(self.locations(), function(location) {
        var result =
          location.location_name().
          toLowerCase().indexOf(self.filter().toLowerCase());
        if (result === -1) {
        	location.marker.setVisible(false);
    		} else {
      		location.marker.setVisible(true);
    		}
      		return result >= 0;
        });
    });

    self.displayInfo = function(location) {
      console.log(location.location_name());
      self.hideMarkers(self.markers);
      model.current_content = '';
      self.filter(location.location_name());
      location.marker.setVisible(true);
      location.marker.setAnimation(null);
      self.toggleBounce(location.marker);
      self.stopAnimation(location.marker);
      self.getInfoWindowContent(location,
                                location.location_name(),
                                location.location_geometry.lat(),
                                location.location_geometry.lng()
                              );
    };

    // Clears the filter box.
    self.clearFilter = function() {
      self.filter('');
      infoWindow.close();
    };

    // Animate the marker to bounce.
    // Have marker bounce 5 times then stop.
    // 700 milliseconds per bounce
    self.stopAnimation = function (marker) {
      setTimeout(function () {
        marker.setAnimation(null);
      }, 3518);
    };

    // Function to toggle bouncing marker.
    // marker.setAnimation(google.maps.Animation.BOUNCE);
    self.toggleBounce = function (marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation (null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    };  //end funcion toggleBounce

  };  // end view model

ko.applyBindings(new ViewModel());
}  // end init map

// Error handling function when Google Maps fails to load.
function googlerror() {
  console.log('google load error');
  alert('Google Maps failed to load correctly.  Please check your' +
    'Internet Connection and try loading the page again');
}
