const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/logout", authController.logoutUser);

module.exports = router;

/**
 * ye jo apis hai in sab me hame ek prefix lagana pdega
 * "/api/auth" naam ka tabhi ham inhe access kr paenge wrna nhi
 * "/api/auth/register"
 */
