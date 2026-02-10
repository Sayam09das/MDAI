import app from "../backend/app.js";

export default function handler(req, res) {
  // Remove the /api prefix from the request path
  const path = req.url.replace(/^\/api/, "");
  
  // Rewrite the URL and use the Express app
  req.url = path;
  
  return app(req, res);
}

