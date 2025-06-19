const Listing = require(`../models/Listings`);
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
const Message = require("../models/Messages");


router.post("/send", async (req, res) => {
    const{senderId, receiverId, idListing, message} = req.body;


    const si = new mongoose.Types.ObjectId(senderId);
    const ri = new mongoose.Types.ObjectId(receiverId);
    const il = new mongoose.Types.ObjectId(idListing);

    const newMessage = new Message({
        senderId: si,
        receiverId: ri,
        idListing: il,
        message: message
        }
    );
    await newMessage.save();
    res.status(200).json(newMessage);
})



router.get("/:user1/:user2/:listingId",authmiddleware, async (req, res) => {
    const { user1, user2, listingId } = req.params;
    console.log("user1:", user1, "user2:", user2, "listingId:", listingId);


    const u1 = new mongoose.Types.ObjectId(user1);
    const u2 = new mongoose.Types.ObjectId(user2);
    const li = new mongoose.Types.ObjectId(listingId);

    const messages = await Message.find({
        idListing: listingId,
        $or: [
            { senderId: u1, receiverId: u2 },
            { senderId: u2, receiverId: u1 }
        ]
    }).sort({timestamp: 1})

    res.json(messages);
})

module.exports = router;