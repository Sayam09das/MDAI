import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({ message: "Public ID missing" });
        }

        const signedUrl = cloudinary.url(publicId, {
            resource_type: "image",
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        });

        res.json({
            success: true,
            url: signedUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate receipt URL" });
    }
};
