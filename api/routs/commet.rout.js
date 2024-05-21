import express from "express";
import { isAuth } from "../../utils/isAuth.js";
import { createComment, getComments } from "../controlers/commemt.controler.js";
const router = express.Router();
router
  .post("/create", isAuth, createComment)
  .get("/getComments/:postID", getComments);

export default router;
