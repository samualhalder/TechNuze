import express from "express";
import { test, updateUser } from "../controlers/user.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();

router.get("/test", test).put("/update/:id", isAuth, updateUser);

export default router;
