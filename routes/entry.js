const router = require("express").Router();
const Entry = require("../models/Entry");
const generateRandom = require("../generateRandomData");
const axios = require('axios');

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

// Read an entry by given key, if the key is not exist in the db generate a random value and save into db with given key.
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
        else {
            const randomGeneratedString = generateRandom.generateRandomStringValue(5);
            const createdNewEntry = await axios.post(`${BACKEND_URL}/createEntry/${req.params.key}/${randomGeneratedString}`);
            res.status(200).json({
                message: "Cache miss",
                entry: {
                    message: "Random data is generated and saved into database succesfully",
                    data: {
                        key: createdNewEntry.data.entry.key,
                        value: createdNewEntry.data.entry.value
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

// Update an entry with given key. If the key is exist generate a new random value and update key/value pair
router.put("/updateEntry/:key", async (req, res) => {
    try {
        const entryToUpdate = await Entry.findOne({ key: req.params.key });
        if (entryToUpdate) {
            const updatedEntry = await Entry.findByIdAndUpdate(entryToUpdate, {

                key: req.params.key,
                value: generateRandom.generateRandomStringValue(5)

            })
            res.status(200).json({
                message: updatedEntry
            })
        }
        else{
            res.status(200).json({
                message : "Given key is not exist in database"
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Get all keys
router.get("/getAllKeys", async (req, res) => {
    try {
        const Entries = await Entry.find({});
        var keyArr = [];
        Object.values(Entries).forEach(element => {
            keyArr.push(element.key)
        });
        console.log(keyArr);
        res.status(200).json({
            message: "Query returned successfully",
            "Keys stored in the db": keyArr
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

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
router.delete("/deleteAll", async(req,res) => {
    try{
        await Entry.deleteMany() ;
        res.status(200).json({
            message : "All data successfully deleted"
        })
    }
    catch(err){
        res.status(500).json({
            message: err
        })
    }
})

module.exports = router;
