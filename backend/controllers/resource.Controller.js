import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";

/* =====================================================
   CREATE RESOURCE
===================================================== */
export const createResource = async (req, res) => {
    try {
        const {
            title,
            courseTitle,
            resourceType,
            tags,
            pages,
            externalLink,
        } = req.body;

        // REQUIRED FIELDS ONLY
        if (!title || !courseTitle || !resourceType || !tags) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        let fileUrl = null;

        /* ---------- FILE BASED RESOURCE ---------- */
        if (["pdf", "video", "file"].includes(resourceType)) {
            if (!req.files?.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required for pdf, video, or file",
                });
            }

            const fileUpload = await cloudinary.uploader.upload(
                req.files.file[0].path,
                {
                    folder: "resources/files",
                    resource_type: "auto",
                }
            );

            fileUrl = fileUpload.secure_url;
        }

        /* ---------- LINK RESOURCE ---------- */
        if (resourceType === "link" && !externalLink) {
            return res.status(400).json({
                success: false,
                message: "External link is required",
            });
        }

        const resource = await Resource.create({
            title,
            courseTitle,
            resourceType,
            tags: Array.isArray(tags) ? tags : tags.split(","),
            pages: resourceType === "pdf" ? pages : undefined,
            fileUrl,
            externalLink: resourceType === "link" ? externalLink : undefined,
            // ❌ NO thumbnail saved
        });

        res.status(201).json({
            success: true,
            message: "Resource created successfully",
            resource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Create resource failed",
            error: error.message,
        });
    }
};


/* =====================================================
   UPDATE RESOURCE
===================================================== */
export const updateResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        const {
            title,
            courseTitle,
            resourceType,
            tags,
            pages,
            externalLink,
            isActive,
        } = req.body;

        /* ---------- Update fields ---------- */
        if (title) resource.title = title;
        if (courseTitle) resource.courseTitle = courseTitle;
        if (resourceType) resource.resourceType = resourceType;
        if (tags) resource.tags = Array.isArray(tags) ? tags : tags.split(",");
        if (typeof isActive !== "undefined") resource.isActive = isActive;

        if (resourceType === "pdf") {
            resource.pages = pages;
        } else {
            resource.pages = undefined;
        }

        /* ---------- Update Thumbnail ---------- */
        if (req.files?.thumbnail) {
            const oldThumbId = resource.thumbnail
                ?.split("/")
                .pop()
                .split(".")[0];

            if (oldThumbId) {
                await cloudinary.uploader.destroy(
                    `resources/thumbnails/${oldThumbId}`
                );
            }

            const thumbUpload = await cloudinary.uploader.upload(
                req.files.thumbnail[0].path,
                {
                    folder: "resources/thumbnails",
                    resource_type: "image",
                }
            );

            resource.thumbnail = thumbUpload.secure_url;
        }

        /* ---------- Update File ---------- */
        if (req.files?.file) {
            const oldFileId = resource.fileUrl
                ?.split("/")
                .pop()
                .split(".")[0];

            if (oldFileId) {
                await cloudinary.uploader.destroy(
                    `resources/files/${oldFileId}`,
                    { resource_type: "auto" }
                );
            }

            const fileUpload = await cloudinary.uploader.upload(
                req.files.file[0].path,
                {
                    folder: "resources/files",
                    resource_type: "auto",
                }
            );

            resource.fileUrl = fileUpload.secure_url;
        }

        if (resource.resourceType === "link") {
            resource.externalLink = externalLink;
            resource.fileUrl = undefined;
        }

        await resource.save();

        res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            resource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error: error.message,
        });
    }
};

/* =====================================================
   DELETE RESOURCE
===================================================== */
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        /* ---------- Delete thumbnail ---------- */
        if (resource.thumbnail) {
            const thumbId = resource.thumbnail.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
                `resources/thumbnails/${thumbId}`
            );
        }

        /* ---------- Delete file ---------- */
        if (resource.fileUrl) {
            const fileId = resource.fileUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
                `resources/files/${fileId}`,
                { resource_type: "auto" }
            );
        }

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: error.message,
        });
    }
};

/* =====================================================
   STUDENT → SHOW RESOURCES (ONLY ACTIVE)
===================================================== */
export const getResourcesForStudent = async (req, res) => {
    try {
        const resources = await Resource.find({ isActive: true })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resources",
        });
    }
};

/* =====================================================
   TEACHER / ADMIN → SHOW ALL RESOURCES
===================================================== */
export const getResourcesForTeacher = async (req, res) => {
    try {
        const resources = await Resource.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resources",
        });
    }
};
