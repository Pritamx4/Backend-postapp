const express = require("express");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const multer = require("multer");
const { uploadFile, deleteFile } = require("../services/storage.service"); //call both func.
const authMiddleware = require("../middleware/auth.middleware");

async function createPost(req, res) {
    const username = req.username; // Assuming the username is stored in req.username after authentication

    const { caption } = req.body;
    if (!req.file) {
        return res.status(400).json({
            message: "Image is required",
        });
    }

    const result = await uploadFile(req.file.buffer);
    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption,
        imageFileId: result.fileId,
        author: req.userId, // Assuming the user ID is stored in req.userId after authentication
    });
    res.status(201).json({
        message: "Post created successfully",
        post,
    });
}

async function getAllPosts(req, res) {
    const posts = await postModel.find().populate("author", "username");
    res.status(200).json({
        posts,
    });
}

async function getPostById(req, res) {
    const postId = req.params.id;
    const post = await postModel
        .findById(postId)
        .populate("author", "username");
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
    }
    res.status(200).json({
        post,
    });
}

async function updatePost(req, res) {
    const postId = req.params.id;
    const { caption } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
    }
    if (post.author.toString() !== req.userId) {
        return res.status(403).json({
            message: "You are not authorized to update this post",
        });
    }
    post.caption = caption;
    await post.save();
    res.status(200).json({
        message: "Post updated successfully",
        post,
    });
}

async function deletePost(req, res) {
    const postId = req.params.id;
    const post = await postModel.findById(postId);
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
    }
    if (post.author.toString() !== req.userId) {
        return res.status(403).json({
            message: "You are not authorized to update this post",
        });
    }

    await postModel.findByIdAndDelete(postId);
    res.status(200).json({
        message: "Post deleted successfully",
        post,
    });
}

async function getPostsByUser(req, res) {
    const userId = req.userId;
    const posts = await postModel.find({ author: userId }).populate("author", "username");
    res.status(200).json({
        posts,
    });
}

async function getPostsByUsername(req, res) {
    const username = req.params.username; 
    const user = await userModel.findOne({ username : req.params.username });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    const posts = await postModel.find({ author: user._id }).populate({
        path: "author",
        select: "username"
    });

    if (posts.length === 0) {
        return res.status(200).json({
            message: "No posts yet",
            posts: [],
        });
    }
    
    res.status(200).json({
        posts,
    });
}

/**
 * Post management
 *
 * post /posts - create a new post
 * get /posts - get all posts
 * get /posts/:id - get a post by id
 * patch /posts/:id - update a post by id
 * delete /posts/:id - delete a post by id
 * **user related routes**
 * get /posts/me - get posts by current user
 * get /posts/user/:username - get posts by username
 */

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
    getPostsByUsername
};
