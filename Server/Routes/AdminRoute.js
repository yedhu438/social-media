import express from "express";
import UserModel from "../Models/userModel.js";
import postModel from "../Models/postModel.js";

const adminRouter = express.Router();

// ✅ Get All Users (Admin Only)
adminRouter.get("/users", async (req, res) => {
    try {
       
        const users = await UserModel.find({}, "-password"); // Exclude passwords for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// ✅ Get All Posts (Admin Only)
adminRouter.get("/posts", async (req, res) => {
    try {
        
        const posts = await postModel.find().populate('userId', 'firstname lastname profilePicture');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// Delete user (Admin only)
adminRouter.delete("/users/:id", async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Delete post (Admin only)
adminRouter.delete("/posts/:id",async (req, res) => {
    try {
        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
});


export default adminRouter;
