const express = require("express");
const authController = require("../controllers/auth.controller");


const router = express.Router();

/**
 * ye jo apis hai in sab me hame ek prefix lagana pdega
 * /api/auth naam ka tabhi ham inhe access kr paenge wrna nhi
 * /api/auth/register
 */
router.post("/register", authController.registerUser);


module.exports = router;