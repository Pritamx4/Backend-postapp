const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  image: String,
  caption: String,
  imageFileId: String, // Store the ImageKit file ID for future reference
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;