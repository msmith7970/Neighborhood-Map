## SCOPE and USABILITY

The purpose of the project is to create a Web Application for a Neighborhood Map that utilizes the Google Maps API.  This application's design also uses Knockout to create a MVVM pattern.

By default when this webpage is first visited will display a map of the United States. A search will need to be performed to pull in a list of places.

The user has two key parameters to input to perform this search:
1. Select a Category.
2. Enter a City and State in the Search box.  

There are four options to choose from a particular category:
1. Points of interest
2. Restaurants
3. Schools
4. Gas stations

Once a City and State is entered into the search box located at the top of the map and the user hits the enter or return key, a list of up to 20 top places are returned and displayed under the Filter search box located on the bottom left of the screen.  

A Filter search box is included that allows the user to filter the list from the results that were returned from the search.  

A map marker is displayed on the map to correspond to each of the places from the list and when clicked will animate by bouncing.  The marker will also change colors when the mouse goes over the marker.

When a marker is clicked an info window is displayed.  The contents of the info window be will populated with the results of an AJAX query from a 3rd Party API (Foursquare: https://foursquare.com) containing the formatted address and two pictures.  


## Setup

On your PC you will need to have the following to access and run this web application:

* Have a PC with Internet Access.
* A web browser such as [Google Chrome](https://www.google.com/chrome/browser/).
* [Git](https://help.github.com/articles/set-up-git/).  The Git Bash program is installed with Git.  This will get you a Unix-style terminal.


## Structure of the Web Application files

The directory of files include:

    1) index.html - The home page for the web application.
    2) css Directory - This directory contains all of the css files including a custom css file and the framework bootstrap css files.
    3) js Directory - Contains the js files that power the front end application.  Includes a folder called lib that holds the Knockout framework files.
    4) README.md


## To configure the application on your PC

* Create a new folder locally on your PC that will hold the files to be cloned from the Neighborhood Map GitHub repository.

* Open a GitBash command line editor on your PC and navigate to the directory you created in the previous step.

* Clone the GitHub repository into this newly created folder by doing the following:

 1. Goto GitHub at [https://github.com/msmith7970/Neighborhood-Map](https://github.com/msmith7970/Neighborhood-Map).
 2. Under the repository name, Click "Clone or download".
 3. In the Clone with HTTP section, click the "Copy to clip board" option to copy the clone URL for the repository.
 4. Open Git Bash and navigate to the folder you created to store the repository in.
 5. Type ** git clone ** and then past the URL you copied.  It will look like the following:

          $ git clone https://github.com/msmith7970/Neighborhood-Map

 6.  Press **Enter** and your local clone will be created.  You will now have a
local copy of your fork of the Catalog App repository.
 7. On your PC navigate to that folder and open the index.html file with your web browser.


## Google Chrome

To install Google Chrome, visit:
[Google Chrome](http://www.browserwin.com/web/ "Google Chrome")
and follow the download instructions.


## Attribution

This web application was written by utilizing various concepts provided by the Udacity Front End course.  Other resources used was the developers documentation from the Google Maps API and Foursquare API.

## License

The content of this repository is licensed under MIT License.

Copyright (c) 2017 Mitchell Smith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
