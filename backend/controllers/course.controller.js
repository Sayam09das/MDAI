import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        // 🔒 STRICT CHECK (production)
        if (!req.file) {
            return res.status(400).json({ message: "Thumbnail is required" });
        }

        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "courses",
            }
        );

        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            duration: req.body.duration,
            level: req.body.level,
            language: req.body.language,
            requirements: JSON.parse(req.body.requirements || "[]"),
            learningOutcomes: JSON.parse(req.body.learningOutcomes || "[]"),
            thumbnail: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
            instructor: req.user.id,
        });

        res.status(201).json({
            success: true,
            course,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
