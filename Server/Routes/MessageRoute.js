const Message = require('../Models/messageModel');

exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
};

exports.getMessages = async (req, res) => {
    const { userId, correspondingUserId } = req.params;
    const messages = await Message.find({
        $or: [
            { senderId: userId, receiverId: correspondingUserId },
            { senderId: correspondingUserId, receiverId: userId }
        ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
};