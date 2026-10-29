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
require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow all origins (local network mobile IPs, vercel, render, localhost) with credentials
            callback(null, true);
        },
        credentials: true, // Cookie/JWT session allow karne ke liye
    })
);
app.use(express.json());
app.use(cookieParser());

// post APIs

app.get("/", (req, res) => {
    res.status(200).json({ message: "Post API is running" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/**
 * API route prefixes:
 * /api/auth -> register, login, logout
 * /api/users -> me, password, username
 * /api/posts -> CRUD posts
 */

// auth routes
app.use("/api/auth", authRoutes);

// user routes
app.use("/api/users", userRoutes);

// post routes
app.use("/api/posts", postRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack || err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
