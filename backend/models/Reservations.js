const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const ratingSchema = new Schema({
    idListing: {type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true},
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    dateFrom: {type: Date, required: true},
    dateTo: {type: Date, required: true}
})

module.exports = mongoose.model('Reservations', ratingSchema);