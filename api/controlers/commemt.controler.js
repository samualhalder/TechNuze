import { errorHandler } from "../../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  const { content, userID, postID } = req.body;
  console.log(req.body);
  if (userID !== req.user.id) {
    return next(errorHandler(401, "you are not allowed to comment"));
  }
  try {
    const newComment = new Comment({
      content,
      userID,
      postID,
    });
    const response = await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    return next(errorHandler(404, "yes some error"));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const response = await Comment.find({ postID: req.params.postID }).sort({
      noOflikes: 1,
    });

    res.status(200).json(response);
  } catch (error) {
    next(errorHandler(400, error));
  }
};
