import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);

    if (!publicId) {
      return res.status(400).json({ message: "public_id required" });
    }

    // ✅ CORRECT WAY FOR RAW / PDF
    const signedUrl = cloudinary.utils.private_download_url(
      publicId,
      "pdf", // file type
      {
        resource_type: "raw",
        expires_at: Math.floor(Date.now() / 1000) + 300, // 5 min
      }
    );

    res.json({
      success: true,
      url: signedUrl,
    });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ message: "Failed to generate receipt URL" });
  }
};
