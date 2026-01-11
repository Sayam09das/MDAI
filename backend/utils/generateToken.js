import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  // payload = { id, role }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
