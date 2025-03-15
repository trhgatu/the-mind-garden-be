import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const controller = {
    /* [GET] api/v1/users - Lấy danh sách user */
    index: async (req, res) => {
        try {
            const users = await User.find().select("-password");
            res.status(200).json({ success: true, users });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
        }
    },

    /* [GET] api/v1/users/:id - Lấy thông tin user theo ID */
    detail: async (req, res) => {
        try {
            const user = await User.findById(req.params.username).select("-password");
            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            res.status(200).json({ success: true, user });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error: error.message });
        }
    },

    /* [POST] api/v1/users/create - Tạo user mới */
    create: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if(existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({
                success: true,
                message: "Tạo người dùng thành công",
                user: { id: newUser._id, name, email }
            });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo người dùng", error: error.message });
        }
    },

    /* [PUT] api/v1/users/:id - Cập nhật user */
    update: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await User.findById(req.params.id);
            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            user.name = name || user.name;
            user.email = email || user.email;
            if(password) {
                user.password = await bcrypt.hash(password, 10);
            }

            await user.save();
            res.status(200).json({ success: true, message: "Cập nhật người dùng thành công", user });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error: error.message });
        }
    },

    /* [DELETE] api/v1/users/:id - Xóa user */
    delete: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            res.status(200).json({ success: true, message: "Xóa người dùng thành công", user });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa người dùng", error: error.message });
        }
    },
    /* [GET] api/v1/users/profile/:username - Lấy thông tin user theo username */
    profile: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username }).select("-password");
            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
            res.status(200).json({ success: true, user });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error: error.message });
        }
    },

};

export default controller;
