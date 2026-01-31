import Enrollment from "../models/enrollmentModel.js";
import cloudinary from "../config/cloudinary.js";

export const getSignedReceiptUrl = async (req, res) => {
    try {
        const publicId = decodeURIComponent(req.params.publicId);

        const enrollment = await Enrollment.findOne({
            "receipt.public_id": publicId,
        });

        if (!enrollment || !enrollment.receipt?.version) {
            return res.status(404).json({ message: "Receipt not found" });
        }

        const url = cloudinary.url(publicId, {
            resource_type: "raw",
            version: enrollment.receipt.version, // ✅ THIS FIXES 404
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300,
        });

        res.json({ success: true, url });
    } catch (err) {
        res.status(500).json({ message: "Failed to generate receipt URL" });
    }
};
