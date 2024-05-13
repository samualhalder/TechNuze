import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controlers/post.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();
router
  .post("/createPost", isAuth, createPost)
  .get("/getposts", getPosts)
  .delete("/delete-post", isAuth, deletePost)
  .put("/update-post/:postID/:userID", isAuth, updatePost);

export default router;
