import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE RESOURCE (Teacher)
========================= */
export const createResource = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const {
            title,
            courseTitle,
            tags,
            resourceType,
            fileUrl,
            externalLink,
            fileFormat,
            thumbnail,
        } = req.body;

        const resource = await Resource.create({
            title,
            courseTitle,
            tags,
            resourceType,
            fileUrl,
            externalLink,
            fileFormat,
            thumbnail,
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   GET ALL RESOURCES (Student + Teacher)
========================= */
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({ isActive: true }).sort({
            createdAt: -1,
        });

        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   GET SINGLE RESOURCE (Student + Teacher)
========================= */
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource || !resource.isActive) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   UPDATE RESOURCE (Teacher)
========================= */
export const updateResource = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   DELETE RESOURCE (Teacher)
========================= */
export const deleteResource = async (req, res) => {
    try {
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Optional: delete from Cloudinary later if needed
        await resource.deleteOne();

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
