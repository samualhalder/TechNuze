import express from "express";
import { createPost, getPosts } from "../controlers/post.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();
router.post("/createPost", isAuth, createPost).get("/getposts", getPosts);

export default router;
