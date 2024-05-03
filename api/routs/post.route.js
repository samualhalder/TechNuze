import express from "express";
import { createPost } from "../controlers/post.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();
router.post("/createPost", isAuth, createPost);

export default router;
