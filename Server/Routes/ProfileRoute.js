import express from "express";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import postModel from "../Models/postModel.js";

const pRouter=express.Router();

pRouter.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Log the received userId
        console.log("Received userId:", userId);

        // Check if userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Invalid user ID received:", userId);
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const user = await UserModel.findById(userId).select("-password"); // Exclude password
        if (!user) {
            console.log("User not found for ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

pRouter.get("/user/:userId", async (req, res) => {
    try {
        const posts = await postModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

pRouter.put("/like/:postId", async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await postModel.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if the user already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Unlike the post
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like the post
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ message: "Like status updated", likes: post.likes });
    } catch (error) {
        console.error("Error updating like:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



export default pRouter;
