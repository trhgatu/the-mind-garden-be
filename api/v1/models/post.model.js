import { mongoose } from "../../../config/database.js";
import { v4 as uuidv4 } from 'uuid';

const postSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        content: {
            type: String,
            required: true
        },
        media: [
            {
                type: String
            }
        ],
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        reactions: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Reaction"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Comment"
            }
        ],
        shares: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "User"
            }
        ],
        status: {
            type: String,
            enum: [
                "public", "friends", "private"
            ],
            default: "public"
        },
        location: {
            type: String
        },
        feeling: {
            type: String
        },
        isDel: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
