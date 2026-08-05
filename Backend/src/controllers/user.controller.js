const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const router = express.Router();

async function getUserProfile(req, res) {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.status(200).json({
        message: "User profile retrieved successfully",
        user,
    });
}

async function updateUserProfile(req, res) {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = req.body;

    // Username check only if changed
    if (username && username !== user.username) {
        const isUsernameTaken = await userModel.findOne({
            username,
            _id: { $ne: userId },
        });
        if (isUsernameTaken) {
            return res.status(400).json({ message: "Username already taken" });
        }
        user.username = username;
    }

    // Email check only if changed
    if (email && email !== user.email) {
        const isEmailTaken = await userModel.findOne({
            email,
            _id: { $ne: userId },
        });
        if (isEmailTaken) {
            return res.status(400).json({ message: "Email already taken" });
        }
        user.email = email;
    }

    await user.save();

    res.status(200).json({
        message: "Profile updated successfully",
        user,
    });
}

async function updateUserPassword(req, res) {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("+password");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current password and new password are required",
        });
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
    );
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Current password is incorrect",
        });
    }
    if (currentPassword === newPassword) {
        return res.status(400).json({
            message: "New password cannot be the same as the current password",
        });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
        message: "Password updated successfully",
    });
}

async function deleteUserProfile(req, res) {
    const userId = req.userId;
    const { username, email, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({
            message: "Please provide either username or email",
        });
    }

    const user = await userModel
        .findOne({
            $or: [{ username }, { email }],
        })
        .select("+password"); // Include password field in the query result

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
    await userModel.findByIdAndDelete(userId);

    res.clearCookie("token"); // Clear the JWT cookie

    res.status(200).json({
        message: "User deleted successfully",
    });
}

async function getUserByUsername(req, res) {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({
            message: "Username is required",
        });
    }
    const user = await userModel.findOne({ username: username.toLowerCase() });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    res.status(200).json({
        user,
    });
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserProfile,
    getUserByUsername,
};



/** these are the routes for user related operations
 * get /me
 * get /:username
 * patch /me
 * patch /me/password
 * delete /me
 */