import express from "express";
import { deleteUser, test, updateUser } from "../controlers/user.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();

router
  .get("/test", test)
  .put("/update/:id", isAuth, updateUser)
  .delete("/delete/:id", isAuth, deleteUser);

export default router;
