import React, { useState, useEffect } from 'react';
import './Post.css';
import Comment from '../../Img/comment.png';
import Share from '../../Img/share.png';
import Like from '../../Img/like.png';
import Notlike from '../../Img/notlike.png';
import { useSelector } from 'react-redux';
import { likePost } from '../../api/PostRequest';
import { sendMessage } from '../../api/ChatRequest';
import axios from 'axios';

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes?.includes(user._id) || false);
  const [likes, setLikes] = useState(data.likes?.length || 0);
  const [showChatList, setShowChatList] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5002/msgs/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = () => {
    setLiked((prev) => !prev);
    likePost(data._id, user._id);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleShare = () => {
    setShowChatList((prev) => !prev); // Toggle chat list visibility
  };
  

  const shareToChat = async (receiverId) => {
    try {
      await sendMessage({
        senderId: user._id,
        receiverId,
        message: `Check out this post!`,
        postId: data._id,
      });

      alert("Post shared successfully!");
      setShowChatList(false);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  return (
    <div className='Post'>
      <img src={`http://localhost:5002/images/${data.image}`} alt={data.image} className="postImage" />

      <div className="postReact">
        <img src={liked ? Like : Notlike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
        <img src={Comment} alt="" />
        <img src={Share} alt="" onClick={handleShare} />
      </div>

      <span className="likesCount">{likes} likes</span>

      {showChatList && (
        <div className="chatList">
          <h4>Select a user to share with:</h4>
          <ul>
            {users.length > 0 ? (
              users.map((chatUser) => (
                <li key={chatUser._id} className="chatUserItem" onClick={() => shareToChat(chatUser._id)}>
                  <img
                    src={chatUser.profilePicture ? `http://localhost:5002/images/${chatUser.profilePicture}` : "https://via.placeholder.com/50"}
                    alt="profile"
                    className="chatUserImage"
                  />
                  <span>{chatUser.firstname} {chatUser.lastname}</span>
                </li>
              ))
            ) : (
              <p>No users available</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;
