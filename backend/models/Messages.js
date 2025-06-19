const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    idListing: { type: Schema.Types.ObjectId, ref: "Listing",required: true },
    message: { type: String, required: true },
    time: {type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model("Message", messageSchema);