import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5002" });

// Function to send a message (with or without a shared post)
export const sendMessage = async ({ senderId, receiverId, message, postId }) => {
  try {
    const response = await API.post("/msgs/messages/send", {
      senderId,
      receiverId,
      message,
      post: postId || null, // If a post is shared, attach the post ID
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Function to fetch user conversations
export const getUserChats = async (userId) => {
  try {
    const response = await API.get(`/msgs/chats/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};

// Function to fetch messages for a specific chat
export const getMessages = async (chatId) => {
  try {
    const response = await API.get(`/msgs/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
