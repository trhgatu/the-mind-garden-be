import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import paginate from "../helpers/paginate.js";
import getPostFilter from "../helpers/filter.js";

const controller = {
    /* [GET] api/v1/posts */
    index: async (req, res) => {
        try {
            const { page, limit } = req.query;

            const filter = getPostFilter(req.query);
            const result = await paginate(
                Post,
                filter,
                page,
                limit,
                "authorId categoryId"
            );

            if(result.data.length > 0) {
                const populatedPosts = await Promise.all(
                    result.data.map(async (post) => {
                        if(post.authorId) {
                            post.authorId = await User.findById(post.authorId).select("-password");
                        }
                        if(post.categoryId) {
                            post.categoryId = await Category.findById(post.categoryId);
                        }
                        return post;
                    })
                );
                result.data = populatedPosts;
            }

            res.status(200).json(result);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
        }
    },

    /* [GET] api/v1/posts/:id - Lấy chi tiết bài viết */
    detail: async (req, res) => {
        try {
            const { slug } = req.params;

            const post = await Post.findOne({ slug })
                .populate("authorId", "-password")
                .populate("categoryId");

            if(!post || post.isDel) {
                return res.status(404).json({ message: "Bài viết không tồn tại" });
            }

            res.status(200).json({
                success: true,
                data: { post },
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy chi tiết bài viết", error });
        }
    },

    /* [POST] api/v1/posts/create */
    create: async (req, res) => {
        try {
            const { title, excerpt, content, tags, status, thumbnail, featured, location, feeling, isAI, categoryId } = req.body;
            const authorId = req.user?.id || null;
            const isAIPost = isAI || !authorId;

            const category = await Category.findById(categoryId);
            if(!category) {
                return res.status(400).json({ message: "Danh mục không tồn tại." });
            }

            if(!thumbnail) {
                return res.status(400).json({ message: "Vui lòng tải lên ảnh thumbnail." });
            }
            const newPost = new Post({
                authorId,
                isAI: isAIPost,
                title,
                excerpt,
                content,
                thumbnail,
                tags: tags || [],
                categoryId,
                status: status || "published",
                location,
                feeling,
                featured: featured
            });

            const savedPost = await newPost.save();

            res.status(201).json({
                success: true,
                message: "Đăng bài viết thành công",
                post: savedPost,
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error.message });
        }
    },

    /* [PATCH] api/v1/posts/:id/update - Cập nhật bài viết */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, media, tags, status, location, feeling, categoryId } = req.body;

            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }

            if(categoryId) {
                const category = await Category.findById(categoryId);
                if(!category) {
                    return res.status(400).json({ message: "Danh mục không tồn tại." });
                }
            }

            const updatedPost = await Post.findByIdAndUpdate(
                id,
                { title, content, media, tags, status, location, feeling, categoryId },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Cập nhật bài viết thành công",
                post: updatedPost,
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi cập nhật bài viết", error });
        }
    },

    /* [DELETE] api/v1/posts/:id/delete - Xóa bài viết */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const post = await Post.findByIdAndUpdate(
                id,
                { isDel: true },
            );

            if(!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }

            res.status(200).json({ message: "Xóa bài viết thành công", post });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
        }
    },
    /* [DELETE] api/v1/posts/:id - Xóa cứng bài viết */
    hardDelete: async (req, res) => {
        try {
            const { id } = req.params;

            const deletedPost = await Post.findByIdAndDelete(id);
            if(!deletedPost) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }

            res.status(200).json({ message: "Đã xóa bài viết khỏi database", deletedPost });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
        }
    }


};

export default controller;
