import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        author: { type: String, default: "Unknown" },
        source: { type: String, default: "" },
        reflection: { type: String, default: "" },
        lastUsed: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
