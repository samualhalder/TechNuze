import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRout from "./routs/user.rout.js";
import authRouter from "./routs/auth.rout.js";
const app = express();
app.use(express.json());
dotenv.config();

//conected to database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("conneted to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRout);
app.use("/api/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log("server started!!!");
});
