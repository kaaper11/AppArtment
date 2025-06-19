const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const ratingRoutes = require("./routes/ratings");
const reservationRoutes = require("./routes/reservations");
const notificationRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

dotenv.config();
console.log("Startuję serwer...");

const app = express();

app.use("/images", express.static("public/images"));

app.use(cors({
    origin: "http://localhost:3000", // tylko Twój frontend
    credentials: true               // pozwala na cookies/sesje
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API DZIAŁĄ")
})

app.use(`/api/auth`, authRoutes)
app.use(`/api/listings`, listingRoutes)
app.use(`/api/ratings`, ratingRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)

mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => {
        console.log("Połączono z MongoDB");
        app.listen(process.env.PORT, () => {
        console.log(`Serwer działa na porcie ${process.env.PORT}`);
    })
    })
    .catch(err => {
        console.log("Błąd");
        console.log(err)
    });

