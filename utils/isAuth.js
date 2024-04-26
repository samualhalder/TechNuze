import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  const token = req.cookies.acesses_token;
  if (!token) {
    return next(errorHandler(401, "no such user!"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "no such user"));
    }
    req.user = user;
    next();
  });
};
