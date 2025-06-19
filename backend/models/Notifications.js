const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const notificationSchema = new Schema({
    toWhom:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:{ type: String, required: true },
    time: {type: Date, default: Date.now},
    type: {type: String, required: true}
})

module.exports = mongoose.model("Notifications", notificationSchema);