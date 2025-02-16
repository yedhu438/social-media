import express from "express";
import UserModel from "../Models/userModel";

const msgRouter = express.Router();

// Get all non-admin users
msgRouter.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({ isAdmin: false }).select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

export default msgRouter;
