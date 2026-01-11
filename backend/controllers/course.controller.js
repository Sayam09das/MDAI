import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Thumbnail is required" });
        }

        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            { folder: "courses" }
        );

        const course = await Course.create({
            ...req.body,
            requirements: JSON.parse(req.body.requirements || "[]"),
            learningOutcomes: JSON.parse(req.body.learningOutcomes || "[]"),
            thumbnail: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
            instructor: req.user.id,
        });

        res.status(201).json({ success: true, course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
