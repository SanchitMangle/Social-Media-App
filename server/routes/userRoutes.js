import express from "express";
import { getUserData, updateUserData, discoverUser, followUser, unfollowUser, sendConnectionRequest, acceptConnectionRequest, getUserConnections } from "../controllers/userController.js";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post("/update", upload.fields([{ name: "profile", maxCount: 1 }, { name: "cover_photo", maxCount: 1 }]), protect, updateUserData);
userRouter.post("/discover", protect, discoverUser);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.get("/connections", protect, getUserConnections);

export default userRouter;
