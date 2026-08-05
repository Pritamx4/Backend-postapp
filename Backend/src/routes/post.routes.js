const express = require("express");
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadFile , deleteFile} = require("../services/storage.service");
const { upload } = require("../middleware/upload.middleware");

const router = express.Router();

/** these are the routes for post related operations
 * post /posts
 * get /posts
 * get /posts/:id
 * patch /posts/:id
 * delete /posts/:id
 * **user related routes**
 * get /users/me/posts
 * get /users/username/:username/posts
 * **for future**
 *posts/:id/users/username/likes
 *
 */

router.post("/", authMiddleware.verifyJWT, upload.single("image"), postController.createPost);
router.get("/", authMiddleware.verifyJWT, postController.getAllPosts); //currently i add middleware,in future i will remove it
router.get("/me/",authMiddleware.verifyJWT,postController.getPostsByUser,);
router.get("/user/:username/",authMiddleware.verifyJWT,postController.getPostsByUsername,);
router.get("/:id", authMiddleware.verifyJWT, postController.getPostById); //currently i add middleware,in future i will remove it
router.patch("/:id", authMiddleware.verifyJWT, postController.updatePost);
router.delete("/:id", authMiddleware.verifyJWT, postController.deletePost);


module.exports = router;