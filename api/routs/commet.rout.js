import express from "express";
import { isAuth } from "../../utils/isAuth.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  getComments,
  likeCommnet,
} from "../controlers/commemt.controler.js";
const router = express.Router();
router
  .post("/create", isAuth, createComment)
  .get("/getComments/:postID", getComments)
  .get("/getall-comments", isAuth, getAllComments)
  .put("/like-comment/:commentID", isAuth, likeCommnet)
  .put("/edit-comment/:commentID", isAuth, editComment)
  .delete("/delete-comment/:commentID", isAuth, deleteComment);

export default router;
