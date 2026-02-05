import Resource from "../models/ResourceModel.js";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to determine file type from MIME
const getFileTypeFromMime = (mimeType) => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("zip") || mimeType.includes("compressed")) return "zip";
    if (mimeType.includes("document") || mimeType.includes("word")) return "document";
    return "other";
};

/* =====================================================
   CREATE RESOURCE (TEACHER/ADMIN)
===================================================== */
export const createResource = async (req, res) => {
    try {
        const {
            title,
            description,
            courseTitle,
            driveLink,
            fileType,
        } = req.body;

        // Get user info from auth middleware
        const userId = req.user.id;
        const userRole = req.user.role;

        let resourceData = {
            title,
            description,
            courseTitle,
            uploadedBy: userRole,
            fileType: fileType || (req.file ? getFileTypeFromMime(req.file.mimetype) : "other"),
            driveLink,
        };

        // Handle teacher-specific fields
        if (userRole === "teacher") {
            const teacher = await Teacher.findById(userId);
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            resourceData.teacherName = teacher.name;
            resourceData.teacherId = teacher._id;
            resourceData.teacherEmail = teacher.email;
            resourceData.teacherProfileImage = teacher.profileImage;
        }

        // Handle admin-specific fields
        if (userRole === "admin") {
            const admin = await Admin.findById(userId);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            resourceData.adminName = admin.name;
            resourceData.adminId = admin._id;
            resourceData.adminEmail = admin.email;
        }

        let fileData = {};
        let thumbnailData = {};

        // ✅ Upload main file if present
        if (req.file) {
            const fileMimeType = req.file.mimetype;
            const determinedFileType = resourceData.fileType;

            const uploadResult = await cloudinary.uploader.upload(
                `data:${fileMimeType};base64,${req.file.buffer.toString("base64")}`,
                {
                    folder: "library_files",
                    resource_type: determinedFileType === "video" ? "video" : "auto",
                }
            );

            fileData = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
                format: uploadResult.format,
                size: uploadResult.bytes,
            };

            // ✅ Set thumbnail from file for images/videos
            if (determinedFileType === "image") {
                thumbnailData = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }
        }

        // ✅ Upload separate thumbnail if provided
        if (req.files?.thumbnail?.[0]) {
            const thumbResult = await cloudinary.uploader.upload(
                `data:${req.files.thumbnail[0].mimetype};base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
                {
                    folder: "library_thumbnails",
                }
            );
            thumbnailData = {
                public_id: thumbResult.public_id,
                url: thumbResult.secure_url,
            };
        }

        resourceData.file = fileData;
        resourceData.thumbnail = thumbnailData;

        const resource = await Resource.create(resourceData);

        res.status(201).json({
            message: "Resource created successfully",
            resource,
        });
    } catch (error) {
        console.error("CREATE RESOURCE ERROR:", error);
        res.status(500).json({ message: "Failed to create resource", error: error.message });
    }
};

/* =====================================================
   UPDATE RESOURCE (TEACHER/ADMIN)
===================================================== */
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const userRole = req.user.role;
        const userId = req.user.id;

        // Check permissions: teacher can only update their own resources, admin can update all
        if (userRole === "teacher" && resource.teacherId?.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to update this resource" });
        }

        const {
            title,
            description,
            courseTitle,
            driveLink,
            fileType,
        } = req.body;

        // Update text fields
        if (title) resource.title = title;
        if (description) resource.description = description;
        if (courseTitle) resource.courseTitle = courseTitle;
        if (driveLink !== undefined) resource.driveLink = driveLink;
        if (fileType) resource.fileType = fileType;

        // ✅ If new file uploaded
        if (req.file) {
            // Delete old file from Cloudinary
            if (resource.file?.public_id) {
                await cloudinary.uploader.destroy(resource.file.public_id, {
                    resource_type: resource.fileType === "video" ? "video" : "image",
                });
            }

            const fileMimeType = req.file.mimetype;
            const uploadResult = await cloudinary.uploader.upload(
                `data:${fileMimeType};base64,${req.file.buffer.toString("base64")}`,
                {
                    folder: "library_files",
                    resource_type: fileType === "video" ? "video" : "auto",
                }
            );

            resource.file = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
                format: uploadResult.format,
                size: uploadResult.bytes,
            };

            // Update thumbnail for images
            if (getFileTypeFromMime(fileMimeType) === "image") {
                resource.thumbnail = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }
        }

        await resource.save();

        res.json({
            message: "Resource updated successfully",
            resource,
        });
    } catch (error) {
        console.error("UPDATE RESOURCE ERROR:", error);
        res.status(500).json({ message: "Failed to update resource", error: error.message });
    }
};

/* =====================================================
   DELETE RESOURCE (TEACHER/ADMIN)
===================================================== */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const userRole = req.user.role;
        const userId = req.user.id;

        // Check permissions: teacher can only delete their own resources, admin can delete all
        if (userRole === "teacher" && resource.teacherId?.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this resource" });
        }

        // Delete file from Cloudinary
        if (resource.file?.public_id) {
            await cloudinary.uploader.destroy(resource.file.public_id, {
                resource_type: resource.fileType === "video" ? "video" : "image",
            });
        }

        // Delete thumbnail from Cloudinary
        if (resource.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(resource.thumbnail.public_id);
        }

        await resource.deleteOne();

        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete resource", error: error.message });
    }
};

/* =====================================================
   GET SINGLE RESOURCE
===================================================== */
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch resource", error: error.message });
    }
};

/* =====================================================
   TEACHER: GET OWN RESOURCES
===================================================== */
export const getTeacherResources = async (req, res) => {
    try {
        // Get teacher ID from authenticated user (auth middleware sets req.user)
        const teacherId = req.user.id;

        if (!teacherId) {
            return res.status(400).json({
                message: "Teacher ID is required",
            });
        }

        const { search, fileType } = req.query;
        
        let query = { teacherId };
        
        if (fileType && fileType !== "all") {
            query.fileType = fileType;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { courseTitle: { $regex: search, $options: "i" } },
            ];
        }

        const resources = await Resource.find(query).sort({
            createdAt: -1,
        });

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch teacher resources",
            error: error.message,
        });
    }
};

/* =====================================================
   STUDENT: GET ALL RESOURCES
===================================================== */
export const getAllResources = async (req, res) => {
    try {
        const { fileType, search } = req.query;
        
        let query = {};
        
        if (fileType && fileType !== "all") {
            query.fileType = fileType;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { courseTitle: { $regex: search, $options: "i" } },
                { teacherName: { $regex: search, $options: "i" } },
            ];
        }

        const resources = await Resource.find(query).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch resources",
            error: error.message,
        });
    }
};

/* =====================================================
   ADMIN: GET ALL RESOURCES (TEACHER + ADMIN UPLOADS)
===================================================== */
export const getAllResourcesAdmin = async (req, res) => {
    try {
        const { fileType, search, uploadedBy } = req.query;
        
        let query = {};
        
        if (uploadedBy && uploadedBy !== "all") {
            query.uploadedBy = uploadedBy;
        }
        
        if (fileType && fileType !== "all") {
            query.fileType = fileType;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { courseTitle: { $regex: search, $options: "i" } },
                { teacherName: { $regex: search, $options: "i" } },
                { adminName: { $regex: search, $options: "i" } },
            ];
        }

        const resources = await Resource.find(query)
            .populate("teacherId", "name email profileImage")
            .populate("adminId", "name email")
            .sort({ createdAt: -1 });
            
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch resources",
            error: error.message,
        });
    }
};

/* =====================================================
   GLOBAL SEARCH FOR RESOURCES (STUDENT/TEACHER)
===================================================== */
export const searchResources = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q || q.trim() === "") {
            return res.json([]);
        }

        const searchQuery = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { courseTitle: { $regex: q, $options: "i" } },
                { teacherName: { $regex: q, $options: "i" } },
            ],
        };

        const resources = await Resource.find(searchQuery)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to search resources",
            error: error.message,
        });
    }
};

