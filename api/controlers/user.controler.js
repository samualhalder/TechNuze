import { errorHandler } from "../../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "hello world" });
};

export const updateUser = (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You are not allowed to do that"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(401, "password must be more than 6 charerters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 8 || req.body.username.length > 20) {
      return next(errorHandler(401, "username must be in the range of 8-20 "));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(401, "username must be in lower case"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(
          401,
          "user name must have contain only charecters form a to z and number 0-9"
        )
      );
    }
  }
  User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.params,
        photoURL: req.body.photoURL,
      },
    },
    { new: true }
  )
    .then((response) => {
      const { password, ...rest } = response._doc;
      res.status(200).json(rest);
    })
    .catch((err) => next(err));
};
