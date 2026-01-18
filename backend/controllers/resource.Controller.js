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

        // ✅ validate course
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
            createdBy: req.user._id, // ✅ OWNER (TEACHER USER)
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE RESOURCE ================= */
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // 🔐 ownership check
        if (!resource.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: "Not allowed" });
        }

        if (req.files?.thumbnail) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.thumbnail[0].mimetype};base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
                { folder: "resources/thumbnails" }
            );
            resource.thumbnail = result.secure_url;
        }

        if (req.files?.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.files.file[0].mimetype};base64,${req.files.file[0].buffer.toString("base64")}`,
                { folder: "resources/files", resource_type: "auto" }
            );
            resource.fileUrl = result.secure_url;
        }

        if (req.body.title) resource.title = req.body.title;
        if (req.body.tags) resource.tags = req.body.tags;
        if (req.body.pages) resource.pages = req.body.pages;
        if (req.body.rating) resource.rating = req.body.rating;
        if (req.body.externalLink) resource.externalLink = req.body.externalLink;
        if (req.body.resourceType) resource.resourceType = req.body.resourceType;

        await resource.save();
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE RESOURCE ================= */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // 🔐 ownership check
        if (!resource.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await resource.deleteOne();
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET MY RESOURCES (RELOAD FIX) ================= */
export const getMyResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            createdBy: req.user._id,
        })
            .sort({ createdAt: -1 })
            .populate("course", "title");

        res.json(resources);
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
        const resource = await Resource.findById(req.params.id)
            .populate("course")
            .populate("createdBy", "name email");

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (req.user.role !== "teacher" && resource.isActive === false) {
            return res.status(403).json({ message: "Not allowed" });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
