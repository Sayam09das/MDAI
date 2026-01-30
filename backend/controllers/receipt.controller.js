import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: "public_id required" });
    }

    const signedUrl = cloudinary.url(publicId, {
      resource_type: "raw",     // 🔥 MOST IMPORTANT LINE
      sign_url: false,
    });

    res.json({
      success: true,
      url: signedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate receipt URL" });
  }
};
