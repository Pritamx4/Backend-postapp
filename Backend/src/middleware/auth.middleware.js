const jwt = require("jsonwebtoken");

async  function verifyJWT(req,res,next){
    const token = req.cookies.token;
    if(!token){
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