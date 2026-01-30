import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
    try {
        // IMPORTANT: decode because public_id contains "/"
        const publicId = decodeURIComponent(req.params.publicId);

        if (!publicId) {
            return res.status(400).json({ message: "public_id required" });
        }

        const signedUrl = cloudinary.url(publicId, {
            resource_type: "raw",   // ✅ PDF is RAW
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300 // 5 minutes
        });

        res.json({
            success: true,
            url: signedUrl
        });
    } catch (err) {
        console.error("Signed receipt error:", err);
        res.status(500).json({ message: "Failed to generate receipt URL" });
    }
};
