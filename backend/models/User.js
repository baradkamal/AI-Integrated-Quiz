const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true, trim: true,lowercase: true },
    age: Number,
    username: { type: String, require: true },
    password: { type: String, require: true },
    isAdmin: {type: Boolean, default: false},
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;