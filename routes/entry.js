const router = require("express").Router() ;
const Entry = require("../models/Entry") ;

// Create a new entry
router.post("/createEntry/:key/:value", async (req,res) => {
    const key = req.params.key ;
    const value = req.params.value ;

    console.log(key + " " + value) ;

    const newEntry = new Entry({
        "key" : key,
        "value" : value
    })

    try{
        const savedEntry = await newEntry.save() ;
        res.status(200).json({
            message : "Entry saved successully",
            entry : savedEntry
        })
    }
    catch(err){
        res.status(500).json({
            message : err
        })
    }
})

// Read an entry

// Update an entry

// Delete an entry
router.delete("/deleteEntry/:key" , async(req,res) => {
    try{
        const entryToDelete = await Entry.findOne({
            key : req.params.key
        })
        await Entry.findByIdAndDelete(entryToDelete._id) ;
        res.status(200).json({
            message : "Entry deleted successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message : err 
        })
    }
})

module.exports = router ;
