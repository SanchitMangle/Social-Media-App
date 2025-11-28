import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: { type: String, ref: 'User' },
    content: { type: String },
    media_urls: [{ type: String }],
    media_type: { type: String, enum: ["text", "image", "text_with_image"], required: true },
    background_color: { type: String },
    view_count: [{ type: String, ref: 'User' }]
}, { timestamps: true }, { minimize: false })

const Story = mongoose.model("Story", storySchema)

export default Story