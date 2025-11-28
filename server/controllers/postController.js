import fs from "fs";
import imagekit from "../config/imagekit.js";
import Post from "../models/post.js";
import User from "../models/user.js";

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images = req.files;

        let image_urls = [];
        if (images.length > 0) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path);
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    })
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            {
                                quality: "auto"
                            },
                            {
                                format: "webp"
                            },
                            { width: 580 }
                        ]

                    })
                    return url

                })
            )
        }
        const post = await Post.create({
            user_id: userId,
            content,
            image_urls,
            post_type
        })
        res.json({ success: true, message: "Post added successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get  posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
        //    user connections and following
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({ user_id: { $in: userIds } }).populate("user_id").sort({ createdAt: -1 })
        console.log(posts);

        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Like post 
export const LikePost = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId } = req.body

        const post = await Post.findById(postId)
        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({ success: true, message: "Post Unliked" })
        }
        else {
            post.likes_count.push(userId);
            await post.save();
            res.json({ success: true, message: "Post Liked" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}