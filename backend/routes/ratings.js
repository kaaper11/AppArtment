const Rating = require("../models/Rating");
const router = require("express").Router();
const authmiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const reservation = require("../models/Reservations");
const users = require("../models/Users");
const Notification = require("../models/Notifications");
const Listing = require("../models/Listings");

router.post(`/add/:id`, authmiddleware,async (req, res) => {
    const { rate, comment } = req.body;

    const {id} = req.params;

    const owner = req.user.userId

    const cheek = await reservation.find({idUser : owner})

    const list = await Listing.findById(id)

    const finall = cheek.some(i => i.idListing.toString() === id.toString());

    const cheekTwo = await reservation.find({idUser : owner, idListing : id})

    for (const x of cheekTwo) {
        if (x.dateTo > new Date()) {
            return res.status(400).json({message: "Twój pobyt jeszcze się nie skończył, oceny możesz dokonać po powrocie do domu ;)"})
        }
    }

    if (!finall) {
        return res.status(400).json({message:"Nie wynajmowałeś nigdy tego lokalu!"});
    }
    const cheek2 = await Rating.find({idUser: owner})
    const finall2 = cheek2.some(i => i.idListing.toString() === id.toString());

    if (finall2) {
        return res.status(400).json({message: "Oceniłeś juz ten pobyt!"})
    }

    if (rate > 5 || rate <= 0){
        return res.status(400).json({message: "Nieprawidłowa ocena!"});
    }
    console.log(req.body);
    try{
        const newRatings = new Rating({
        idListing: id,
        idUser: req.user.userId,
        rate: rate,
        comment: comment
        })
        await newRatings.save();


        const newNotificationTwo = new Notification({
            toWhom: list.owner,
            message: "Halo, ktoś właśnie ocenił Twoje ogłoszenie sprawdź to szybko!",
            time: Date.now(),
            type: "Ocena"
        })
        await newNotificationTwo.save();

        res.status(201).json({message: "Ocena zosatła dodana!"});
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }

})

router.get("/view/:listingId", async (req, res) => {
    const listingId = req.params.listingId;
    const page  = 1
    const limit = 3
    const sort = "createdAt"
    const names = []

    try{
        const sortCriteria = sort === "random" ? { random: -1 } : {};

        const ratings = await Rating
            .find({idListing: listingId})
            .sort(sortCriteria)
            .skip((page -1) * limit)
            .limit(parseInt(limit))

        const full = await Rating.aggregate([
            { $match: { idListing: new mongoose.Types.ObjectId(listingId) } },
            { $sample: { size: 3 } }
        ]);

        for(const x of full) {
            const user = await users.findOne({_id: x.idUser})
            if (user){
                names.push(user.firstName)
            }
        }



        // if (ratings.length === 0) {
        //     return res.status(404).json({message: "Brak ocen do ogłoszenia!"});
        // }
        const avg = (ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length).toFixed(2);

        res.json({full, avg, names})
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }

})


module.exports = router;