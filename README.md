# eventshuffle-api

Eventshuffle is an application for scheduling events. Like http://doodle.com/ but stripped features. Application is used through API. Users can list, create, show, vote and show results of events. 

## 1. Features
---

#### **List**

Users can view events using /list command. This is done by sending GET request to 
````
HOST/api/v1/event/list
````
List command returns events array with event IDs and names

#### **Create**

Users can create events to Eventshuffle. This is done by sending POST request to 
````
HOST/api/v1/event
````
Request body must have following content
````
{
    name: "Name of event",
    dates: ["2001-01-01", "2001-2-2"]
}
````

Dates must be array of date strings. Date must be valid date string (dates are converted to JavaScript Date objects). So any date valid for Date object is valid for Eventshuffle. Response contains ID of created event.

#### **Show**

Users can get event's details. This is done by sending GET request to 
````
HOST/api/v1/event/EVENT_ID
````

EVENT_ID is id of the event. Response contains event's details contains following information:
- id: Event's id
- name: Event's name
- dates: Event's dates
- votes: Array of vote objects containing information which people have voted which date. 

#### **Vote**

Users can vote events on Eventshuffle. This is done by sending POST request to 
````
HOST/api/v1/event/EVENT_ID/vote
````
EVENT_ID is id of the event. Request body must have following content
````
{
    name: "Name of the voter",
    dates: ["2001-01-01", "2001-2-2"]
}
````
Dates must be array of dates suitable for the voter. Response contains details of event (id, name, dates, votes).

#### **Results**

Users can check out event's results. This is done by sending GET request to 
````
HOST/api/v1/event/EVENT_ID/results
````
EVENT_ID is id of the event. Response contains following information: 
- id: Event's id
- name: Event's name
- suitableDates: Array of objects (contains date of event and people who have voted the date). suitableDates array contains all of the dates of event which are suitable for ALL participants of event.

## 2. Technologies
---
Node.js (https://nodejs.org/en/) and Express (https://expressjs.com/) web framework is used for creating API. 

Mocha (https://mochajs.org/) and Chai (https://www.chaijs.com/) are used for API unit tests. 

MongoDB (https://www.mongodb.com/) is used for storing data. 

## 3. Setup
---

Project requires Node.js. This can be downloaded from (https://nodejs.org/en/). Project was done using latest version of Node.js (14.15.4 at the time) so recommendation is to use it.  

After installing Node.js to your enviroment clone project to your machine. After that run 
````
npm install
````
in project folder. This install project dependencies.

Project also needs MongoDB installation on your machine. MongoDB install tutorial and link can be found from (https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials). Select your OS under community edtion. Depending on your machine installation and MongoDB setup may differ. 

Project was done with Windows 10 and installation was done as Windows Service. 

After database installation you have to add .env -file. .env file should be located in /env folder.

.env file must contain following information 
````
MONGO_DB_URL=mongodb://localhost:27017/test // URL to your MongoDB service

MONGO_DB_EVENTS_DATABASE=eventsDatabase // Event database name
MONGO_DB_EVENTS_COLLECTION=events // Events collection name
MONGO_DB_TEST_EVENTS_DATABASE=testEventsDatabase // Unit test database

EXPRESS_PORT=3000 // Port of Events API

NODE_ENV=development // Enviroment. If 'development' logging will be done to console. If 'production' logging will be done to /logs folder.

TEST_ENV_DROP_DB_AFTER_TEST=true // If 'true' and NODE_ENV is 'development', test database will be droppped after tests are executed. 
````

After this application should be ready to run!
## 4. Running
---

Start application
```` 
npm start
````

Start unit tests
```` 
npm test
````