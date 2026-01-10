import jwt from "jsonwebtoken";

/*
  ACCESS TOKEN  -> 15 min
  REFRESH TOKEN -> 7 days
*/

export const generateToken = (res, payload) => {
  // payload = { id, role }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // 🍪 Access Token Cookie (CROSS-DOMAIN SAFE)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,        // 🔥 ALWAYS true on HTTPS (Render + Vercel)
    sameSite: "None",    // 🔥 REQUIRED for cross-origin
    maxAge: 15 * 60 * 1000,
  });

  // 🍪 Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
