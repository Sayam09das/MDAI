import app from "../backend/app.js";

// Render backend URL for API proxy
const RENDER_BACKEND_URL = process.env.RENDER_BACKEND_URL || "https://mdai-0jhi.onrender.com";

export default async function handler(req, res) {
  // For serverless environments (Vercel), we need to forward the request
  // to the Render backend instead of using the Express app directly
  
  const path = req.url.replace(/^\/api/, "");
  const targetUrl = `${RENDER_BACKEND_URL}${path}`;
  
  try {
    // Forward the request to the Render backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
        ...req.headers,
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return res.status(500).json({
      success: false,
      message: "API request failed",
      error: error.message
    });
  }
}

