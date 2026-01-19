import Resource from "../models/ResourceModel.js";

/* =====================================================
   CREATE RESOURCE (TEACHER)
===================================================== */
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      courseTitle,
      teacherName,
      thumbnail, // ✅ URL from body
      driveLink,
      resourceType,
    } = req.body;

    if (!thumbnail) {
      return res.status(400).json({
        message: "Thumbnail image URL is required",
      });
    }

    const resource = await Resource.create({
      title,
      description,
      courseTitle,
      teacherName,
      thumbnail, // ✅ save URL directly
      driveLink,
      resourceType,
    });

    res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create resource" });
  }
};

/* =====================================================
   UPDATE RESOURCE (TEACHER)
===================================================== */
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const {
            title,
            description,
            courseTitle,
            teacherName,
            driveLink,
            resourceType,
        } = req.body;

        resource.title = title ?? resource.title;
        resource.description = description ?? resource.description;
        resource.courseTitle = courseTitle ?? resource.courseTitle;
        resource.teacherName = teacherName ?? resource.teacherName;
        resource.driveLink = driveLink ?? resource.driveLink;
        resource.resourceType = resourceType ?? resource.resourceType;

        /* ===== Update thumbnail ONLY if new one uploaded ===== */
        if (req.file && req.file.path) {
            resource.thumbnail = req.file.path; // ✅ Cloudinary URL
        }

        await resource.save();

        res.json({
            message: "Resource updated successfully",
            resource,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update resource" });
    }
};

/* =====================================================
   DELETE RESOURCE (TEACHER)
===================================================== */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.deleteOne();

        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete resource" });
    }
};

/* =====================================================
   TEACHER: GET OWN RESOURCES
===================================================== */
export const getTeacherResources = async (req, res) => {
    try {
        const { teacherName } = req.query;

        if (!teacherName) {
            return res.status(400).json({
                message: "Teacher name is required",
            });
        }

        const resources = await Resource.find({ teacherName }).sort({
            createdAt: -1,
        });

        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch teacher resources",
        });
    }
};

/* =====================================================
   STUDENT: GET ALL RESOURCES
===================================================== */
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch resources",
        });
    }
};
