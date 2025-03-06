import { generatePostContent } from "../services/ai/aiServices.js";
import Post from "../models/post.model.js";

const controller = {
    generatePost: async (req, res) => {
        try {
            const { topic, categoryId } = req.body;

            if(!topic) {
                return res.status(400).json({ error: "Chủ đề bài viết không được để trống!" });
            }

            const content = await generatePostContent(topic);

            const excerpt = content.length > 150 ? content.substring(0, 150) + "..." : content;

            const post = new Post({
                title: topic,
                content,
                excerpt,
                categoryId: categoryId || null,
                isAI: true,
                status: "published",
            });

            await post.save();

            res.status(201).json({ message: "Bài viết đã được tạo thành công!", post });
        } catch(error) {
            console.error("Lỗi tạo bài viết:", error);
            res.status(500).json({ error: "Có lỗi xảy ra khi tạo bài viết!" });
        }
    }
}
export default controller;
