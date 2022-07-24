const router = require("express").Router();
const Entry = require("../models/Entry");
const generateRandom = require("../generateRandomData");
const axios = require('axios');

const BACKEND_URL = "http://localhost:5000/api/entry";
const ENTRY_LIMIT = 10;
const TTL = 3600; // 1 hour

// Check if Entry Limit exceed, if exceed return true
async function checkIfEntryLimitReached() {
    const entryCount = await Entry.count({});
    return entryCount >= ENTRY_LIMIT ? 1 : 0;
}

// Check if TTL exceed, if exceed return true
async function checkIfTTLLimitExceed(TTL_Limit, lastActionAt) {
    const now_unixMs = Math.floor(new Date().getTime() / 1000);
    const lastActionAt_unixMs = Math.floor(new Date(lastActionAt).getTime() / 1000);
    var difference = (now_unixMs - lastActionAt_unixMs) ;
    return difference >= TTL_Limit ? 1 : 0;
}

// update last action date every get request and cache hit
router.put("/updateLastActionDate/:key", async (req, res) => {
    try {
        const entryToUpdate = await Entry.findOne({ key: req.params.key });
        const updatedEntry = await Entry.findByIdAndUpdate(entryToUpdate, {
            lastActionAt: Date.now()
        })
        res.status(200).json({
            message: "Last action time updated for " + req.params.key,
            entry: updatedEntry
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Create a new entry
router.post("/createEntry/:key/:value", async (req, res) => {
    const key = req.params.key;
    const value = req.params.value;

    const newEntry = new Entry({
        "key": key,
        "value": value,
        "lastActionAt": Date.now(),
    })

    try {
        const isEntryLimitReached = await checkIfEntryLimitReached();

        if (isEntryLimitReached) {
            await axios.delete(`${BACKEND_URL}/deleteOldest`);
        }
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
            // Chcek if TTL exceed
            const lastActionDate = await axios.get(`${BACKEND_URL}/getLastActionDate/${req.params.key}`) ;
            const isTTLExceed = await checkIfTTLLimitExceed(TTL,lastActionDate.data.lastActionAt) ;
            // if TTL exceed change value to another random generated string and update lastActionAt attribute
            if(isTTLExceed) {
                await axios.put(`${BACKEND_URL}/updateEntry/${req.params.key}`)
            }
            res.status(200).json({
                message: "Cache hit",
                entry: entryToFind
            })
        }
        else {
            const isEntryLimitReached = await checkIfEntryLimitReached();

            if (isEntryLimitReached) {
                await axios.delete(`${BACKEND_URL}/deleteOldest`);
            }
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
                value: generateRandom.generateRandomStringValue(5),
                lastActionAt : Date.now(),

            })
            res.status(200).json({
                message: updatedEntry
            })
        }
        else {
            res.status(200).json({
                message: "Given key is not exist in database"
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Get lastActionAt attribute by its key
router.get("/getLastActionDate/:key", async (req, res) => {
    try {
        const selectedEntry = await Entry.find({ key : req.params.key}) ;
        res.status(200).json({
            message : "Query returned successfully",
            lastActionAt : Object.values(selectedEntry)[0].lastActionAt 
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Get all keys, update all records last action date
router.get("/getAllKeys", async (req, res) => {
    try {
        const Entries = await Entry.find({});
        var keyArr = [];
        Object.values(Entries).forEach(element => {
            keyArr.push(element.key);
        });
        for (let i = 0; i < keyArr.length; i++) {
            // chcek if TTL exceed
            const lastActionDate = await axios.get(`${BACKEND_URL}/getLastActionDate/${keyArr[i]}`) ;
            const isTTLExceed = await checkIfTTLLimitExceed(TTL,lastActionDate.data.lastActionAt) ;
            // if TTL exceed change value to another random generated string and update lastActionAt attribute
            if(isTTLExceed) {
                await axios.put(`${BACKEND_URL}/updateEntry/${keyArr[i]}`)
            }

        }

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

// Delete oldest record in database
router.delete("/deleteOldest", async (req, res) => {
    try {
        const oldestRecord = await Entry.find().sort({ updatedAt: -1 }).limit(1);
        await axios.delete(`${BACKEND_URL}/deleteEntry/${Object.values(oldestRecord)[0].key}`);
        console.log("oldest data removed");
        res.status(200).json({
            message: "Oldest record removed from database"
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

// Delete all entries
router.delete("/deleteAll", async (req, res) => {
    try {
        await Entry.deleteMany();
        res.status(200).json({
            message: "All data successfully deleted"
        })
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

module.exports = router;
