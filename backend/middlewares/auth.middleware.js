import jwt from "jsonwebtoken";

/* ================= PROTECT ================= */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, role }
    req.user = decoded; // ✅ id, role available
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/* ================= ROLE GUARDS ================= */
export const userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

export const teacherOnly = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
