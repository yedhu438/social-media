import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css"; // Updated CSS file

const AdminDashboard = () => {
    const user = useSelector((state) => state.authReducer.authData);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("users"); // State for sidebar navigation
    const [searchTerm, setSearchTerm] = useState(""); // State for search filter

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5002/admin/users", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:5002/admin/posts", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        };

        if (user?.user?.isAdmin) {
            fetchUsers();
            fetchPosts();
        }
    }, [user]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5002/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setUsers(users.filter((u) => u._id !== userId));
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`http://localhost:5002/admin/posts/${postId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPosts(posts.filter((p) => p._id !== postId));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    if (!user?.user?.isAdmin) {
        return <Navigate to="/" />;
    }

    // Filtered Users
    const filteredUsers = users.filter((u) =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtered Posts
    const filteredPosts = posts.filter((p) =>
        p.userId?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userId?.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <h2 className="sidebar-title">Admin Panel</h2>
                <ul className="sidebar-menu">
                    <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
                        Users
                    </li>
                    <li className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
                        Posts
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <h1 className="admin-title">Admin Dashboard</h1>

                {/* Search Filter */}
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {activeTab === "users" && (
                    <>
                        <h2 className="section-title">Users</h2>
                        <div className="user-list">
                            {filteredUsers.map((u) => (
                                <div key={u._id} className="user-card">
                                    <img
                                        src={`http://localhost:5002/images/${u.profilePicture}`}
                                        alt={u.firstname}
                                        className="user-avatar"
                                    />
                                    <div className="user-info">
                                        <h3 className="user-name">{u.firstname} {u.lastname}</h3>
                                        <p className="user-email">{u.email}</p>
                                    </div>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "posts" && (
                    <>
                        <h2 className="section-title">Posts</h2>
                        <div className="post-list">
                            {filteredPosts.map((p) => (
                                <div key={p._id} className="post-card">
                                    <div className="post-header">
                                        <img
                                            src={p.userId?.profilePicture
                                                ? `http://localhost:5002/images/${p.userId.profilePicture}`
                                                : "/default-avatar.png"} // Fallback image
                                            alt={p.userId?.firstname || "User"}
                                            className="post-avatar"
                                        />

                                        <div>
                                            <h3 className="post-author">{p.userId?.firstname} {p.userId?.lastname}</h3>
                                            <p className="post-date">{new Date(p.createdAt).toDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="post-text">{p.desc}</p>
                                    {p.image && (
                                        <img
                                            src={`http://localhost:5002/images/${p.image}`}
                                            alt="Post"
                                            className="post-image"
                                        />
                                    )}
                                    <p className="post-likes">{p.likes.length} Likes</p>
                                    <button className="delete-btn" onClick={() => handleDeletePost(p._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
