import mongoose from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    userID: { type: String, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    category: { type: String, default: "nocategory" },
    photoURL: {
      type: String,
      default: "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg",
    },
    slug: { type: String, require: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
