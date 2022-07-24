const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test_user:testuser@cluster0.u9bnl.mongodb.net/fashionCloud?retryWrites=true&w=majority")
    .then(() => console.log("db connection successull"))
    .catch(err => console.log(err));

app.listen(5000, () => {
    console.log("backend server is running")
});