const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

async function registerUser(req, res) {
    const { name, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists",
        });
    }

    const user = await userModel.create({
        name,
        email,
        password,
    });

    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );
    
    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
}

module.exports = {
    registerUser,
};
