import imagekit from "../config/imagekit.js";
import { User } from "../models/user.js";
import fs from "fs";

// Get usrdata using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// update userdata using userId
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { username, full_name, bio, location } = req.body;
        const tempUser = await User.findById(userId);

        !username && (username = tempUser.username);
        if (tempUser.username !== username) {
            const user = await User.findOne({ username });
            if (user) {
                username = tempUser.username
            }
        }
        const updatedData = {
            username,
            full_name,
            bio,
            location
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover_photo && req.files.cover[0]

        if (profile) {
            const buffer = fs.readFileSync(profile.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
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
                    { width: 512 }
                ]

            })
            updateUserData.profile_picture = url;
        }

        if (cover) {
            const buffer = fs.readFileSync(cover.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,
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
                    { width: 1289 }
                ]

            })
            updateUserData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updateUserData, { new: true });
        res.json({ success: true, user, message: "User updated successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Find user using username,location,email,name 