import express from "express";
import { isAuth } from "../../utils/isAuth.js";
import { createComment } from "../controlers/commemt.controler.js";
const router = express.Router();
router.post("/create", isAuth, createComment);

export default router;
