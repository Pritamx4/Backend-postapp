const express = require("express");
const postModel = require("./models/post.model");
const multer = require("multer");
const { uploadFile, deleteFile } = require("./services/storage.service"); //call both func.
const cors = require("cors");
const userModel = require("./models/user.model");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// post APIs

app.get("/", (req, res) => {
    res.status(200).json({ message: "Post API is running" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// post api
// app.post("/create-post", upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 message: "Image is required",
//             });
//         }

//         const result = await uploadFile(req.file.buffer);

//         const post = await postModel.create({
//             image: result.url,
//             caption: req.body.caption,
//             imageFileId: result.fileId,
//         });
//         return res.status(201).json({
//             message: "Post created successfully",
//             post,
//         });
//     } catch (err) {
//         console.error("Failed to create post:", err);
//         return res.status(500).json({
//             message: "Failed to create post",
//         });
//     }
// });

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

/**
 * ye jo apis hai in sab me hame ek prefix lagana
 * agar hamne auth.routes me jo apis banai hai unhe access krna hai to hame
 * "/api/auth" naam ka prefix lagana pdega
 * /api/auth/register
 * /api/auth/login
 * /api/auth/logout
 * or agar hamne user.routes me jo apis banai hai unhe access krna hai to hame
 * "/api/users" naam ka prefix lagana pdega
 * /api/users/me
 * /api/users/me/password
 * /api/users/me
 * /api/users/username/:username
 */

// auth routes
app.use("/api/auth", authRoutes);

// user routes
app.use("/api/users", userRoutes);

// post routes
app.use("/api/posts", postRoutes);

module.exports = app;
