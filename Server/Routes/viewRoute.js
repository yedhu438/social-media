import express from "express";
import postModel from "../Models/postModel.js"; // Adjust the path if needed
import UserModel from "../Models/userModel.js";

const vRouter = express.Router();

// ✅ Get a post by ID
vRouter.get("/:postId", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Fetch user details
        const user = await UserModel.findById(post.userId).select("firstname lastname profilePicture");
        
        const postData = {
            _id: post._id,
            desc: post.desc,
            image: post.image,
            createdAt: post.createdAt,
            user: user ? { 
                _id: user._id,
                name: `${user.firstname} ${user.lastname}`, 
                profilePicture: user.profilePicture 
            } : null
        };

        res.status(200).json(postData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error });
    }
});


// ✅ Get all posts (Optional, if needed)
vRouter.get("/", async (req, res) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// ✅ Create a new post
vRouter.post("/", async (req, res) => {
    const { userId, desc, image } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const newPost = new postModel({ userId, desc, image });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
});

// Like or Unlike a post
vRouter.put("/:postId/like", async (req, res) => {
    const { userId } = req.body;

    try {
        const post = await postModel.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.likes.includes(userId)) {
            // Unlike post
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like post
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Error updating likes", error });
    }
});



export default vRouter;
