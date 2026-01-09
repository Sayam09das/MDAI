import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, role }
    if (decoded.role === "user") {
      req.user = await User.findById(decoded.id).select("-password");
    } else if (decoded.role === "teacher") {
      req.user = await Teacher.findById(decoded.id).select("-password");
    } else {
      return res.status(401).json({ message: "Invalid role" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Account not found" });
    }

    // attach role for later use
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const userOnly = (req, res, next) => {
  if (req.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

export const teacherOnly = (req, res, next) => {
  if (req.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }
  next();
};
