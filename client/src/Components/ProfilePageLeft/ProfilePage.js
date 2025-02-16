import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import styled from 'styled-components';
import "./ProfilePage.css"; // Import styles

const ProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId] = useState("your-logged-in-user-id"); // Replace with actual logged-in user ID

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) {
                    setError("Invalid user ID");
                    setLoading(false);
                    return;
                }

                // Fetch user details
                const userRes = await axios.get(`http://localhost:5002/profile/${userId}`);
                setUser(userRes.data);

                // Fetch user's posts
                const postsRes = await axios.get(`http://localhost:5002/profile/user/${userId}`);
                setPosts(postsRes.data);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError("User not found or server error");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle Like Post
    const handleLike = async (postId) => {
        try {
            const res = await axios.put(`http://localhost:5002/profile/like/${postId}`, { userId: currentUserId });

            // Update the posts state with the new like count
            setPosts(posts.map(post =>
                post._id === postId ? { ...post, likes: res.data.likes } : post
            ));
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    if (loading) return <div><StyledWrapper>
    <div className="loader">
      <div className="loading-text">
        Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
      </div>
      <div className="loading-bar-background">
        <div className="loading-bar">
          <div className="white-bars-container">
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
            <div className="white-bar" />
          </div>
        </div>
      </div>
    </div>
  </StyledWrapper></div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="profile-containerr">
            {/* User Profile Section */}
            <div className="profile-headerr">
                <img className="cover-photoo" src={`http://localhost:5002/images/${user.coverPicture}`} alt="Cover" />
                <img className="profile-photoo" src={`http://localhost:5002/images/${user.profilePicture}`} alt="Profile" />
                <h1>{user.firstname} {user.lastname}</h1>
                <p>{user.about}</p>

                {/* Additional User Details */}
                <div className="user-detailss">
                    {user.email && <p><strong>Email:</strong> {user.email}</p>}
                    {user.livesin && <p><strong>Lives In:</strong> {user.livesin}</p>}
                    {user.worksAt && <p><strong>Works At:</strong> {user.worksAt}</p>}
                    {user.country && <p><strong>Country:</strong> {user.country}</p>}
                    {user.relationship && <p><strong>Relationship Status:</strong> {user.relationship}</p>}
                </div>

                <div className="follow-infoo">
                    <span>{user.followers.length} Followers</span>
                    <span>{user.following.length} Following</span>
                </div>
            </div>

            {/* User's Posts Section */}
            <div className="user-postss">
                <h2>Posts</h2>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post-cardd">
                            <img src={`http://localhost:5002/images/${post.image}`} alt="Post" />
                            <p>{post.desc}</p>
                            <div className="post-actionss">
                                <button className="like-btnn" onClick={() => handleLike(post._id)}>
                                    <FaHeart color={post.likes.includes(currentUserId) ? "red" : "gray"} /> {post.likes.length} Likes
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts yet</p>
                )}
            </div>
        </div>
    );
};

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
  }

  .loading-text {
    color: purple;
    font-size: 14pt;
    font-weight: 600;
    margin-left: 10px;
  }

  .dot {
    margin-left: 3px;
    animation: blink 1.5s infinite;
  }
  .dot:nth-child(2) {
    animation-delay: 0.3s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.6s;
  }

  .loading-bar-background {
    --height: 30px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 5px;
    width: 200px;
    height: var(--height);
    background-color: #212121 /*change this*/;
    box-shadow: #0c0c0c -2px 2px 4px 0px inset;
    border-radius: calc(var(--height) / 2);
  }

  .loading-bar {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    --height: 20px;
    width: 0%;
    height: var(--height);
    overflow: hidden;
    background: rgb(222, 74, 15);
    background: linear-gradient(
      0deg,
      rgb(108, 29, 244) 0%,
      rgb(35, 120, 224) 100%
    );
    border-radius: calc(var(--height) / 2);
    animation: loading 4s ease-out infinite;
  }

  .white-bars-container {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .white-bar {
    background: rgb(255, 255, 255);
    background: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    width: 10px;
    height: 45px;
    opacity: 0.3;
    rotate: 45deg;
  }

  @keyframes loading {
    0% {
      width: 0;
    }
    80% {
      width: 100%;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }`;


export default ProfilePage;
