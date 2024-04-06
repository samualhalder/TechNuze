import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.PORT);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("conneted to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.listen(process.env.PORT, () => {
  console.log("server started!!!");
});
