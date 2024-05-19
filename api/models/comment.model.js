import mongoose, { Model, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    content: { type: String, require: true },
    userID: { type: String, require: true },
    postID: { type: String, require: true },
    likes: { type: Array, default: [] },
    noOflikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
