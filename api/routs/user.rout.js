import express from "express";
import {
  deleteUser,
  getAllUsers,
  signOut,
  test,
  updateUser,
} from "../controlers/user.controler.js";
import { isAuth } from "../../utils/isAuth.js";
const router = express.Router();

router
  .get("/test", test)
  .get("/get-all-users", isAuth, getAllUsers)
  .put("/update/:id", isAuth, updateUser)
  .delete("/delete/:id", isAuth, deleteUser)
  .post("/signout", signOut);

export default router;
