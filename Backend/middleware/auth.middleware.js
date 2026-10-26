import jwt from "jsonwebtoken";

import { config } from "../config.js";
import User from "../model/user.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).select("fullname email").lean();

    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session is invalid or expired" });
    }
    next(error);
  }
};
