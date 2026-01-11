import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        let thumbnailData;

        // ✅ TEMP: allow JSON testing
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                { folder: "courses" }
            );

            thumbnailData = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        } else {
            // JSON test mode
            thumbnailData = {
                public_id: "test",
                url: "test",
            };
        }

        const course = await Course.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            duration: req.body.duration,
            level: req.body.level,
            language: req.body.language,
            requirements: req.body.requirements,
            learningOutcomes: req.body.learningOutcomes,
            thumbnail: thumbnailData,
            instructor: req.user.id,
        });

        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
