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

export const getTeacherCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            instructor: req.user.id,
            isPublished: true,
        })
            .select("_id title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            isPublished: true,
        })
            .populate("instructor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const publishCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user.id,
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.isPublished = true;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Course published successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.isPublished) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
