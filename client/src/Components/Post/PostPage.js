import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from 'styled-components';
import axios from "axios";
import "./PostPage.css"; // Import styles

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    // Get logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const loggedInUser = storedUser || { _id: "" };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5002/view/${postId}`);
                setPost(res.data);
                setLikes(res.data.likes?.length || 0);
                setLiked(res.data.likes?.includes(loggedInUser._id));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching post:", error);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, loggedInUser._id]);

    // Like/Unlike Post
    const toggleLike = async () => {
        try {
            const res = await axios.put(`http://localhost:5002/view/${postId}/like`, { userId: loggedInUser._id });
            setLikes(res.data.likes);
            setLiked(!liked);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    if (loading) return <div className="loading"><StyledWrapper>
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
  </StyledWrapper>
</div>;
    if (!post) return <div className="error">Post not found</div>;

    return (
        <div className="post-container">
            <div className="post-card">
                {/* User Info */}
                <div className="post-header">
                    <img
                        src={post.user?.profilePicture 
                            ? `http://localhost:5002/images/${post.user.profilePicture}`
                            : `http://localhost:5002/images/default-user.png`}
                        alt="User Profile"
                        className="profile-pic"
                        onClick={() => navigate(`/profle/${post.user._id}`)} // Navigate on click
                        style={{ cursor: "pointer" }}
                    />
                    <div className="user-info">
                        <h3>{post.user?.name || "Unknown User"}</h3>
                        <p className="timestamp">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                {/* Post Content */}
                <div className="post-content">
                    <p className="post-description">{post.desc}</p>
                    {post.image && (
                        <img
                            src={`http://localhost:5002/images/${post.image}`}
                            alt="Post"
                            className="post-image"
                        />
                    )}
                </div>

                {/* Like & Comment Section */}
                {/* <div className="post-actions">
                    <button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
                        {liked ? "❤️ Liked" : "🤍 Like"} ({likes})
                    </button>
                    <button className="comment-btn">💬 Comment</button>
                </div> */}
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
    color: white;
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



export default PostPage;
