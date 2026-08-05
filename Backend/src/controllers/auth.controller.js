const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists",
        });
    }

    const user = await userModel.create({
        username,
        email,
        password,
    });

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
        },
    });
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({
            message: "Please provide either username or email",
        });
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }],
    }).select("+password"); // Include password field in the query result

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Credentials",
        });
    }

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email,
        },
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Logout successful",
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};

/**
 * these are the routes for auth related operations
 * post /register
 * post /login
 * post /logout
 */
