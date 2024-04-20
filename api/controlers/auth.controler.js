import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// api
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

export const google = async (req, res, next) => {
  const { name, email, photoURL } = req.body;
  console.log(name);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("acesses_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const Randompassword = Math.random().toString(36).slice(-8);
      const hasdedPassword = bcryptjs.hashSync(Randompassword, 10);
      const username = name.toLowerCase().split(" ").join("") + Date.now();
      console.log(username);
      const newUser = new User({
        username,
        email,
        password: hasdedPassword,
        photoURL,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("acesses_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
