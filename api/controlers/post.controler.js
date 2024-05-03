import { errorHandler } from "../../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    return next(errorHandler(401, "Unortherize"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(403, "title and content is required"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const post = new Post({
    ...req.body,
    userID: req.user.id,
    slug,
  });
  try {
    post.save();
    res.status(200).json("post saved");
  } catch (error) {
    next(errorHandler(400, error.messege));
  }
};
