import { generatePostContent } from "../services/ai/aiServices.js";
import Post from "../models/post.model.js";

const controller = {
    generatePost: async (req, res) => {
        try {
            const { topic } = req.body;
            if (!topic) {
                return res.status(400).json({ error: "Chủ đề bài viết không được để trống!" });
            }

            const content = await generatePostContent(topic);

            const post = new Post({ title: topic, content });
            await post.save();

            res.status(201).json({ message: "Bài viết đã được tạo!", post });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
}
export default controller;
