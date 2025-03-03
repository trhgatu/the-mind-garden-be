import Tag from "../models/tag.model.js";
import slugify from "slugify";

const controller = {
    /* [GET] api/v1/tags - Lấy danh sách tags */
    index: async (req, res) => {
        try {
            const tags = await Tag.find().sort({ createdAt: -1 });
            res.status(200).json(tags);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách tags", error });
        }
    },

    /* [GET] api/v1/tags/:id - Lấy một tag theo ID */
    detail: async (req, res) => {
        try {
            const { id } = req.params;
            const tag = await Tag.findById(id);

            if(!tag) {
                return res.status(404).json({ message: "Không tìm thấy tag" });
            }

            res.status(200).json(tag);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy tag", error });
        }
    },

    /* [POST] api/v1/tags/create - Tạo một tag mới */
    create: async (req, res) => {
        try {
            const { name, description, isAI } = req.body;

            if(!name) {
                return res.status(400).json({ message: "Tên tag là bắt buộc" });
            }

            const slug = slugify(name, { lower: true, strict: true });

            // Kiểm tra tag đã tồn tại chưa
            const existingTag = await Tag.findOne({ slug });
            if(existingTag) {
                return res.status(400).json({ message: "Tag đã tồn tại" });
            }

            const newTag = new Tag({
                name,
                slug,
                description,
                createdBy: req.user?.id || null, // Nếu không có req.user -> do AI tạo
                isAI: isAI || !req.user
            });

            const savedTag = await newTag.save();
            res.status(201).json({
                success: true,
                message: "Tạo tag thành công",
                tag: savedTag
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo tag", error });
        }
    },

    /* [PUT] api/v1/tags/:id - Cập nhật tag */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            let updatedData = {};
            if(name) {
                updatedData.name = name;
                updatedData.slug = slugify(name, { lower: true, strict: true });
            }
            if(description) updatedData.description = description;

            const updatedTag = await Tag.findByIdAndUpdate(id, updatedData, { new: true });

            if(!updatedTag) {
                return res.status(404).json({ message: "Không tìm thấy tag" });
            }

            res.status(200).json({
                success: true,
                message: "Cập nhật tag thành công",
                tag: updatedTag
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi cập nhật tag", error });
        }
    },

    /* [DELETE] api/v1/tags/:id - Xóa tag */
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedTag = await Tag.findByIdAndDelete(id);

            if(!deletedTag) {
                return res.status(404).json({ message: "Không tìm thấy tag" });
            }

            res.status(200).json({
                success: true,
                message: "Xóa tag thành công",
                tag: deletedTag
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa tag", error });
        }
    }
};

export default controller;
