import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
    try {
        const { public_id } = req.query;

        if (!public_id) {
            return res.status(400).json({ message: "public_id is required" });
        }

        const signedUrl = cloudinary.url(public_id, {
            resource_type: "image",
            format: "pdf",      // force PDF
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300, // 5 min
        });

        res.json({
            success: true,
            url: signedUrl,
        });
    } catch (error) {
        console.error("Signed URL error:", error);
        res.status(500).json({ message: "Failed to generate signed receipt URL" });
    }
};
