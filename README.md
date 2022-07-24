## fashion-cloud-interview

# How to Run

To run this application initially run "npm install" to download required node modules then type "npm start" to run the application. 
You can reach the appliaction from port 5000.

To connect database write your own cretentials(username, password, dbName) to associated areas in index.js file.


# Features

This API allows you to 
 - Create
 - Read
 - Update
 - Delete
random cached data on MongoDB database.

Database has entry limit of 10 records. If you want to increase/decrease this limit change the constant called "ENTRY_LIMIT" on entry.js file.

Every item in database has TTL(Time To Live) value, by default this value is 3600, which is 1 hour by miliseconds. If you want to change this value, change the constant called "TTL" on entry.js file.