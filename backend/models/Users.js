const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, unique: false },
    role: { type: String, required: true, default: "user" },
    dob: { type: Date, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password,10)
    next();
})

module.exports = mongoose.model("User", userSchema);