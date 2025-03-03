import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import paginate from "../helpers/paginate.js";

const controller = {
    /* [GET] api/v1/posts */
    index: async (req, res) => {
        try {
            const { page, limit } = req.query;

            const result = await paginate(Post, {}, page, limit, "authorId");

            if (result.data && result.data.length > 0) {
                for (let post of result.data) {
                    if (post.authorId) {
                        post.authorId = await User.findById(post.authorId).select("-password");
                    }
                }
            }
            res.status(200).json(result);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
        }
    },
    /* [POST] api/v1/posts/create */
    create: async (req, res) => {
        try {
            const { content, media, tags, status, location, feeling } = req.body;

            if(!req.user || !req.user.id) {
                return res.status(401).json({ message: "Không có quyền thực hiện hành động này." });
            }

            const newPost = new Post({
                authorId: req.user.id,
                content,
                media: media || [],
                tags: tags || [],
                status: status || "public",
                location,
                feeling
            });

            const savedPost = await newPost.save();
            res.status(201).json({
                success: true,
                message: "Đăng bài viết thành công",
                savedPost
            });
        } catch(error) {
            console.error("Lỗi khi tạo bài viết:", error);
            res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const post = Post.findByIdAndDelete(id);
            if(!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }
            res.status(200).json({ message: "Xóa bài viết thành công", post });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
        }
    }
};

export default controller;
