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
      noOflikes: -1,
    });

    res.status(200).json(response);
  } catch (error) {
    next(errorHandler(400, error));
  }
};

export const getAllComments = async (req, res, next) => {
  console.log("inside this section");
  if (!req.user.isAdmin) {
    console.log("not allowed");
    return next(errorHandler(401, "you are not allowed."));
  }
  try {
    const startInd = req.query.startInd || 0;
    const limit = req.query.limit || 9;
    const order = req.query.order || -1;
    const comments = await Comment.find({})
      .skip(startInd)
      .limit(limit)
      .sort({ createdAt: order });
    const totalComments = await Comment.countDocuments();
    res.status(200).json({ comments: comments, totalComments });
  } catch (error) {
    next(error);
  }
};

export const likeCommnet = async (req, res, next) => {
  const { commentID } = req.params;
  console.log(req.user);
  const { id } = req.user;
  const comment = await Comment.findById(commentID);
  if (!comment) {
    return next(errorHandler(404, "comment not found"));
  }
  try {
    const index = comment.likes.indexOf(id);
    if (index === -1) {
      comment.noOflikes += 1;
      comment.likes.push(id);
    } else {
      comment.noOflikes -= 1;
      comment.likes.splice(index, 1);
    }
    const response = await comment.save();
    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const editComment = async (req, res, next) => {
  const { commentID } = req.params;

  const comment = await Comment.findById(commentID);
  if (!comment) {
    next(errorHandler(404, "no such comment is found"));
  }
  try {
    if (comment.userID !== req.user.id) {
      next(errorHandler(401, "you are not allowed to edit this comment"));
    }
    const response = await Comment.findByIdAndUpdate(
      commentID,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentID);
    if (!comment) {
      return next(errorHandler(404, "comment not found."));
    }
    if (comment.userID != req.user.id || req.user.isAdmin === false) {
      return next(
        errorHandler(401, "you are not allowed to delete this commnet.")
      );
    }
    const response = await Comment.findByIdAndDelete(req.params.commentID);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
