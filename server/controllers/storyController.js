import Story from "../models/story.js";
import imagekit from "../config/imagekit.js";
import User from "../models/user.js";
import fs from "fs";

// Add user story
export const addStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, background_color } = req.body;
        const media = req.file
        let media_urls = ''
        // upload media to imagekit
        if (media_type === 'image' || media_type === 'video') {
            const buffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: media.originalname,
            })
            media_urls = response.url;
        }
        // create story
        const story = await Story.create({
            user: userId,
            content,
            media_urls,
            media_type,
            background_color
        })
        res.json({ success: true, });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// get user stories
export const getUserStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)
        //  user connections and following
        const userIds = [userId, ...user.connections, ...user.following]
        const stories = await Story.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 })
        res.json({ success: true, stories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

