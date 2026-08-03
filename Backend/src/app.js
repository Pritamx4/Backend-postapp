const express = require("express");
const postModel = require("./models/post.model");
const multer = require("multer");
const {uploadFile , deleteFile} = require("./services/storage.service"); //call both func.

const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });


// post api
app.post("/create-post", upload.single("image"), async (req, res) => {
  // Implementation for creating a post

  const result = await uploadFile(req.file.buffer);

  const post = await postModel.create({
    image: result.url,
    // Add other post fields as needed
    caption: req.body.caption,
    imageFileId: result.fileId, // Store the ImageKit file ID for future reference
  });
  return res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

// get api
app.get("/posts", async (req, res) => {
  const posts = await postModel.find();
  return res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

// update api
app.patch("/update-post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // Update the post with the new data
  post.caption = req.body.caption || post.caption;
  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    post,
  });
});

// delete api
app.delete("/delete-post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }
  console.log(post)
  console.log(post.imageFileId)
  await deleteFile(post.imageFileId);// Delete the image from ImageKit
  await postModel.findByIdAndDelete(postId);// Delete the post from MongoDB
  return res.status(200).json({
    message: "Post deleted successfully",
  });
});

module.exports = app;
