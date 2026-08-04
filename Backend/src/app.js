const express = require("express");
const postModel = require("./models/post.model");
const multer = require("multer");
const { uploadFile, deleteFile } = require("./services/storage.service"); //call both func.
const cors = require("cors");
const userModel = require("./models/user.model");

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });


// post APIs



app.get("/", (req, res) => {
    res.status(200).json({ message: "Post API is running" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// post api
app.post("/create-post", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        const result = await uploadFile(req.file.buffer);

        const post = await postModel.create({
            image: result.url,
            caption: req.body.caption,
            imageFileId: result.fileId,
        });
        return res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (err) {
        console.error("Failed to create post:", err);
        return res.status(500).json({
            message: "Failed to create post",
        });
    }
});

// get api
app.get("/posts", async (req, res) => {
    try {
        const posts = await postModel.find();
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (err) {
        console.error("Failed to fetch posts:", err);
        return res.status(500).json({
            message: "Failed to fetch posts",
            posts: [],
        });
    }
});

// update api
app.patch("/update-post/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        post.caption = req.body.caption || post.caption;
        await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
            post,
        });
    } catch (err) {
        console.error("Failed to update post:", err);
        return res.status(500).json({
            message: "Failed to update post",
        });
    }
});

// delete api
app.delete("/delete-post/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        await deleteFile(post.imageFileId);
        await postModel.findByIdAndDelete(postId);
        return res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (err) {
        console.error("Failed to delete post:", err);
        return res.status(500).json({
            message: "Failed to delete post",
        });
    }
});



// users APIs



// users
app.post("/users", async (req, res) => {
    const users = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    res.status(200).json({
        message: "User created successfully",
        users: {
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
        },
    });
});

// get user
app.get("/users", async (req, res) => {
    const users = await userModel.find({}, { password: 0 }); // Exclude password field from the response
    res.status(200).json({
        message: "Users fetched successfully",
        users: users,
    });
});

// get user by id
app.get("/users/:id", async (req, res) => {
    const user = await userModel.findById(req.params.id, { password: 0 }); // Exclude password field from the response
    res.status(200).json({
        message: "User fetched successfully",
        user: user,
    });
});

// update user
app.patch("/users/:id", async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();
    res.status(200).json({
        message: "User updated successfully",
        user: {
            name: user.name,
            email: user.email,
        },
    });
});

// delete user
app.delete("/users/:id", async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "User deleted successfully",
    });
});

// update user password
app.patch("/users/:id/password", async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        message: "User password updated successfully",
    });
});

module.exports = app;
