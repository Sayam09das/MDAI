import Resource from "../models/Resource.js";
import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE RESOURCE ================= */
export const createResource = async (req, res) => {
    try {
        const {
            title,
            course,
            tags,
            resourceType,
            pages,
            rating,
            externalLink,
        } = req.body;

        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }

        let thumbnailUrl = null;
        let fileUrl = null;

        if (req.files?.thumbnail) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.thumbnail[0].mimetype};base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
                { folder: "resources/thumbnails" }
            );
            thumbnailUrl = result.secure_url;
        }

        if (req.files?.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.file[0].mimetype};base64,${req.files.file[0].buffer.toString("base64")}`,
                { folder: "resources/files", resource_type: "auto" }
            );
            fileUrl = result.secure_url;
        }

        const resource = await Resource.create({
            title,
            course,
            tags,
            resourceType,
            pages,
            rating,
            thumbnail: thumbnailUrl,
            fileUrl,
            externalLink,
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= EDIT RESOURCE ================= */
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("course");
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (resource.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        let thumbnailUrl = resource.thumbnail;
        let fileUrl = resource.fileUrl;

        if (req.files?.thumbnail) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.thumbnail[0].mimetype};base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
                { folder: "resources/thumbnails" }
            );
            thumbnailUrl = result.secure_url;
        }

        if (req.files?.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.file[0].mimetype};base64,${req.files.file[0].buffer.toString("base64")}`,
                { folder: "resources/files", resource_type: "auto" }
            );
            fileUrl = result.secure_url;
        }

        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                thumbnail: thumbnailUrl,
                fileUrl,
            },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE RESOURCE ================= */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("course");
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (resource.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await resource.deleteOne();
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET RESOURCES BY COURSE ================= */
export const getResourcesByCourse = async (req, res) => {
    try {
        const resources = await Resource.find({
            course: req.params.courseId,
            isActive: true,
        }).sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= GET SINGLE RESOURCE ================= */
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("course");
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (
            req.user.role !== "teacher" &&
            resource.isActive === false
        ) {
            return res.status(403).json({ message: "Not allowed" });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
