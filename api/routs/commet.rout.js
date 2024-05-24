import express from "express";
import { isAuth } from "../../utils/isAuth.js";
import {
  createComment,
  getComments,
  likeCommnet,
} from "../controlers/commemt.controler.js";
const router = express.Router();
router
  .post("/create", isAuth, createComment)
  .get("/getComments/:postID", getComments)
  .put("/like-comment/:commentID", isAuth, likeCommnet);

export default router;
