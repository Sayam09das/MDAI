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
        }).sort({ createdAt: -1 });

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
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the instructor - if so, allow access even if not published
    const isInstructor = req.user && 
      course.instructor && 
      course.instructor._id.toString() === req.user.id;

    // If not the instructor, only show published courses
    if (!isInstructor && !course.isPublished) {
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

/* =====================================================
   GLOBAL SEARCH FOR COURSES
===================================================== */
export const searchCourses = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q || q.trim() === "") {
            return res.json([]);
        }

        const searchQuery = {
            isPublished: true,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { level: { $regex: q, $options: "i" } },
            ],
        };

        const courses = await Course.find(searchQuery)
            .populate("instructor", "name email")
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =====================================================
   UPDATE COURSE
===================================================== */
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            instructor: req.user.id,
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        // Update basic fields
        const allowedFields = [
            'title', 'description', 'price', 'category', 
            'duration', 'level', 'language', 'requirements', 
            'learningOutcomes', 'thumbnail'
        ];

        // Handle JSON fields
        if (req.body.requirements) {
            req.body.requirements = typeof req.body.requirements === 'string' 
                ? JSON.parse(req.body.requirements) 
                : req.body.requirements;
        }
        if (req.body.learningOutcomes) {
            req.body.learningOutcomes = typeof req.body.learningOutcomes === 'string' 
                ? JSON.parse(req.body.learningOutcomes) 
                : req.body.learningOutcomes;
        }

        // Update fields
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field];
            }
        });

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
