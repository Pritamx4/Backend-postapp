const express = require('express');
const userController = require("../controllers/user.controller");
const authMiddleware = require('../middleware/auth.middleware');


const router = express.Router();


/** these are the routes for user related operations
 * get /users/me
 * patch /users/me
 * patch /users/me/password
 * delete /users/me
 * 
 * or ye jo apis hai in sab me hame ek prefix lagana pdega
 * /api/users
 * /api/users/me
 * /api/users/me/password
 * /api/users/me
 * /api/users/:id
 */

router.get("/me", authMiddleware.verifyJWT, userController.getUserProfile);
router.patch("/me", authMiddleware.verifyJWT, userController.updateUserProfile);
router.patch("/me/password", authMiddleware.verifyJWT, userController.updateUserPassword);
router.delete("/me", authMiddleware.verifyJWT, userController.deleteUserProfile);
router.get("/username/:username", authMiddleware.verifyJWT, userController.getUserByUsername);

module.exports = router;