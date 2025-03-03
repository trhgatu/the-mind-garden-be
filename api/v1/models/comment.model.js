const commentSchema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
        reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }]
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema, "comments");

export default Comment;
