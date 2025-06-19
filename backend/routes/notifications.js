const Rating = require("../models/Rating");
const router = require("express").Router();
const authmiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const reservation = require("../models/Reservations");
const users = require("../models/Users");
const Notification = require("../models/Notifications");
const Listing = require("../models/Listings");

router.get("/notifi",authmiddleware,async (req, res) => {
    const owner = req.user.userId

    try{
        const list = await Notification.find({toWhom: owner})

        res.json(list)

    }catch(err){
        res.status(500).json({message:"Server Error" + err})
    }
})

router.delete("/delete/:id",authmiddleware,async (req, res) => {
    const { id } = req.params;
    const owner = req.user.userId

    const list = await Listing.findById(id)
    // if(list.owner.toString() !== owner) {
    //     return res.status(403).json({message:"Nie możesz usunąć cudzych powaidomień!"})
    // }

    try{
        console.log("wiam")
        await Notification.findByIdAndDelete(id)
        return res.status(200).json({ message: "Usinięto powiadomienie" });
    }catch(err){
        res.status(500).json({message:"Server Error" + err})
    }
})

module.exports = router;