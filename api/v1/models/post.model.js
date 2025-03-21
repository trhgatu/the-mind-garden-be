import { mongoose } from "../../../config/database.js";
import { v4 as uuidv4 } from "uuid";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const postSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isAI: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    excerpt: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false, //true
    },
    thumbnail : {
      type: String,
      required: false
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false, //true
    },
    type: {
      type: String,
      enum: ["letter", "article"],
      default: "article"
    },
    isApproved: { type: Boolean, default: false },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reactionType: {
          type: String,
          enum: ["like", "love", "haha", "sad", "angry"],
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    location: {
      type: String,
    },
    feeling: {
      type: String,
    },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    featured: {
      type: Boolean,
      default: false
    },
    isDel: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
