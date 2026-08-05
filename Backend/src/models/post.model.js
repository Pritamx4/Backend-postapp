const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    caption:{
        type: String,
        trim: true,
        maxlength: 200,
    },
    imageFileId: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
