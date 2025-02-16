import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        message: { type: String },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" }, // Store shared post ID
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const MessageModel = mongoose.model("Messages", MessageSchema);
export default MessageModel;
