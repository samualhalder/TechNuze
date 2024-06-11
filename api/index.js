import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRout from "./routs/user.rout.js";
import authRouter from "./routs/auth.rout.js";
import postRouter from "./routs/post.route.js";
import commentRouter from "./routs/commet.rout.js";
import cookieParser from "cookie-parser";
import path from "path";
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
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

app.listen(process.env.PORT, () => {
  console.log("server started!!!");
});

app.use("/api/user", userRout);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessege = err.message || "Interanl server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    errMessege,
  });
});
