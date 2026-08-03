const express = require("express");
const postModel = require("./models/post.model");
const multer = require("multer");
const uploadFile = require("./services/storage.service");

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
app.patch("/update-post/:id", upload.single("image"), async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // Update the post with the new data
  Object.assign(post, req.body);
  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    post,
  });
});

// delete api
app.delete("/delete-post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.findByIdAndDelete(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }
  return res.status(200).json({
    message: "Post deleted successfully",
  });
});

module.exports = app;
