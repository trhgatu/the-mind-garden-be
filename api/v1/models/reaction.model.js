import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
        targetType: { type: String, enum: ["post", "comment"], required: true },
        type: {
            type: String,
            enum: ["like", "love", "haha", "wow", "sad", "angry"],
            required: true
        }
    },
    { timestamps: true }
);

const Reaction = mongoose.model("Reaction", reactionSchema, "reactions");

export default Reaction;
