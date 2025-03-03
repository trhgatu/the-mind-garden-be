import bcrypt from "bcrypt";
import User from "../../models/user.model.js"
import jwt from "jsonwebtoken"

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return {
                status: 400,
                success: false,
                message: "User does not exist",
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                status: 400,
                success: false,
                message: "Wrong password!",
            };
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            status: 200,
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    } catch (error) {
        console.error("Lỗi trong loginService:", error);
        return {
            status: 500,
            success: false,
            message: "Internal Server Error",
        };
    }
};


export { loginService };
