import express from "express";
import { signUp } from "../controlers/auth.controler.js";

const router = express.Router();
router.post("/signup", signUp);

export default router;
