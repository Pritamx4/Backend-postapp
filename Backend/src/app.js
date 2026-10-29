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
const allowedOrigins = [
    "http://localhost:5173", // Vite local dev server
    process.env.FRONTEND_URL, // Deployed Render URL
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack || err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
