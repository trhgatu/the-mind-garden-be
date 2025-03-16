import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    avatar: {
        type: String,
        default: ""
    },
    displayName: {
        type: String,
        default: "Độc giả ẩn danh"
    },
    coverPhoto: {
        type: String
    },
    isAI: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
const User = mongoose.model('User', userSchema, 'users')

export default User
