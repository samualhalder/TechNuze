import { response } from "express";
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
    res.status(200).json({ messege: "post saved", slug: slug });
  } catch (error) {
    next(errorHandler(400, error.messege));
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = +req.query.startIndex || 0;
    const limit = +req.query.limit || 9;
    const order = req.query.order === "asc" ? 1 : 1;
    const posts = await Post.find({
      ...(req.query.userID && { userID: req.query.userID }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postID && { _id: req.query.postID }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm }, $options: "i" },
        ],
      }),
    })
      .sort({
        updatedAt: order,
      })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post({ createdAt: { $gte: oneMonthAgo } });
    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(errorHandler(error));
  }
};
