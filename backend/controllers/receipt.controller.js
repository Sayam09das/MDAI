import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
    try {
        const publicId = decodeURIComponent(req.params.publicId);

        const url = cloudinary.url(publicId, {
            resource_type: "raw",
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300,
        });

        res.json({ success: true, url });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate receipt URL" });
    }
};

