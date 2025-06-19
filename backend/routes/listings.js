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
const User = require("../models/Users");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });


router.post("/create", authmiddleware, (req, res, next) => {
    upload.array("images")(req, res, function (err) {
        if (err) return res.status(400).json({ message: "Błąd uploadu zdjęcia" });
        next();
    });
}, async (req, res) => {
    console.log("✅ REQ.BODY:", req.body);
    console.log("✅ REQ.FILE:", req.file);

    try {
        const data = JSON.parse(req.body.data);
        const { title, description, price, location, anvalible_dates } = data;

        const owner = req.user.userId;
        const imagePaths = req.files.map(file => `/images/${file.filename}`);

        const newListing = new Listing({
            title,
            description,
            price,
            location,
            anvalible_dates,
            images: imagePaths,
            owner
        });
        await newListing.save();


        const newNotification = new Notification({
            toWhom: owner,
            message: "Twoje ogłoszenie jest już widoczne!",
            time: Date.now(),
            type: "Informacja"
        })
        await newNotification.save();



        res.status(201).json({ message: "Dodano ogłoszenie!" });

    } catch (err) {
        console.error("❌ Błąd serwera:", err.message);
        res.status(500).json({ message: "Błąd serwera!" });
    }
});


router.get("/search", async (req, res) => {
    const { location, title,  dateFrom, dateTo, sort = "createdAt", page = 1, limit = 10 } = req.query;



    console.log("FULL URL:", req.url);
    console.log("QUERY:", req.query);



    const query = {};
    console.log(req.query.dateFrom);


    if(location || title) {
        query.$or = []

        if (location) {
            query.$or.push({ location: { $regex: location, $options: "i" } });
        }
        if (title) {
            query.$or.push({ title: { $regex: title, $options: "i" } })
        }
    }
    try {
        const sortCriteria = sort === "createdAt" ? { createdAt: -1 } : {};

        const list = await Listing
            .find(query)
            .sort(sortCriteria)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
        const list2 = []

        if (dateFrom !== 'undefined' && dateTo !== 'undefined') {
            const start = new Date(dateFrom);
            const end = new Date(dateTo);
        for (const x of list) {
            if (x.anvalible_dates[0] <= start && x.anvalible_dates[1] >= end) {
                list2.push(x)
            }
        }
            res.json(list2);
        }else{
            res.json(list);
        }

    } catch (err) {
        res.status(500).json({ message: "Błąd serwera!" });
    }
});

router.get("/offert", authmiddleware, async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.user.userId);


    if(!userId){
        return res.status(400).json({message: "Użytkownik nie istnieje!"})
    }
    try{
        const list = await Listings.find({owner: userId})
        res.json(list)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
})



router.get('/res', authmiddleware, async (req, res) => {
    const owner = req.user.userId

    if(!owner){
        return res.status(400).json({message: "Zaloguj się lub zarejestruj!"})
    }

    try{
        const list = await Reservation.find({idUser: owner})

    const finall = await Promise.all(
        list.map(async (res) => {
            return await Listing.findById(res.idListing)
    }))

        const filtered = finall.filter(listing => listing !== null);

        res.json(filtered);
    }catch(err){
        res.status(400).json({message: "Server Error"});
    }
})


router.get("/random", async (req, res) => {
    try {
        const maxFour = await Listing.aggregate([
            { $sample: { size: 4 } }
        ])
        res.json(maxFour);
    }catch (e){
        res.status(500).json({message: "server Error " + e})
    }
})


router.put("/update/:id",authmiddleware, async (req, res, next) => {

    upload.array("images")(req, res, function (err) {
        if (err) return res.status(400).json({ message: "Błąd uploadu zdjęcia" });
        next();
    });
}, async (req, res) => {
    console.log("✅ REQ.BODY:", req.body);
    console.log("✅ REQ.FILE:", req.file);


    const {id} = req.params;
    const owner = req.user.userId

    const data = JSON.parse(req.body.data);
    const { title, description, price, location, anvalible_dates } = data;


    const imagePaths = req.files.map(file => `/images/${file.filename}`);


    const list = await Listing.findById(id)
    if(!list){
        return res.status(404).json({message:"Ogłoszenie nie istnieje!"})
    }

    if(list.owner.toString() !== owner) {
        return res.status(403).json({message:"Nie możesz edytować nie swojego wydarzenia!"})
    }

    try {
        const updatedList = await Listing.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    price,
                    location,
                    anvalible_dates,
                    images: imagePaths,
                }
            },
        {new: true}
        )

        const newNotification = new Notification({
            toWhom: owner,
            message: "Twoje ogłoszenie zostało zaktualizowane!",
            time: Date.now(),
            type: "Informacja"
        })
        await newNotification.save();

        res.json(updatedList);
    }catch(err){
        res.status(500).json({message: "Błąd serwera!"})
    }

})

router.delete("/delete/:id", authmiddleware, async (req, res) => {
    const {id} = req.params;
    const owner = req.user.userId

    const list = await Listing.findById(id)
    const rese = await Reservation.find({idListing: id})
    if(!list){
        return res.status(404).json({message:"Ogłoszenie nie istnieje!"})
    }

    if(list.owner.toString() !== owner) {
        return res.status(403).json({message:"Nie możesz usunąć nie swojego wydarzenia!"})
    }
    try {
        await Listing.findByIdAndDelete(id)
        await Reservation.deleteMany({idListing: id})

        const newNotification = new Notification({
            toWhom: owner,
            message: "Twoje ogłoszenie zostało usunięte!",
            time: Date.now(),
            type: "Informacja"

        })
        await newNotification.save();

        for(const p of rese){
            if(!(p.dateTo < Date.now())){
                const notification = new Notification({
                    toWhom: p.idUser,
                    message: "Ogłoszenie lokalu, który wynająłeś zostało usunięte. Ustal szczegóły z właścicielem.",
                    time: Date.now(),
                    type: "Uwaga"
                })
                await notification.save();
            }
        }


        res.status(200).json({message: "Usunięto ogłoszenie!"});
    }catch(err){
        return res.status(500).json({message: "Błąd serwera!"})
    }

})

router.get("/:id", async (req, res) => {
    const {id} = req.params;

    try{

        const list = await Listing.findById(id)
        if(!list){
            return res.status(404).json({message: "Takie ogłoszenie nie istnieje!"})
        }
        console.log(list)

        const user = await User.findById(list.owner)

        res.status(200).json({list, user});
    }catch(err){
        res.status(500).json({message: "Błąd serwera!"})
    }
})



router.get('/availability/:listingId', async (req, res) => {
    const {listingId} = req.params;

    if(!listingId){
        return res.status(400).json({message: "Ogloszenie nie isteniej!"})
    }
    try{
        const list = await Listings.findById(listingId)
        const reservations = await Reservation.find({idListing: listingId})

        res.json({
            availableFrom: list.anvalible_dates[0],
            availableTo: list.anvalible_dates[1],
            reserved: reservations.map(r => ({
                from: r.dateFrom,
                to: r.dateTo
            }))
        });
    }catch(err){
        res.status(400).json({message:"Server Error"});
    }
})






module.exports = router;