const jwt = require("jsonwebtoken");
const router = require("express").Router();
const authmiddleware = require("../middlewares/authMiddleware");
const {json} = require("express");
const multer = require("multer");
const path = require("path");
const Listings = require("../models/Listings");
const Reservation = require("../models/Reservations");
const Notification = require("../models/Notifications");
const mongoose = require("mongoose");
const User = require('../models/Users')
const Rating = require("../models/Rating");
const Message = require("../models/Messages");
const err = require("multer/lib/multer-error");




router.get("/allUsers",async  (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    }catch(err) {
        return res.status(500).json({message:`Server error: ${err.message}`});
    }
})

router.get("/allListings",async  (req, res) => {
    try{
        const list = await Listings.find()
        console.log(list)
        res.json(list)
    }catch(err) {
        return res.status(500).json({message:`Server error: ${err.message}`});
    }
})


router.delete("/deleteListing/:id",async  (req, res) => {
    const {id} = req.params;

    try {
        await Reservation.deleteMany({idListing: id})
        await Rating.deleteMany({idListing: id})
        await Message.deleteMany({idListing: id})

        const deleteListing = await Listings.findByIdAndDelete(id)

        if (!deleteListing) {
            return res.status(404).json({message:`Ogłoszenie nie znalezione!`});
        }
        return res.status(200).json({ message: "Ogłoszenie usunięte pomyślnie" });

    }catch(err) {
        return res.status(500).json({message:`Server error: ${err.message}`});
    }
})

router.delete("/deleteUser/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const userListings = await Listings.find({ owner: id });
        const listingIds = userListings.map(listing => listing._id.toString());

        await Listings.deleteMany({ owner: id });
        await Reservation.deleteMany({ idUser: id });
        await Reservation.deleteMany({ idListing: { $in: listingIds } });
        await Rating.deleteMany({ idUser: id });
        await Message.deleteMany({ $or: [{ senderId: id }, { receiverId: id }] });
        await Notification.deleteMany({ toWhom: id });

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        return res.status(200).json({ message: "Użytkownik usunięty pomyślnie" });

    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` });
    }
});





router.post("/sendDanger/:id",async  (req, res) => {

    const {message} = req.body;
    const {id} = req.params;
    const type = "Uwaga"
    console.log(message);


    try{
        if (!message) {
            return res.status(400).json({message: "Wypełnij pole z uwagą!"})
        }


            const newNotification = new Notification({
                toWhom: id,
                message: message,
                time: Date.now(),
                type: type
            })
            await newNotification.save()
        console.log(message)

    }
    catch(err) {
        return res.status(500).json({message:`Server error: ${err.message}`});
    }

})



module.exports = router;