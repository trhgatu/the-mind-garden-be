import Category from "../models/category.model.js";

const controller = {
    /* [GET] api/v1/categories - Lấy danh sách category */
    index: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json({ success: true, categories });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách category", error: error.message });
        }
    },

    /* [GET] api/v1/categories/:id - Lấy thông tin category theo ID */
    detail: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: "Không tìm thấy category" });
            }
            res.status(200).json({ success: true, category });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy category", error: error.message });
        }
    },

    /* [POST] api/v1/categories/create - Tạo category mới */
    create: async (req, res) => {
        try {
            const { name, description } = req.body;

            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category đã tồn tại" });
            }

            const newCategory = new Category({ name, description });
            await newCategory.save();

            res.status(201).json({
                success: true,
                message: "Tạo category thành công",
                category: newCategory
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tạo category", error: error.message });
        }
    },

    /* [PUT] api/v1/categories/:id - Cập nhật category */
    update: async (req, res) => {
        try {
            const { name, description } = req.body;

            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: "Không tìm thấy category" });
            }

            category.name = name || category.name;
            category.description = description || category.description;

            await category.save();
            res.status(200).json({ success: true, message: "Cập nhật category thành công", category });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi cập nhật category", error: error.message });
        }
    },

    /* [DELETE] api/v1/categories/:id - Xóa category */
    delete: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                return res.status(404).json({ message: "Không tìm thấy category" });
            }
            res.status(200).json({ success: true, message: "Xóa category thành công", category });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi xóa category", error: error.message });
        }
    }
};

export default controller;
