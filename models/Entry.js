const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
    {
        key : {
            type : String,
            required : true,
            unique : true
        },
        value : {
            type : String,
            required : true,
            unique : true
        },
        lastActionAt : {
            type : Date,
            default : Date.now()
        },
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("User", EntrySchema) ;