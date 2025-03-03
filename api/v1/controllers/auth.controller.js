import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Email hoặc mật khẩu không đúng" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi đăng nhập", error: error.message });
        }
    }
};

export default controller;
