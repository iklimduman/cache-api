const router = require("express").Router();
const Entry = require("../models/Entry");
const generateRandom = require("../generateRandomData") ;
const axios = require('axios') ;

const BACKEND_URL = "http://localhost:5000/api/entry"

// Create a new entry
router.post("/createEntry/:key/:value", async (req, res) => {
    const key = req.params.key;
    const value = req.params.value;

    console.log(key + " " + value);

    const newEntry = new Entry({
        "key": key,
        "value": value
    })

    try {
        const savedEntry = await newEntry.save();
        res.status(200).json({
            message: "Entry saved successully",
            entry: savedEntry
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Read an entry
router.get("/find/:key", async (req, res) => {
    try {
        const entryToFind = await Entry.findOne({
            key: req.params.key
        })
        if (entryToFind) {
            res.status(200).json({
                message: "Cache hit",
                entry: entryToFind
            })
        }
        else{
            const randomGeneratedString = generateRandom.generateRandomStringValue(5) ;
            const createNewEntry = await axios.post(`${BACKEND_URL}/createEntry/${req.params.key}/${randomGeneratedString}`) ;
            res.status(200).json({
                message : "Cache miss",
                entry : {
                    message : "Random data is generated and saved into database succesfully",
                    data : {
                        key : createNewEntry.data.entry.key ,
                        value : createNewEntry.data.entry.value
                    }
                }
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Update an entry

// Get all keys

// Delete an entry
router.delete("/deleteEntry/:key", async (req, res) => {
    try {
        const entryToDelete = await Entry.findOne({
            key: req.params.key
        })
        await Entry.findByIdAndDelete(entryToDelete._id);
        res.status(200).json({
            message: "Entry deleted successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Delete all entries

module.exports = router;
