import express from "express";
import { addPost, getFeedPosts, LikePost } from "../controllers/postController.js";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const postRoutes = express.Router();
postRoutes.post("/add", upload.array("images", 10), protect, addPost);
postRoutes.get("/feed", protect, getFeedPosts);
postRoutes.post("/like", protect, LikePost);

export default postRoutes;