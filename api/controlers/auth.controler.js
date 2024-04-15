import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required!"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser
    .save()
    .then((msg) => {
      res.json({ message: "signup working." });
    })
    .catch((err) => {
      next(err);
    });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(500, "pls fill input fields."));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "Invalid credentials"));
    }
    const chekedPassword = bcryptjs.compareSync(password, user.password);
    if (!chekedPassword) {
      return next(errorHandler(400, "invalid credentials"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie("acesses_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
