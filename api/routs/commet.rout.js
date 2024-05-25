import express from "express";
import { isAuth } from "../../utils/isAuth.js";
import {
  createComment,
  editComment,
  getComments,
  likeCommnet,
} from "../controlers/commemt.controler.js";
const router = express.Router();
router
  .post("/create", isAuth, createComment)
  .get("/getComments/:postID", getComments)
  .put("/like-comment/:commentID", isAuth, likeCommnet)
  .put("/edit-comment/:commentID", isAuth, editComment);

export default router;
