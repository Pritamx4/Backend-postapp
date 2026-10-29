const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    posts: {
        type: Number,
        default: 0,
    },
});

const profileModel = mongoose.model("Profile", profileSchema);

module.exports = profileModel;
