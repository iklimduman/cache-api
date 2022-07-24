const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Entry = require("./models/Entry");
const entryRoute = require("./routes/entry");

const username = "YOUR USERNAME" ;
const password = "YOUR PASSWORD" ;
const dbName = "YOUR DB NAME" ;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.u9bnl.mongodb.net/${dbName}?retryWrites=true&w=majority`)
    .then(async () => {
        console.log("db connection is successfull");
        const recordCount = await Entry.count({});
        console.log(recordCount);
    })
    .catch(err => console.log(err));

app.use(express.json());

app.use("/api/entry", entryRoute);

app.listen(5000, () => {
    console.log("backend server is running")
});