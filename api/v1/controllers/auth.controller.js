import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Kiểm tra xem email có tồn tại không
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
            }

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
            }

            // Tạo JWT Token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Gửi token qua cookie
            res.cookie("sessionToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Chỉ bật secure trong production
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            // Trả về phản hồi thành công
            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch(error) {
            console.error("Lỗi đăng nhập:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi đăng nhập",
                error: error.message
            });
        }
    },

    /* [POST] api/v1/auth/logout */
    logout: async (req, res) => {
        try {
            res.clearCookie("sessionToken");
            return res.status(200).json({
                success: true,
                message: "Đăng xuất thành công",
            });
        } catch(error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },
    /* [GET] api/v1/auth/me */
    me: async (req, res) => {
        try {
            const token = req.cookies.sessionToken || req.headers.authorization?.split(" ")[1];
            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                success: true,
                user,
            });
        } catch(error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    },
};

export default controller;
