import express from "express";
import MessageModel from "../Models/messageModel.js";
import UserModel from "../Models/userModel.js";

const msgRouter = express.Router();

// Get all non-admin users
msgRouter.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({ isAdmin: false }, "_id firstname lastname profilePicture").select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Send a message
msgRouter.post("/messages", async (req, res) => {
    
    try {
        const { senderId, receiverId, message, postId } = req.body;

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            message,
            post: postId || null // If a post is shared, store it
        });

        const savedMessage = await newMessage.save();

        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: "Error sending message" });
    }
});

// Get chat history between two users
msgRouter.get("/messages/:userId/:receiverId", async (req, res) => {
    const { userId, receiverId } = req.params;

    try {
        const messages = await MessageModel.find({
            $or: [
                { senderId: userId, receiverId: receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        })
        .populate("post") // Populate post details
        .sort({ createdAt: 1 }); // Sort messages in order

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
});


msgRouter.post("/messages/send", async (req, res) => {
    try {
      const { senderId, receiverId, message, post } = req.body;
  
      const newMessage = new MessageModel({
        senderId,
        receiverId,
        message,
        post: post || null, // Attach post ID if it's a shared post
      });
  
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
  // Route to get messages from a chat
  msgRouter.get("/messages/:chatId", async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await MessageModel.find({ chatId }).populate("post"); // Ensure "post" is populated
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
});
  

export default msgRouter;
