import Resource from "../models/ResourceModel.js";
import cloudinary from "../config/cloudinary.js";

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
            driveLink,
            resourceType,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Thumbnail image is required",
            });
        }

        // ✅ Upload to Cloudinary (resources folder)
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "resources",
            }
        );

        const resource = await Resource.create({
            title,
            description,
            courseTitle,
            teacherName,
            thumbnail: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
            driveLink,
            resourceType,
        });

        res.status(201).json({
            message: "Resource created successfully",
            resource,
        });
    } catch (error) {
        console.error("CREATE RESOURCE ERROR:", error);
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

    // ✅ If new thumbnail uploaded
    if (req.file) {
      // 🔥 Delete old image from Cloudinary
      if (resource.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(resource.thumbnail.public_id);
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "resources",
        }
      );

      resource.thumbnail = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("UPDATE RESOURCE ERROR:", error);
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

    // 🔥 Delete thumbnail from Cloudinary
    if (resource.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(resource.thumbnail.public_id);
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
