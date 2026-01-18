import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE RESOURCE (Teacher)
   LINK + optional THUMBNAIL
========================= */
export const createResource = async (req, res) => {
    try {
        const { title, courseTitle, tags, externalLink } = req.body;

        if (!externalLink) {
            return res.status(400).json({ message: "External link is required" });
        }

        let thumbnailUrl = "";

        // ✅ Cloudinary upload using BUFFER (memoryStorage safe)
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                { folder: "resource-thumbnails" }
            );

            thumbnailUrl = result.secure_url;
        }

        const resource = await Resource.create({
            title,
            courseTitle,
            tags,
            resourceType: "link",
            externalLink,
            thumbnail: thumbnailUrl,
        });

        res.status(201).json({
            success: true,
            resource,
        });
    } catch (error) {
        console.error("CREATE RESOURCE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   GET ALL RESOURCES
========================= */
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({ isActive: true }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            resources,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   GET RESOURCE BY ID
========================= */
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource || !resource.isActive) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json({
            success: true,
            resource,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   UPDATE RESOURCE (Teacher)
========================= */
export const updateResource = async (req, res) => {
    try {
        const { title, courseTitle, tags, externalLink } = req.body;

        const updateData = {
            title,
            courseTitle,
            tags,
            externalLink,
        };

        // ✅ Update thumbnail if provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                { folder: "resource-thumbnails" }
            );
            updateData.thumbnail = result.secure_url;
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json({
            success: true,
            resource: updatedResource,
        });
    } catch (error) {
        console.error("UPDATE RESOURCE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   DELETE RESOURCE (Teacher)
========================= */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
