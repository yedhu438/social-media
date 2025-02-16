import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';
import msgRouter from './Routes/messageRouter.js';
import MessageModel from "./Models/messageModel.js";  // Import your message schema
import vRouter from './Routes/viewRoute.js';
import pRouter from './Routes/ProfileRoute.js';
import adminRouter from './Routes/AdminRoute.js';

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*", // Allow only the client URL in production
        methods: ["GET", "POST"]
    }
});

// ✅ Middleware
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));

// ✅ Debugging: Log headers for analysis
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Request Headers:`, req.headers);
    next();
});

// ✅ Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use('/msgs',msgRouter);
app.use('/view',vRouter);
app.use('/profile',pRouter);
app.use('/admin',adminRouter);

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://demo_user:KnM2K37KdVAITAX1@cluster0.oyc2x.mongodb.net/";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch(error => console.error("❌ MongoDB connection error:", error));

// ✅ WebSocket Setup
io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("chat message", (msg) => {
        console.log("💬 Chat message received:", msg);
        if (!msg.timestamp) {
            msg.timestamp = new Date().toISOString();
        }
        io.emit("chat message", msg); // Broadcast to all clients
    });

    socket.on("typing", (userId) => {
        console.log(`${userId} is typing...`);
        socket.broadcast.emit("typing", userId);
    });

    socket.on("stop typing", (userId) => {
        console.log(`${userId} stopped typing...`);
        socket.broadcast.emit("stop typing", userId);
    });

    socket.on("disconnect", (reason) => {
        console.log(`🔴 User disconnected: ${socket.id}, Reason: ${reason}`);
    });

    // Handle errors
    socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error);
    });
});

// ✅ Start the server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});