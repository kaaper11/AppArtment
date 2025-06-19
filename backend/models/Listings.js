const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const listingsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    anvalible_dates: { type: [Date], required: true},
    images: { type: [String], required: true },
    owner: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model("Listing", listingsSchema);