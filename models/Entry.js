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
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("User", EntrySchema) ;