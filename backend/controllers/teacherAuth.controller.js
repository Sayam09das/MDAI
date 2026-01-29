import Teacher from "../models/teacherModel.js";
import cloudinary from "../config/cloudinary.js";
import { z } from "zod";

/* ======================================================
   CLOUDINARY HELPER
====================================================== */
const uploadToCloudinary = async (file, folder, oldPublicId = null) => {
  if (!file) return null;

  // delete old file if exists
  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId, {
      resource_type: "auto", // 🔥 supports image + pdf
    });
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto", // 🔥 IMPORTANT
    }
  );

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

/* ======================================================
   REGISTER TEACHER
====================================================== */
export const registerTeacher = async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().min(10),
      address: z.string().min(5),
      gender: z.enum(["male", "female", "other"]),
      about: z.string().max(500).optional(),
      skills: z.array(z.string()).max(10).optional(),
      experience: z.number().min(0).optional(),
      joinWhatsappGroup: z.boolean().optional(),
    });

    const data = schema.parse(req.body);

    const exists = await Teacher.findOne({ email: data.email });
    if (exists) {
      return res.status(409).json({ message: "Teacher already registered" });
    }

    const teacher = await Teacher.create({
      ...data,

      profileImage: await uploadToCloudinary(
        req.files?.profileImage?.[0],
        "teachers/profile"
      ),

      class10Certificate: await uploadToCloudinary(
        req.files?.class10Certificate?.[0],
        "teachers/certificates"
      ),

      class12Certificate: await uploadToCloudinary(
        req.files?.class12Certificate?.[0],
        "teachers/certificates"
      ),

      collegeCertificate: await uploadToCloudinary(
        req.files?.collegeCertificate?.[0],
        "teachers/certificates"
      ),

      phdOrOtherCertificate: await uploadToCloudinary(
        req.files?.phdOrOtherCertificate?.[0],
        "teachers/certificates"
      ),

      isVerified: true,
      isSuspended: false,
    });

    res.status(201).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Register Teacher Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   UPDATE TEACHER PROFILE
====================================================== */
export const updateTeacherProfile = async (req, res) => {
  try {
    let { teacherId } = req.params;
    if (teacherId === "me") teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ===== Upload helper =====
    const uploadToCloudinary = async (file, folder, oldPublicId) => {
      if (!file) return null;

      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: "auto",
        });
      }

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder,
          resource_type: "auto",
        }
      );

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    };

    // ===== Handle uploads (ONLY way to touch certificates) =====
    if (req.files?.profileImage) {
      teacher.profileImage = await uploadToCloudinary(
        req.files.profileImage[0],
        "teachers/profile",
        teacher.profileImage?.public_id
      );
    }

    if (req.files?.class10Certificate) {
      teacher.class10Certificate = await uploadToCloudinary(
        req.files.class10Certificate[0],
        "teachers/certificates",
        teacher.class10Certificate?.public_id
      );
    }

    if (req.files?.class12Certificate) {
      teacher.class12Certificate = await uploadToCloudinary(
        req.files.class12Certificate[0],
        "teachers/certificates",
        teacher.class12Certificate?.public_id
      );
    }

    if (req.files?.collegeCertificate) {
      teacher.collegeCertificate = await uploadToCloudinary(
        req.files.collegeCertificate[0],
        "teachers/certificates",
        teacher.collegeCertificate?.public_id
      );
    }

    if (req.files?.phdOrOtherCertificate) {
      teacher.phdOrOtherCertificate = await uploadToCloudinary(
        req.files.phdOrOtherCertificate[0],
        "teachers/certificates",
        teacher.phdOrOtherCertificate?.public_id
      );
    }

    // ===== SAFE BODY UPDATE (NO CERTIFICATE FIELDS) =====
    const {
      class10Certificate,
      class12Certificate,
      collegeCertificate,
      phdOrOtherCertificate,
      profileImage,
      ...safeBody
    } = req.body;
    // Normalize incoming values when request is multipart/form-data
    if (safeBody.skills && typeof safeBody.skills === "string") {
      try {
        safeBody.skills = JSON.parse(safeBody.skills);
      } catch (err) {
        // fallback: comma separated
        safeBody.skills = safeBody.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (safeBody.experience !== undefined) {
      const num = Number(safeBody.experience);
      safeBody.experience = Number.isFinite(num) ? num : teacher.experience;
    }

    if (safeBody.joinWhatsappGroup !== undefined) {
      if (typeof safeBody.joinWhatsappGroup === "string") {
        safeBody.joinWhatsappGroup = safeBody.joinWhatsappGroup === "true";
      } else {
        safeBody.joinWhatsappGroup = Boolean(safeBody.joinWhatsappGroup);
      }
    }

    Object.assign(teacher, safeBody);
    await teacher.save();

    res.json({
      success: true,
      message: "Teacher profile updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ isSuspended: false });
    const suspendedTeachers = await Teacher.countDocuments({ isSuspended: true });

    res.json({
      totalTeachers,
      activeTeachers,
      suspendedTeachers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher stats" });
  }
};


export const suspendTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    await Teacher.findByIdAndUpdate(teacherId, {
      isSuspended: true,
    });

    res.json({ message: "Teacher suspended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend teacher" });
  }
};


export const resumeTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    await Teacher.findByIdAndUpdate(teacherId, {
      isSuspended: false,
    });

    res.json({ message: "Teacher activated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate teacher" });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.aggregate([
      {
        $lookup: {
          from: "courses", // MongoDB collection name
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$instructor", "$$teacherId"] },
              },
            },
            {
              $project: { title: 1 },
            },
          ],
          as: "courses",
        },
      },
      {
        $addFields: {
          courseCount: { $size: "$courses" },
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          phone: 1,
          address: 1,
          gender: 1,
          class10Certificate: 1,
          class12Certificate: 1,
          collegeCertificate: 1,
          phdOrOtherCertificate: 1,
          profileImage: 1,
          isSuspended: 1,
          createdAt: 1,
          courseCount: 1,
          courses: 1,
        },
      },
    ]);

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Get Teachers Error:", error);
    res.status(500).json({
      message: "Failed to fetch teachers",
    });
  }
};




export const teacherOnboardingAnalytics = async (req, res) => {
  try {
    const data = await Teacher.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
};


export const courseCreationAnalytics = async (req, res) => {
  try {
    const data = await Course.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(
      data.map(d => ({
        month: `Month ${d._id}`,
        value: d.count
      }))
    );
  } catch {
    res.status(500).json({ message: "Failed course analytics" });
  }
};


export const feedbackAnalytics = async (req, res) => {
  try {
    // Placeholder: Assuming Review model exists, but for now return dummy data
    res.json([
      { month: "Month 1", value: 4.5 },
      { month: "Month 2", value: 4.7 },
      { month: "Month 3", value: 4.3 },
    ]);
  } catch {
    res.status(500).json({ message: "Failed feedback analytics" });
  }
};
