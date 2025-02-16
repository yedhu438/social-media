import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:5002"); // Adjust if backend URL is different

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // For filtering
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const loggedInUser = storedUser || { _id: "", firstname: "", lastname: "" };

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5002/msgs/users");
                setUsers(res.data);
                setFilteredUsers(res.data); // Initialize filtered users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Search users
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users); // Reset to all users if search is empty
        } else {
            const filtered = users.filter(user =>
                `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    // Fetch messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5002/msgs/messages/${loggedInUser._id}/${selectedUser._id}`
                );
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    // Listen for real-time messages
    useEffect(() => {
        socket.on("receiveMessage", (newMessage) => {
            if (
                (newMessage.senderId === loggedInUser._id && newMessage.receiverId === selectedUser?._id) ||
                (newMessage.senderId === selectedUser?._id && newMessage.receiverId === loggedInUser._id)
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        return () => socket.off("receiveMessage");
    }, [selectedUser, loggedInUser]);

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            senderId: loggedInUser._id,
            receiverId: selectedUser._id,
            message: newMessage,
            timestamp: new Date().toISOString(), // Fixes "Invalid Date" issue
        };

        setMessages((prev) => [...prev, messageData]); // Instantly update UI

        try {
            await axios.post("http://localhost:5002/msgs/messages", messageData);
            setNewMessage("");
            socket.emit("sendMessage", messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-container">
            {/* Sidebar with Search Box */}
            <div className="sidebar">
                <h2>Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-box"
                />
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user._id} className="user-item" onClick={() => setSelectedUser(user)}>
                            <img src={`http://localhost:5002/images/${user.profilePicture}`} alt="Profile" />
                            <p>{user.firstname} {user.lastname}</p>
                        </div>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>

            {/* Chat Box */}
            <div className="chat-box">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h2>{selectedUser.firstname} {selectedUser.lastname}</h2>
                        </div>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.senderId === loggedInUser._id ? "sent" : "received"}>
                                    {msg.post ? (
                                        <div className="sharedPost">
                                            <p>{msg.message}</p>
                                            <img src={`http://localhost:5002/images/${msg.post.image}`} alt="Shared Post" />
                                            <a href={`/post/${msg.post._id}`} target="_blank" rel="noopener noreferrer">View Post</a>
                                        </div>
                                    ) : (
                                        <p>{msg.message}</p>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <h2>Select a user to chat</h2>
                )}
            </div>
        </div>
    );
};

export default Chat;
