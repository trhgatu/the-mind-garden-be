import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(401).json({ message: "Không có quyền truy cập" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        req.user = user;
        next();
    } catch(error) {
        return res.status(401).json({ message: "Xác thực thất bại", error });
    }
};
