const jwt = require("jsonwebtoken");

async function verifyJWT(req, res, next) {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

module.exports = {
    verifyJWT,
};
