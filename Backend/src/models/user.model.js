const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false, // Exclude password field from query results by default
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the user
userSchema.pre("save", async function () {
    if(!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;