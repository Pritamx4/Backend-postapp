const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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