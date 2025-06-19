const User = require('../models/Users')
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authmiddleware = require("../middlewares/authMiddleware");
const router = require("express").Router();


router.post("/register", async (req, res) => {
    const {email, password, dob, firstName, lastName, phoneNumber} = req.body;

    try{
        if(!email || !password || !dob || !firstName || !lastName || !phoneNumber){
            return res.status(400).json({message: 'Wszystkie pola są wymagane!'});
        }
        const userCheek = await User.findOne({email: email});
        if(userCheek){
           return res.status(400).json({message: `Konto z emailem: ${email} już istnieje!`});
        }

        const newUser = new User({
            email: email,
            password: password,
            dob: dob,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        })
        await newUser.save()
        res.status(201).json({message:"Rejestracja przebiegła pomyślnie!"});
    }catch(err){
        res.status(500).json({message:"Server error!"});
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try{
        console.log('Login attempt:', { email, password });
        if(!email || !password){
            return res.status(400).json({message: "Wszystkie pola są wymagane!"});
        }
        const userCheek = await User.findOne({email: email})
        if(!userCheek){
            return res.status(400).json({message:"Nie znaleziono konta sparwdź dane!"});
        }


        if(await bcryptjs.compare(password, userCheek.password)){
            const token = jwt.sign(
                {userId: userCheek._id, email: userCheek.email, role: userCheek.role},
                process.env.JWT_SECRET,
                {expiresIn: "1h"}
            )

            res.json({token: token})
        }else {
            return res.status(400).json({message:"Nie prawidłowe hasło!"});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error!"});
    }
})

router.get('/name', authmiddleware,async (req, res) => {

    const use = await User.findById(req.user.userId)
    try{
        res.json(`${use.firstName} ` + `${use.lastName}`);
    }catch (e){
        res.status(500).json({message: "Server error! " + e});
    }
})

module.exports = router;
