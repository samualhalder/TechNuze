import express from "express";
import { google, signIn, signUp } from "../controlers/auth.controler.js";

const router = express.Router();
router.post("/signup", signUp).post("/signin", signIn).post("/google", google);

export default router;
