const mongoose = require("mongoose");
const router = require("express").Router();
const Reservation = require("../models/Reservations");
const authmiddleware = require("../middlewares/authMiddleware");
const Listings = require("../models/Listings");
const Notification = require("../models/Notifications");
const User = require("../models/Users");
const e = require("express");

const isDateOverlap = (dateFrom, dateTo, reservedFrom, reservedTo) => {
    return !(dateTo <= reservedFrom || dateFrom >= reservedTo);
}

router.post(`/reservation`, authmiddleware,async (req, res) => {
    const {idListing, dateFrom, dateTo} = req.body;

    if(!idListing){
       return res.status(400).json({message:"Ogłoszenie nie istnieje!"});
    }


    const reservations = await Reservation.find({idListing})
    const listings = await Listings.findById(idListing)

    if(req.user.userId === listings.owner.toString()){
        return res.status(400).json({message: "Nie możesz wynająć własnego ogłoszenia!"})
    }

    if(reservations.some(reservation => {return isDateOverlap(new Date(dateFrom), new Date(dateTo), new Date(reservation.dateFrom), new Date(reservation.dateTo))})){
        return res.status(400).json({message:"W tym terminie ktoś wynajął już obiekt!"})
    }
    try{
        const newReserwations = new Reservation({
            idListing: new mongoose.Types.ObjectId(idListing),
            idUser: req.user.userId,
            dateFrom: dateFrom,
            dateTo: dateTo
        })
        await newReserwations.save();

        const newNotification = new Notification({
            toWhom: req.user.userId,
            message: "Gratulujemy pomyślnej rezerwacji!",
            time: Date.now(),
            type:"Rezerwacja"
        })
        await newNotification.save();

        const newNotificationTwo = new Notification({
            toWhom: listings.owner,
            message: "Halo, ktoś właśnie wynajął Twój obiekt!",
            time: Date.now(),
            type:"Rezerwacja"
        })
        await newNotificationTwo.save();

        res.status(201).json({message: "Rezerwacja przebigła pomyślnie"});

    }catch(err){
        res.status(400).json({message:"Server Error"});
        console.log(err)
    }
})

router.get('/myres',authmiddleware,async (req, res) => {

    try {

        const list = await Listings.find({owner: req.user.userId})
        const rese = []
        const name = []
        const finish = []


        for (const x of list){
            let a = await Reservation.find({idListing: x._id})
            name.push(...a)
            if(a.length > 0){
            rese.push(x)}

        }


        for (let x of name){
            let us = await User.findById(x.idUser)
            finish.push(`${us.firstName} ${us.lastName}`)

        }

        res.json({rese, finish, name})

    }catch (e){
        res.status(500).json({message: "Server Error " + e});
    }
})

router.get('/ires',authmiddleware,async (req, res) => {
    try {
        const rese2 = await Reservation.find({idUser: req.user.userId})
        console.log(rese2)
        const list  = []
        const name2 = []

        for(const x of rese2){
            let a = await Listings.findById(x.idListing)
            list.push(a)
        }
        for(const x of list){
            let b = await User.findById(x.owner)
            name2.push(`${b.firstName} ${b.lastName}`);
        }


        res.json({list,name2,rese2})
    }catch (e){
        res.status(500).json({message: "Server Error " + e});
    }
})

router.get("/persRes/:id",authmiddleware,async (req, res) => {
    const {id} = req.params
    const names = []
    try{
        const rese = await Reservation.find({idListing: id})

        for(const x of rese){
            let one = await User.findById(x.idUser)
            names.push(`${one.firstName} ${one.lastName}`);
        }
        console.log(rese)

        res.json({rese, names})
    }catch(err){
        res.status(500).json({message: "Server Error " + e});
    }
})

router.get("/oneRese/:id",authmiddleware,async (req, res) => {
    const {id} = req.params
    const userid = req.user.userId
    try{
        const rese = await Reservation.find({idListing: id})
        const list = await Listings.findById(id)
        const user = await User.findById(list.owner)

        for(const x of rese){
            if (userid === x.idUser.toString()){
                return res.json({x,user})
            }
        }
        res.status(404).json({message: "Brak rezerwacji"})

    }catch(err){
        res.status(500).json({message: "Server Error " + err});
    }
})


module.exports = router;