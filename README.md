# Find Your Way
A trip planning application for Winnipeg, Manitoba

## Project Notes
URL: https://adam-find-your-way.netlify.app

## SD105 Final Project
This is an individual project. Complete and submit your own work.

### Submission
Your submission is due no later than 4:00PM on Sunday, January 10, 2021.

* Late submissions will be accepted with a grade penalty of 20% per day late beginning immediately after the due date and time.

Submit a .zip file containing all the files necessary to build and run your app. Include the URL of your hosted app in a README.md file in the root directory of your project.

* Label your zip file as follows: firstname-lastname-final-project.zip
* **DO NOT** include your `node_modules` or `.git` folders in your submission.

### Instructions
For this project, you will build a trip planning application using the [Geocoding APIof MapBox](https://docs.mapbox.com/api/search/)  and the [Trip Planning API from Winnipeg Transit](https://api.winnipegtransit.com/home/api/v3/services/trip-planner).

* Download the starter HTML and CSS files required for the project

* View the [demo app](https://mitttrip.web.app/) to see a basic version of the application in action

#### There are 3 main components to the trip planning application:
1. Selecting the origin (or starting location)
2. Selecting the destination
3. Displaying the planned trip

#### Selecting and Displaying the Origin and Destination
Provide the user with 2 input boxes. Each input box belongs to it's own form and should be submitted with the `return/enter` key.

Upon submission of one of the submit boxes, execute an API call to the MapBox API to get a forward geocode on the search value using the endpoint `mapbox.places`.

Use the `bbox` option which will limit geocoding to a border box. The border box around the Winnipeg area can be defined by the following coordinates -97.325875, 49.766204, -96.953987, 49.99275. Your application should display the maximum number of results possible, based on the results returned by the API call and should <ins>not</ins> limit the results to any particular `type` (neighborhood, poi, address, etc.)

Users should be able to click on a result to mark it `selected`. Check out the sample HTML and notice the `selected` class of the highlighted result. Upon clicking a different result, the `selected` class switches and a different element becomes active.

Once a user has selected a starting point and a destination, they can click the `plan my trip` button. If there isn't at least 1 starting location and 1 destination selected, clicking the plan my trip button should display an appropriate message to the user.

#### Trip Planning
After you have all the necessary information (starting point latitude and longitude, and destination latitude and longitude) you can now make call to the Winnipeg Transit Trip Planning API. You will need to add 2 options to your API call: `origin=geo/originLat,originLong` and `destination=geo/destinationLat,destinationLong`, where `destinationLat`, `destinationLong`, `originLat` and `originLong` are determined by your input data.

Assuming there are results, which is likely, you will receive one or more different options for trips. Display a 'recommend trip' and 'alternative trips' based on the data returned by the API call.

Trips are broken down into segments, with each segment having slightly different information. Refer to the `Noteworthy Results` in the documentation to see what different types of segments are available and what different pieces of information are available in each.

Pay attention to the details! For example, notice that the first word of each sentence in the trip plan is capitalized.

#### **TIPS**
* There are many little pieces to this project but nothing exceptionally difficult. Plan ahead and split the problem into small parts.
* Don't get stuck on one thing for too long, get something working even if it doesn't necessarily contain everything required. It is much better to submit something incomplete but working than 'complete' but not working at all.
* You have a lot of time, but don't wait too long to start. This project can be deceptively difficult.
* Functions are your friends. Your code may get out of control and very difficult for you to manage if you don't use them effectively.
* Pay attention to your console. Handle ALL errors and warnings, even if they pre-exist in the provided starter files.

#### Edge Cases
Edge cases are scenarios where your app is used differently than intended. It's always good practice to anticipate what might go wrong with your app and handle any edge cases you can think of. Test your application thoroughly at try to find ways to break it.

You are required to handle at least the following edge cases, including providing feedback to the user (no browser alerts!):

* No search result in either the origin or destination
* Clicking the plan my trip button with incomplete origin and/or destination fields
* Clicking the plan my trip button when origin and destination are the same
* No trips data is available (this can happen a lot late at night when there are no buses running)
