import mongoose from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    userID: { type: String, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    category: { type: String, default: "nocategory" },
    photoURL: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/D4D12AQG56UPUtPJj0w/article-cover_image-shrink_423_752/0/1669373321238?e=1723075200&v=beta&t=MhAW2X7UAvfbAbejhSBJBD70qnQTtjmcMcXreQ14LQo",
    },
    slug: { type: String, require: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
