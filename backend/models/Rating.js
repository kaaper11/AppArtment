const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const ratingSchema = new Schema({
    idListing: {type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true},
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rate: {type: Number, default: 5, required: true, min: 0, max: 5},
    comment: {type: String, required: false, default: ""}
})

module.exports = mongoose.model("Rating", ratingSchema);