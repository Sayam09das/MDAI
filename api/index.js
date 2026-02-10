import app from "../backend/app.js";

export default function handler(req, res) {
  // Don't modify the URL - let the Express app handle the full path
  // The Express app already has routes prefixed with /api
  return app(req, res);
}

