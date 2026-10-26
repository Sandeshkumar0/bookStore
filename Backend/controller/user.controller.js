import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "../config.js";
import User from "../model/user.model.js";
import { validateAuthInput } from "../utils/validation.js";

const publicUser = (user) => ({
  id: user._id,
  fullname: user.fullname,
  email: user.email,
});

const createToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email }, config.jwtSecret, {
    expiresIn: "7d",
  });

export const signup = async (req, res, next) => {
  try {
    const { errors, fullname, email } = validateAuthInput(req.body, true);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ message: "Please correct the highlighted fields", errors });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      password: await bcryptjs.hash(req.body.password, 12),
    });

    return res.status(201).json({
      message: "Account created successfully",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { errors, email } = validateAuthInput(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ message: "Enter a valid email and password", errors });
    }

    const user = await User.findOne({ email }).select("+password");
    const passwordMatches = user
      ? await bcryptjs.compare(req.body.password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.status(200).json({ user: publicUser(req.user) });
};
