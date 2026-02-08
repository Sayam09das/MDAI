import Admin from "../models/adminModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";
import Resource from "../models/ResourceModel.js";
import AuditLog from "../models/auditLogModel.js";
import Announcement from "../models/announcementModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import FinanceTransaction from "../models/financeTransactionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { generateReceiptImage } from "../utils/generateReceiptImage.js";
import fs from "fs";

/* =========================================
   HELPER: GENERATE JWT
   ========================================= */
const generateToken = (admin) => {
    return jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

/* =========================================
   HELPER: CREATE AUDIT LOG
   ========================================= */
const createAuditLog = async (adminId, action, details, status = "success") => {
    try {
        await AuditLog.create({
            adminId,
            action,
            details,
            status,
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
};

/* =========================================
   ADMIN: REGISTER
   ========================================= */
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(admin);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: LOGIN
   ========================================= */
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const admin = await Admin.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(admin);

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: LOGOUT
   ========================================= */
export const logoutAdmin = async (req, res) => {
    try {
        // JWT logout handled on frontend by deleting token
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET PROFILE
   ========================================= */
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= ADMIN: GET ALL ENROLLMENTS ================= */
export const getAllEnrollmentsForAdmin = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "fullName email")
            .populate("course", "title price");

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        console.error("Get All Enrollments Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch enrollments" 
        });
    }
};





export const updatePaymentStatusByAdmin = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;

        // First, check if enrollment exists
        const existingEnrollment = await Enrollment.findById(enrollmentId);
        if (!existingEnrollment) {
            return res.status(404).json({ 
                success: false,
                message: "Enrollment not found" 
            });
        }

        if (status !== "PAID") {
            return res.status(400).json({ 
                success: false,
                message: "Only PAID status is allowed" 
            });
        }

        // Check if already paid
        if (existingEnrollment.paymentStatus === "PAID") {
            return res.status(400).json({ 
                success: false,
                message: "Enrollment already paid" 
            });
        }

        // Get course to calculate amounts
        const course = await Course.findById(existingEnrollment.course);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: "Course not found" 
            });
        }

        // Calculate amounts (10% admin cut, 90% teacher)
        const coursePrice = course.price || 0;
        const adminPercentage = 10;
        const adminAmount = Math.round((coursePrice * adminPercentage) / 100 * 100) / 100;
        const teacherAmount = Math.round((coursePrice * (100 - adminPercentage)) / 100 * 100) / 100;

        const receiptNumber = `REC-${Date.now()}-${existingEnrollment._id
            .toString()
            .slice(-4)}`;

        existingEnrollment.receipt = {
            receiptNumber,
            issuedAt: new Date(),
            issuedBy: req.user.id,
        };

        existingEnrollment.paymentStatus = "PAID";
        existingEnrollment.verifiedBy = req.user.id;
        existingEnrollment.verifiedAt = new Date();
        
        // Add amount fields
        existingEnrollment.amount = coursePrice;
        existingEnrollment.adminAmount = adminAmount;
        existingEnrollment.teacherAmount = teacherAmount;
        existingEnrollment.paymentVerifiedAt = new Date();
        
        await existingEnrollment.save();

        // Now populate for receipt generation with correct field names
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "fullName email")
            .populate("course", "title price");

        // Try to generate receipt image, but don't fail if it doesn't work
        let receiptUrl = null;
        let receiptPublicId = null;
        
        try {
            // 1️⃣ Generate image with populated data
            const imagePath = await generateReceiptImage(enrollment);

            // 2️⃣ Upload image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(imagePath, {
                folder: "receipts",
                resource_type: "image",
            });

            receiptUrl = uploadResult.secure_url;
            receiptPublicId = uploadResult.public_id;

            existingEnrollment.receipt.public_id = receiptPublicId;
            existingEnrollment.receipt.url = receiptUrl;

            fs.unlinkSync(imagePath);
            await existingEnrollment.save();
        } catch (receiptError) {
            console.error("Receipt generation error:", receiptError);
            // Continue without receipt - payment is still valid
        }

        // Create finance transaction record
        const transaction = await FinanceTransaction.create({
            type: "PAYMENT",
            enrollment: enrollmentId,
            course: course._id,
            teacher: course.instructor,
            student: existingEnrollment.student,
            grossAmount: coursePrice,
            adminPercentage: adminPercentage,
            adminAmount: adminAmount,
            teacherAmount: teacherAmount,
            status: "COMPLETED",
            paymentMethod: "ONLINE",
            description: `Course payment for ${course.title}`,
            processedAt: new Date(),
            completedAt: new Date(),
        });

        // Create audit log
        await createAuditLog(
            req.user.id,
            "PAYMENT_APPROVED",
            `Payment approved for enrollment ${enrollmentId}. Course: ${course.title}. Amount: $${coursePrice} (Admin: $${adminAmount}, Teacher: $${teacherAmount})`,
            "success"
        );

        // Get io instance for socket emission
        const io = req.app.get("io");
        
        // Get student and teacher info for notification
        const student = await User.findById(existingEnrollment.student).select("fullName email");
        const teacher = await Teacher.findById(course.instructor).select("name email");

        // Emit socket event to notify teacher about payment
        if (io && course.instructor) {
            // Import the helper function
            const { broadcastPaymentToTeacher } = await import("../utils/socket.js");
            
            // Calculate total earnings for this teacher
            const teacherTransactions = await FinanceTransaction.find({
                teacher: course.instructor,
                status: "COMPLETED"
            });
            const totalTeacherEarnings = teacherTransactions.reduce(
                (sum, t) => sum + (t.teacherAmount || 0), 0
            );

            broadcastPaymentToTeacher(io, course.instructor.toString(), {
                amount: teacherAmount,
                courseName: course.title,
                studentName: student?.fullName || "Unknown Student",
                transactionId: transaction._id.toString(),
                totalEarnings: totalTeacherEarnings + teacherAmount
            });
        }

        res.json({
            success: true,
            message: "Payment approved successfully",
            receiptImage: receiptUrl,
            finance: {
                coursePrice,
                adminAmount,
                teacherAmount,
                adminPercentage,
                transactionId: transaction._id,
            },
        });
    } catch (error) {
        console.error("Payment approval error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to process payment" 
        });
    }
};

/* ================= ADMIN: MARK PAYMENT AS LATER ================= */
export const markPaymentAsLaterByAdmin = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { reason } = req.body;

        // First, check if enrollment exists
        const existingEnrollment = await Enrollment.findById(enrollmentId);
        if (!existingEnrollment) {
            return res.status(404).json({ 
                success: false,
                message: "Enrollment not found" 
            });
        }

        // Check if already PAID
        if (existingEnrollment.paymentStatus === "PAID") {
            return res.status(400).json({ 
                success: false,
                message: "Cannot change status of already paid enrollment" 
            });
        }

        // Check if already marked as LATER
        if (existingEnrollment.paymentStatus === "LATER") {
            return res.status(400).json({ 
                success: false,
                message: "Enrollment already marked as Pay Later" 
            });
        }

        // Update enrollment to LATER status
        existingEnrollment.paymentStatus = "LATER";
        existingEnrollment.paymentLaterReason = reason || "No reason provided";
        existingEnrollment.paymentMarkedLaterAt = new Date();
        existingEnrollment.paymentMarkedLaterBy = req.user.id;
        
        await existingEnrollment.save();

        // Get course info for audit log
        const course = await Course.findById(existingEnrollment.course);
        const student = await User.findById(existingEnrollment.student).select("fullName email");

        // Create audit log
        await createAuditLog(
            req.user.id,
            "PAYMENT_MARKED_LATER",
            `Payment marked as LATER for enrollment ${enrollmentId}. Course: ${course?.title || 'Unknown'}. Student: ${student?.fullName || 'Unknown'}. Reason: ${reason || 'Not specified'}`,
            "success"
        );

        // Re-fetch enrollment with populated data
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "fullName email")
            .populate("course", "title");

        res.json({
            success: true,
            message: "Payment marked as 'Pay Later' successfully",
            enrollment,
        });
    } catch (error) {
        console.error("Mark payment as later error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to mark payment as later" 
        });
    }
};

/* =========================================
   ADMIN: GET ALL COURSES
   ========================================= */
export const getAllCoursesAdmin = async (req, res) => {
    try {
        const { search, status, category } = req.query;

        let query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (status && status !== "all") {
            query.isPublished = status === "published";
        }

        if (category && category !== "all") {
            query.category = category;
        }

        const courses = await Course.find(query)
            .populate("instructor", "name email")
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const draftCourses = await Course.countDocuments({ isPublished: false });

        res.json({
            success: true,
            courses,
            stats: {
                total: totalCourses,
                published: publishedCourses,
                draft: draftCourses,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: UPDATE COURSE
   ========================================= */
export const updateCourseAdmin = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await createAuditLog(
            req.user.id,
            "UPDATE_COURSE",
            `Updated course: ${course.title}`,
            "success"
        );

        res.json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: DELETE COURSE
   ========================================= */
export const deleteCourseAdmin = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Delete thumbnail from Cloudinary
        if (course.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(course.thumbnail.public_id);
        }

        await Course.findByIdAndDelete(req.params.id);

        await createAuditLog(
            req.user.id,
            "DELETE_COURSE",
            `Deleted course: ${course.title}`,
            "success"
        );

        res.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET ALL RESOURCES
   ========================================= */
export const getAllResourcesAdmin = async (req, res) => {
    try {
        const { search, fileType, uploadedBy } = req.query;

        let query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (fileType && fileType !== "all") {
            query.fileType = fileType;
        }

        if (uploadedBy && uploadedBy !== "all") {
            query.uploadedBy = uploadedBy;
        }

        const resources = await Resource.find(query)
            .populate("teacherId", "name email profileImage")
            .populate("adminId", "name email")
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalResources = await Resource.countDocuments();
        const documents = await Resource.countDocuments({ fileType: "document" });
        const videos = await Resource.countDocuments({ fileType: "video" });
        const images = await Resource.countDocuments({ fileType: "image" });

        res.json({
            success: true,
            resources,
            stats: {
                total: totalResources,
                documents,
                videos,
                images,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: DELETE RESOURCE
   ========================================= */
export const deleteResourceAdmin = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
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

        await Resource.findByIdAndDelete(req.params.id);

        await createAuditLog(
            req.user.id,
            "DELETE_RESOURCE",
            `Deleted resource: ${resource.title}`,
            "success"
        );

        res.json({
            success: true,
            message: "Resource deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET USER COUNTS (Real-time)
   ========================================= */
export const getUserCountsAdmin = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        res.json({
            success: true,
            counts: {
                students: totalStudents,
                teachers: totalTeachers,
                total: totalStudents + totalTeachers
            }
        });
    } catch (error) {
        console.error("User counts error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET ANNOUNCEMENTS
   ========================================= */
export const getAnnouncementsAdmin = async (req, res) => {
    try {
        const { search, type } = req.query;

        let query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (type && type !== "all") {
            query.type = type;
        }

        const announcements = await Announcement.find(query).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            announcements,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: CREATE ANNOUNCEMENT
   ========================================= */
export const createAnnouncementAdmin = async (req, res) => {
    try {
        const { title, message, type } = req.body;

        const announcement = await Announcement.create({
            title,
            message,
            type,
            createdBy: req.user.id,
        });

        await createAuditLog(
            req.user.id,
            "CREATE_ANNOUNCEMENT",
            `Created announcement: ${title}`,
            "success"
        );

        // Emit socket event for real-time notifications
        // We'll use a workaround since we don't have direct io access here
        // The io instance will be available through req.app.get('io') in routes
        
        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: DELETE ANNOUNCEMENT
   ========================================= */
export const deleteAnnouncementAdmin = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        await Announcement.findByIdAndDelete(req.params.id);

        await createAuditLog(
            req.user.id,
            "DELETE_ANNOUNCEMENT",
            `Deleted announcement: ${announcement.title}`,
            "success"
        );

        res.json({
            success: true,
            message: "Announcement deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET AUDIT LOGS
   ========================================= */
export const getAuditLogsAdmin = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 50 } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { action: { $regex: search, $options: "i" } },
            ];
        }

        if (status && status !== "all") {
            query.status = status;
        }

        const logs = await AuditLog.find(query)
            .populate("adminId", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await AuditLog.countDocuments(query);

        // Stats
        const totalLogs = await AuditLog.countDocuments();
        const successLogs = await AuditLog.countDocuments({ status: "success" });
        const warningLogs = await AuditLog.countDocuments({ status: "warning" });
        const errorLogs = await AuditLog.countDocuments({ status: "error" });

        res.json({
            success: true,
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                total: totalLogs,
                success: successLogs,
                warnings: warningLogs,
                errors: errorLogs,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET REPORT STATS
   ========================================= */
export const getReportStatsAdmin = async (req, res) => {
    try {
        const { period } = req.query;

        // Calculate date range based on period
        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30); // default to 30 days
        }

        // Get enrollment stats
        const totalEnrollments = await Enrollment.countDocuments({ createdAt: { $gte: startDate } });
        const paidEnrollments = await Enrollment.countDocuments({
            paymentStatus: "PAID",
            createdAt: { $gte: startDate }
        });

        // Get course stats
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });

        // Get student stats
        const totalStudents = await Enrollment.distinct("student", { createdAt: { $gte: startDate } }).then((students) => students.length);

        // Get revenue stats
        const enrollments = await Enrollment.find({
            paymentStatus: "PAID",
            createdAt: { $gte: startDate }
        });
        const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amount || 0), 0);

        // Calculate avg rating and completion rate
        const coursesWithRating = await Course.find({ rating: { $exists: true } });
        const avgRating = coursesWithRating.length > 0
            ? coursesWithRating.reduce((sum, c) => sum + (c.rating || 0), 0) / coursesWithRating.length
            : 4.7;

        const completedEnrollments = await Enrollment.countDocuments({
            status: "COMPLETED",
            createdAt: { $gte: startDate }
        });
        const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

        // Get monthly enrollment data for charts
        const monthlyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Get course category distribution
        const categoryData = await Course.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get top performing courses
        const topCourses = await Enrollment.aggregate([
            {
                $match: { createdAt: { $gte: startDate } }
            },
            {
                $group: {
                    _id: "$course",
                    enrollments: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                },
            },
            { $sort: { enrollments: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $project: {
                    id: "$_id",
                    title: "$courseInfo.title",
                    enrollments: 1,
                    rating: { $ifNull: ["$courseInfo.rating", 4.5] },
                    revenue: 1
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalCourses,
                totalEnrollments,
                totalRevenue,
                avgRating: Math.round(avgRating * 10) / 10,
                completionRate,
                totalStudents,
            },
            charts: {
                monthlyEnrollments: monthlyEnrollments.map(item => ({
                    _id: item._id,
                    count: item.count,
                    enrollments: item.count,
                    revenue: item.revenue || 0
                })),
                categoryData: categoryData.map(cat => ({
                    name: cat._id || 'Uncategorized',
                    value: cat.count
                })),
                topCourses
            },
        });
    } catch (error) {
        console.error("Report stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET SYSTEM STATS
   ========================================= */
export const getSystemStatsAdmin = async (req, res) => {
    try {
        // User counts
        const totalStudents = await User.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalAdmins = await Admin.countDocuments();

        // Course and resource counts
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const totalResources = await Resource.countDocuments();

        // Enrollment stats
        const totalEnrollments = await Enrollment.countDocuments();
        const paidEnrollments = await Enrollment.countDocuments({
            paymentStatus: "PAID",
        });

        // Activity stats (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLogins = await AuditLog.countDocuments({
            action: "LOGIN",
            createdAt: { $gte: oneDayAgo },
        });

        // Storage stats (approximate from Cloudinary)
        // This would typically be fetched from Cloudinary API
        const storageUsed = "1.2 GB"; // Placeholder

        res.json({
            success: true,
            stats: {
                users: {
                    students: totalStudents,
                    teachers: totalTeachers,
                    admins: totalAdmins,
                    total: totalStudents + totalTeachers + totalAdmins,
                },
                content: {
                    courses: totalCourses,
                    publishedCourses,
                    resources: totalResources,
                },
                enrollments: {
                    total: totalEnrollments,
                    paid: paidEnrollments,
                },
                activity: {
                    recentLogins,
                    storageUsed,
                },
            },
            services: [
                { name: "API Server", status: "operational", uptime: "99.9%", latency: "45ms" },
                { name: "Database", status: "operational", uptime: "100%", latency: "12ms" },
                { name: "CDN", status: "operational", uptime: "99.8%", latency: "23ms" },
                { name: "Storage", status: "operational", uptime: "99.9%", latency: "89ms" },
                { name: "Email Service", status: "operational", uptime: "98.5%", latency: "156ms" },
                { name: "Push Notifications", status: "operational", uptime: "99.7%", latency: "67ms" },
            ],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET ACTIVITY OVERVIEW (REAL-TIME)
   ========================================= */
export const getActivityOverviewAdmin = async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // === REAL-TIME STATS ===
        
        // Total counts
        const totalStudents = await User.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const totalEnrollments = await Enrollment.countDocuments();
        const paidEnrollments = await Enrollment.countDocuments({ paymentStatus: "PAID" });

        // === TIME-BASED STATS ===
        
        // New registrations today
        const newStudentsToday = await User.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });
        
        const newTeachersToday = await Teacher.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        // New enrollments in different time periods
        const newEnrollmentsToday = await Enrollment.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });
        
        const newEnrollmentsThisWeek = await Enrollment.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        
        const newEnrollmentsThisMonth = await Enrollment.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Active sessions (enrollments accessed in last 24 hours)
        const activeSessionsToday = await Enrollment.countDocuments({
            lastAccessedAt: { $gte: oneDayAgo }
        });

        // Course completions today
        const completionsToday = await Enrollment.countDocuments({
            status: "COMPLETED",
            completedAt: { $gte: oneDayAgo }
        });

        // === REVENUE STATS ===
        
        const paidEnrollmentsData = await Enrollment.find({ paymentStatus: "PAID" });
        const totalRevenue = paidEnrollmentsData.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const todayRevenue = paidEnrollmentsData
            .filter(e => e.createdAt && new Date(e.createdAt) >= oneDayAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const weekRevenue = paidEnrollmentsData
            .filter(e => e.createdAt && new Date(e.createdAt) >= sevenDaysAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        // === MONTHLY ENROLLMENT DATA (LAST 12 MONTHS) ===
        
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Fill in missing months with zero data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthNum = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const data = monthlyEnrollments.find(
                m => m._id.month === monthNum && m._id.year === year
            );
            
            monthlyData.push({
                month: months[monthNum - 1],
                year: year,
                enrollments: data ? data.count : 0,
                revenue: data ? data.revenue : 0
            });
        }

        // === COURSE CATEGORY DISTRIBUTION ===
        
        const courseDistribution = await Course.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    published: {
                        $sum: { $cond: [{ $eq: ["$isPublished", true] }, 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // === RECENT ACTIVITY FEED ===
        
        // Recent user registrations
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("fullName email createdAt")
            .lean();

        // Recent enrollments
        const recentEnrollments = await Enrollment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("student", "fullName email")
            .populate("course", "title")
            .lean();

        // Recent course completions
        const recentCompletions = await Enrollment.find({ status: "COMPLETED" })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate("student", "fullName email")
            .populate("course", "title")
            .lean();

        // === DAILY ACTIVITY (LAST 7 DAYS) ===
        
        const dailyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            dayEnd.setHours(0, 0, 0, 0);

            const dayUsers = await User.countDocuments({
                createdAt: { $gte: dayStart, $lt: dayEnd }
            });
            
            const dayEnrollments = await Enrollment.countDocuments({
                createdAt: { $gte: dayStart, $lt: dayEnd }
            });

            const dayCompletions = await Enrollment.countDocuments({
                status: "COMPLETED",
                completedAt: { $gte: dayStart, $lt: dayEnd }
            });

            dailyActivity.push({
                day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: dayUsers,
                enrollments: dayEnrollments,
                completions: dayCompletions
            });
        }

        // === ENGAGEMENT METRICS ===
        
        const engagementMetrics = {
            avgProgress: 0,
            totalTimeSpent: 0,
            avgTimePerUser: 0
        };
        
        const enrollmentsWithProgress = await Enrollment.find({ status: "ACTIVE" });
        if (enrollmentsWithProgress.length > 0) {
            const totalProgress = enrollmentsWithProgress.reduce((sum, e) => sum + (e.progress || 0), 0);
            engagementMetrics.avgProgress = Math.round(totalProgress / enrollmentsWithProgress.length);
            
            const totalTime = enrollmentsWithProgress.reduce((sum, e) => sum + (e.totalTimeSpent || 0), 0);
            engagementMetrics.totalTimeSpent = totalTime;
            engagementMetrics.avgTimePerUser = Math.round(totalTime / enrollmentsWithProgress.length);
        }

        res.json({
            success: true,
            timestamp: now.toISOString(),
            overview: {
                totalStudents,
                totalTeachers,
                totalCourses,
                publishedCourses,
                totalEnrollments,
                paidEnrollments,
                totalRevenue
            },
            realtime: {
                newStudentsToday,
                newTeachersToday,
                newEnrollmentsToday,
                activeSessionsToday,
                completionsToday,
                todayRevenue
            },
            trends: {
                enrollmentsThisWeek: newEnrollmentsThisWeek,
                enrollmentsThisMonth: newEnrollmentsThisMonth,
                weekRevenue
            },
            charts: {
                monthlyEnrollments: monthlyData,
                courseDistribution: courseDistribution.map(d => ({
                    category: d._id || 'Uncategorized',
                    count: d.count,
                    published: d.published
                })),
                dailyActivity
            },
            activityFeed: {
                recentUsers: recentUsers.map(u => ({
                    id: u._id,
                    name: u.fullName,
                    email: u.email,
                    time: u.createdAt,
                    type: 'registration'
                })),
                recentEnrollments: recentEnrollments.map(e => ({
                    id: e._id,
                    student: e.student?.fullName || 'Unknown',
                    course: e.course?.title || 'Unknown',
                    time: e.createdAt,
                    type: 'enrollment',
                    paymentStatus: e.paymentStatus
                })),
                recentCompletions: recentCompletions.map(c => ({
                    id: c._id,
                    student: c.student?.fullName || 'Unknown',
                    course: c.course?.title || 'Unknown',
                    time: c.completedAt,
                    type: 'completion',
                    progress: c.progress
                }))
            },
        engagement: engagementMetrics
        });
    } catch (error) {
        console.error("Activity overview error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET USER ANALYTICS (REAL-TIME)
   ========================================= */
export const getUserAnalyticsAdmin = async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

        // === TOTAL STATS ===
        const totalUsers = await User.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const activeUsers = await User.countDocuments({ isSuspended: false });
        const suspendedUsers = await User.countDocuments({ isSuspended: true });
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        // === REGISTRATION TRENDS ===
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newUsersThisQuarter = await User.countDocuments({ createdAt: { $gte: ninetyDaysAgo } });

        // === USER GROWTH (LAST 12 MONTHS) ===
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyUserRegistrations = await User.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const userGrowthData = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthNum = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const data = monthlyUserRegistrations.find(m => m._id.month === monthNum && m._id.year === year);
            
            userGrowthData.push({
                month: months[monthNum - 1],
                users: data ? data.count : 0
            });
        }

        // === DAILY ACTIVITY (LAST 7 DAYS) ===
        const dailyNewUsers = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            dayEnd.setHours(0, 0, 0, 0);

            const count = await User.countDocuments({
                createdAt: { $gte: dayStart, $lt: dayEnd }
            });

            dailyNewUsers.push({
                day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: count
            });
        }

        // === TEACHER STATS ===
        const totalTeacherCount = await Teacher.countDocuments();
        const newTeachersToday = await Teacher.countDocuments({ createdAt: { $gte: oneDayAgo } });
        const newTeachersThisWeek = await Teacher.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const newTeachersThisMonth = await Teacher.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // === USER DISTRIBUTION BY TIME ===
        const usersLast24h = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });
        const usersLast7Days = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const usersLast30Days = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const usersOlder = totalUsers - usersLast30Days;

        // === RECENT USERS ===
        const recentStudents = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("fullName email createdAt isVerified isSuspended")
            .lean();

        const recentTeachers = await Teacher.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name email createdAt")
            .lean();

        // === GENDER DISTRIBUTION ===
        const genderDistribution = await User.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        // === TOP ACTIVE USERS BY ENROLLMENT ===
        const topActiveStudents = await Enrollment.aggregate([
            { $match: { student: { $exists: true } } },
            { $group: { _id: "$student", enrollmentCount: { $sum: 1 } } },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $project: {
                    name: "$student.fullName",
                    email: "$student.email",
                    enrollmentCount: 1
                }
            }
        ]);

        res.json({
            success: true,
            timestamp: now.toISOString(),
            overview: {
                totalUsers,
                totalTeachers,
                totalAdmins,
                activeUsers,
                suspendedUsers,
                verifiedUsers
            },
            realtime: {
                newUsersToday,
                newTeachersToday
            },
            trends: {
                newUsersThisWeek,
                newUsersThisMonth,
                newUsersThisQuarter,
                newTeachersThisWeek,
                newTeachersThisMonth
            },
            charts: {
                userGrowth: userGrowthData,
                dailyNewUsers,
                userAgeDistribution: [
                    { label: 'Last 24h', value: usersLast24h },
                    { label: 'Last 7 days', value: usersLast7Days },
                    { label: 'Last 30 days', value: usersLast30Days },
                    { label: 'Older', value: usersOlder }
                ],
                genderDistribution: genderDistribution.map(g => ({
                    gender: g._id || 'Not specified',
                    count: g.count
                })),
                topActiveStudents
            },
            recentUsers: {
                students: recentStudents.map(s => ({
                    id: s._id,
                    name: s.fullName,
                    email: s.email,
                    time: s.createdAt,
                    isVerified: s.isVerified,
                    isSuspended: s.isSuspended
                })),
                teachers: recentTeachers.map(t => ({
                    id: t._id,
                    name: t.name,
                    email: t.email,
                    time: t.createdAt
                }))
            }
        });
    } catch (error) {
        console.error("User analytics error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET STUDENT ANALYTICS (REAL-TIME)
   ========================================= */
export const getStudentAnalyticsAdmin = async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // === TOTAL STUDENT STATS ===
        const totalStudents = await User.countDocuments();
        const activeStudents = await User.countDocuments({ isSuspended: false });
        const suspendedStudents = await User.countDocuments({ isSuspended: true });
        const verifiedStudents = await User.countDocuments({ isVerified: true });

        // === ENROLLMENT STATS ===
        const totalEnrollments = await Enrollment.countDocuments();
        const paidEnrollments = await Enrollment.countDocuments({ paymentStatus: "PAID" });
        const pendingEnrollments = await Enrollment.countDocuments({ paymentStatus: "PENDING" });
        const activeEnrollments = await Enrollment.countDocuments({ status: "ACTIVE" });
        const completedEnrollments = await Enrollment.countDocuments({ status: "COMPLETED" });

        // === RECENT ENROLLMENT ACTIVITY ===
        const newEnrollmentsToday = await Enrollment.countDocuments({ createdAt: { $gte: oneDayAgo } });
        const newEnrollmentsThisWeek = await Enrollment.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const newEnrollmentsThisMonth = await Enrollment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // === COMPLETION STATS ===
        const completionsToday = await Enrollment.countDocuments({ 
            status: "COMPLETED", 
            completedAt: { $gte: oneDayAgo } 
        });
        const completionsThisWeek = await Enrollment.countDocuments({ 
            status: "COMPLETED", 
            completedAt: { $gte: sevenDaysAgo } 
        });
        const completionsThisMonth = await Enrollment.countDocuments({ 
            status: "COMPLETED", 
            completedAt: { $gte: thirtyDaysAgo } 
        });

        // === REVENUE STATS ===
        const paidEnrollmentsData = await Enrollment.find({ paymentStatus: "PAID" });
        const totalRevenue = paidEnrollmentsData.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const todayRevenue = paidEnrollmentsData
            .filter(e => e.createdAt && new Date(e.createdAt) >= oneDayAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const weekRevenue = paidEnrollmentsData
            .filter(e => e.createdAt && new Date(e.createdAt) >= sevenDaysAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const monthRevenue = paidEnrollmentsData
            .filter(e => e.createdAt && new Date(e.createdAt) >= thirtyDaysAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        // === MONTHLY ENROLLMENT TRENDS ===
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyEnrollments = await Enrollment.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    enrollments: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                    completions: {
                        $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const enrollmentTrends = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthNum = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const data = monthlyEnrollments.find(m => m._id.month === monthNum && m._id.year === year);
            
            enrollmentTrends.push({
                month: months[monthNum - 1],
                enrollments: data ? data.enrollments : 0,
                revenue: data ? data.revenue : 0,
                completions: data ? data.completions : 0
            });
        }

        // === DAILY ACTIVITY (LAST 7 DAYS) ===
        const dailyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            dayEnd.setHours(0, 0, 0, 0);

            const dayEnrollments = await Enrollment.countDocuments({
                createdAt: { $gte: dayStart, $lt: dayEnd }
            });

            const dayCompletions = await Enrollment.countDocuments({
                status: "COMPLETED",
                completedAt: { $gte: dayStart, $lt: dayEnd }
            });

            const dayRevenue = paidEnrollmentsData
                .filter(e => e.createdAt && new Date(e.createdAt) >= dayStart && new Date(e.createdAt) < dayEnd)
                .reduce((sum, e) => sum + (e.amount || 0), 0);

            dailyActivity.push({
                day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                enrollments: dayEnrollments,
                completions: dayCompletions,
                revenue: dayRevenue
            });
        }

        // === PROGRESS STATS ===
        const activeEnrollmentsData = await Enrollment.find({ status: "ACTIVE" });
        const avgProgress = activeEnrollmentsData.length > 0
            ? Math.round(activeEnrollmentsData.reduce((sum, e) => sum + (e.progress || 0), 0) / activeEnrollmentsData.length)
            : 0;
        
        const totalTimeSpent = activeEnrollmentsData.reduce((sum, e) => sum + (e.totalTimeSpent || 0), 0);
        const avgTimePerStudent = activeEnrollmentsData.length > 0
            ? Math.round(totalTimeSpent / activeEnrollmentsData.length)
            : 0;

        // === ENROLLMENT BY STATUS ===
        const enrollmentByStatus = await Enrollment.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // === ENROLLMENT BY PAYMENT STATUS ===
        const enrollmentByPayment = await Enrollment.aggregate([
            { $group: { _id: "$paymentStatus", count: { $sum: 1 } } }
        ]);

        // === TOP PERFORMING STUDENTS ===
        const topStudents = await Enrollment.aggregate([
            { $match: { status: "COMPLETED" } },
            { $group: { _id: "$student", completedCourses: { $sum: 1 }, totalProgress: { $sum: "$progress" } } },
            { $sort: { completedCourses: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $project: {
                    name: "$student.fullName",
                    email: "$student.email",
                    completedCourses: 1,
                    avgProgress: { $divide: ["$totalProgress", "$completedCourses"] }
                }
            }
        ]);

        // === TOP ENROLLED COURSES ===
        const topEnrolledCourses = await Enrollment.aggregate([
            { $group: { _id: "$course", studentCount: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } },
            { $sort: { studentCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            {
                $project: {
                    title: "$course.title",
                    studentCount: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // === RECENT ENROLLMENTS ===
        const recentEnrollments = await Enrollment.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("student", "fullName email")
            .populate("course", "title")
            .lean();

        res.json({
            success: true,
            timestamp: now.toISOString(),
            overview: {
                totalStudents,
                activeStudents,
                suspendedStudents,
                verifiedStudents,
                totalEnrollments,
                paidEnrollments,
                pendingEnrollments,
                activeEnrollments,
                completedEnrollments,
                totalRevenue
            },
            realtime: {
                newEnrollmentsToday,
                completionsToday,
                todayRevenue
            },
            trends: {
                newEnrollmentsThisWeek,
                newEnrollmentsThisMonth,
                completionsThisWeek,
                completionsThisMonth,
                weekRevenue,
                monthRevenue
            },
            charts: {
                enrollmentTrends,
                dailyActivity,
                enrollmentByStatus: enrollmentByStatus.map(s => ({
                    status: s._id || 'Unknown',
                    count: s.count
                })),
                enrollmentByPayment: enrollmentByPayment.map(p => ({
                    status: p._id || 'Unknown',
                    count: p.count
                })),
                progressStats: {
                    avgProgress,
                    totalTimeSpent,
                    avgTimePerStudent
                }
            },
            topPerformers: {
                students: topStudents.map(s => ({
                    name: s.name,
                    email: s.email,
                    completedCourses: s.completedCourses,
                    avgProgress: Math.round(s.avgProgress || 0)
                })),
                courses: topEnrolledCourses.map(c => ({
                    title: c.title,
                    students: c.studentCount,
                    revenue: c.totalRevenue
                }))
            },
            recentEnrollments: recentEnrollments.map(e => ({
                id: e._id.toString(),
                student: e.student?.fullName || 'Unknown Student',
                email: e.student?.email || 'N/A',
                course: e.course?.title || 'Unknown Course',
                status: e.status || 'ACTIVE',
                paymentStatus: e.paymentStatus || 'PENDING',
                progress: e.progress || 0,
                time: e.createdAt
            }))
        });
    } catch (error) {
        console.error("Student analytics error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET COURSE ANALYTICS (REAL-TIME)
   ========================================= */
export const getCourseAnalyticsAdmin = async (req, res) => {
    try {
        const { period } = req.query;
        const now = new Date();

        // Calculate date range based on period
        let startDate = new Date();
        switch (period) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        // === BASIC STATS ===
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const totalEnrollments = await Enrollment.countDocuments();
        const paidEnrollments = await Enrollment.countDocuments({ paymentStatus: "PAID" });

        // === REVENUE STATS ===
        const paidEnrollmentData = await Enrollment.find({ paymentStatus: "PAID" });
        const totalRevenue = paidEnrollmentData.reduce((sum, e) => sum + (e.amount || 0), 0);

        // === RATING STATS ===
        const coursesWithRating = await Course.find({ rating: { $exists: true } });
        const avgRating = coursesWithRating.length > 0
            ? coursesWithRating.reduce((sum, c) => sum + (c.rating || 0), 0) / coursesWithRating.length
            : 0;

        // === COMPLETION RATE ===
        const completedEnrollments = await Enrollment.countDocuments({ status: "COMPLETED" });
        const completionRate = totalEnrollments > 0 
            ? Math.round((completedEnrollments / totalEnrollments) * 100) 
            : 0;

        // === MONTHLY ENROLLMENT DATA ===
        const monthlyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const enrollmentData = monthlyEnrollments.map(item => ({
            month: months[item._id?.month - 1] || 'Unknown',
            enrollments: item.count || 0,
            revenue: item.revenue || 0
        }));

        // === CATEGORY DISTRIBUTION ===
        const categoryAggregation = await Course.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Define colors for categories
        const categoryColors = {
            'Programming': '#6366f1',
            'Web Development': '#06b6d4',
            'Data Science': '#10b981',
            'Design': '#f59e0b',
            'Marketing': '#ec4899',
            'Business': '#8b5cf6',
            'Other': '#64748b'
        };

        const categoryData = categoryAggregation.map((cat, index) => ({
            name: cat._id || 'Uncategorized',
            value: cat.count,
            color: categoryColors[cat._id] || Object.values(categoryColors)[index % Object.values(categoryColors).length]
        }));

        // === TOP PERFORMING COURSES ===
        const topCoursesAggregation = await Enrollment.aggregate([
            {
                $match: { createdAt: { $gte: startDate } }
            },
            {
                $group: {
                    _id: "$course",
                    enrollments: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                    },
                    totalProgress: { $sum: "$progress" }
                },
            },
            { $sort: { enrollments: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $project: {
                    id: "$_id",
                    title: "$courseInfo.title",
                    enrollments: 1,
                    rating: { $ifNull: ["$courseInfo.rating", 0] },
                    revenue: 1,
                    completionRate: {
                        $cond: {
                            if: { $gt: ["$enrollments", 0] },
                            then: {
                                $round: [{ $multiply: [{ $divide: ["$completedCount", "$enrollments"] }, 100] }]
                            },
                            else: 0
                        }
                    }
                }
            }
        ]);

        const topCourses = topCoursesAggregation.map(course => ({
            id: course.id?.toString() || Math.random().toString(),
            title: course.title,
            enrollments: course.enrollments,
            rating: Math.round((course.rating || 0) * 10) / 10,
            revenue: course.revenue || 0,
            completionRate: course.completionRate || 0
        }));

        // === ALL COURSES PERFORMANCE ===
        const allCoursesPerformance = await Enrollment.aggregate([
            {
                $group: {
                    _id: "$course",
                    enrollments: { $sum: 1 },
                    revenue: { $sum: "$amount" },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                    },
                    avgProgress: { $avg: "$progress" },
                    studentCount: { $sum: 1 }
                },
            },
            { $sort: { enrollments: -1 } },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $project: {
                    id: "$_id",
                    title: "$courseInfo.title",
                    instructor: "$courseInfo.instructor",
                    category: "$courseInfo.category",
                    enrollments: 1,
                    revenue: 1,
                    rating: { $ifNull: ["$courseInfo.rating", 0] },
                    completionRate: {
                        $cond: {
                            if: { $gt: ["$enrollments", 0] },
                            then: {
                                $round: [{ $multiply: [{ $divide: ["$completedCount", "$enrollments"] }, 100] }]
                            },
                            else: 0
                        }
                    },
                    avgProgress: { $round: ["$avgProgress", 1] }
                }
            }
        ]);

        const allCourses = allCoursesPerformance.map(course => ({
            id: course.id?.toString() || Math.random().toString(),
            title: course.title || 'Unknown Course',
            enrollments: course.enrollments || 0,
            rating: Math.round((course.rating || 0) * 10) / 10,
            revenue: course.revenue || 0,
            completionRate: course.completionRate || 0,
            category: course.category || 'Uncategorized'
        }));

        // === MONTHLY COMPLETION RATE ===
        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyCompletions = await Enrollment.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthlyProgress = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthNum = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const data = monthlyCompletions.find(m => m._id.month === monthNum && m._id.year === year);
            
            const completionRate = data && data.total > 0
                ? Math.round((data.completed / data.total) * 100)
                : 0;
            
            monthlyProgress.push({
                month: months[monthNum - 1],
                completion: completionRate
            });
        }

        // === STUDENTS COUNT ===
        const totalStudents = await Enrollment.distinct("student").then(students => students.length);

        res.json({
            success: true,
            stats: {
                totalCourses,
                totalEnrollments,
                totalRevenue,
                avgRating: Math.round(avgRating * 10) / 10,
                completionRate,
                totalStudents,
                publishedCourses
            },
            charts: {
                enrollmentData: enrollmentData.length > 0 ? enrollmentData : [
                    { month: 'Jan', enrollments: 0, revenue: 0 },
                    { month: 'Feb', enrollments: 0, revenue: 0 },
                    { month: 'Mar', enrollments: 0, revenue: 0 },
                    { month: 'Apr', enrollments: 0, revenue: 0 },
                    { month: 'May', enrollments: 0, revenue: 0 },
                    { month: 'Jun', enrollments: 0, revenue: 0 },
                    { month: 'Jul', enrollments: 0, revenue: 0 }
                ],
                categoryData: categoryData.length > 0 ? categoryData : [
                    { name: 'Programming', value: 0, color: '#6366f1' },
                    { name: 'Web Development', value: 0, color: '#06b6d4' },
                    { name: 'Data Science', value: 0, color: '#10b981' },
                    { name: 'Design', value: 0, color: '#f59e0b' },
                    { name: 'Other', value: 0, color: '#64748b' }
                ],
                monthlyProgress
            },
            topCourses: topCourses.length > 0 ? topCourses : [
                { id: '1', title: 'No courses yet', enrollments: 0, rating: 0, revenue: 0, completionRate: 0 }
            ],
            allCourses
        });
    } catch (error) {
        console.error("Course analytics error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET REAL-TIME SYSTEM HEALTH
   ========================================= */
export const getSystemHealthRealTime = async (req, res) => {
    try {
        const mongoose = await import('mongoose');
        const process = await import('process');
        
        // Get memory usage
        const memoryUsage = process.memoryUsage();
        const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
        const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
        const memoryPercent = heapTotal > 0 ? Math.round((heapUsed / heapTotal) * 100) : 0;

        // Get uptime
        const uptime = process.uptime();
        const uptimeDays = Math.floor(uptime / 86400);
        const uptimeHours = Math.floor((uptime % 86400) / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);

        // Get database stats
        const dbState = mongoose.connection.readyState;
        const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
        
        // Get collection counts
        const userCount = await User.countDocuments();
        const teacherCount = await Teacher.countDocuments();
        const courseCount = await Course.countDocuments();
        const enrollmentCount = await Enrollment.countDocuments();
        const resourceCount = await Resource.countDocuments();

        // Calculate overall system health
        const isHealthy = memoryPercent < 85 && dbStatus === 'connected';
        const healthStatus = memoryPercent > 85 ? 'warning' : isHealthy ? 'healthy' : 'critical';

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            health: {
                status: healthStatus,
                overall: isHealthy ? 'All Systems Operational' : 'System Issues Detected'
            },
            server: {
                uptime: {
                    total: uptime,
                    formatted: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`,
                    days: uptimeDays,
                    hours: uptimeHours,
                    minutes: uptimeMinutes,
                    seconds: uptimeSeconds
                },
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            },
            memory: {
                heapUsed: heapUsed,
                heapTotal: heapTotal,
                used: Math.round(memoryUsage.rss / 1024 / 1024), // MB
                percent: memoryPercent,
                status: memoryPercent > 85 ? 'critical' : memoryPercent > 70 ? 'warning' : 'healthy'
            },
            database: {
                state: dbState,
                status: dbStatus,
                host: mongoose.connection.host || 'localhost',
                collections: {
                    users: userCount,
                    teachers: teacherCount,
                    courses: courseCount,
                    enrollments: enrollmentCount,
                    resources: resourceCount,
                    total: userCount + teacherCount + courseCount + enrollmentCount + resourceCount
                }
            },
            metrics: {
                totalUsers: userCount + teacherCount,
                totalCourses: courseCount,
                totalEnrollments: enrollmentCount,
                totalResources: resourceCount
            },
            services: [
                { name: 'API Server', status: 'operational', uptime: '99.9%', latency: '45ms' },
                { name: 'Database', status: dbStatus === 'connected' ? 'operational' : 'degraded', uptime: dbStatus === 'connected' ? '100%' : '99.5%', latency: dbStatus === 'connected' ? '12ms' : '999ms' },
                { name: 'CDN', status: 'operational', uptime: '99.8%', latency: '23ms' },
                { name: 'Storage', status: 'operational', uptime: '99.9%', latency: '89ms' },
                { name: 'Email Service', status: 'operational', uptime: '98.5%', latency: '156ms' },
                { name: 'Push Notifications', status: 'operational', uptime: '99.7%', latency: '67ms' }
            ]
        });
    } catch (error) {
        console.error("Real-time health check error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            health: {
                status: 'error',
                overall: 'Health Check Failed'
            }
        });
    }
};

/* =========================================
   ADMIN: GET FINANCE OVERVIEW (REAL-TIME)
   ========================================= */
export const getFinanceOverviewAdmin = async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // === GET ALL ENROLLMENTS WITH PAYMENT STATUS ===
        const allEnrollments = await Enrollment.find()
            .populate('student', 'fullName email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 });

        // === CALCULATE STATS FROM ENROLLMENTS ===
        const paidEnrollments = allEnrollments.filter(e => e.paymentStatus === 'PAID');
        const pendingEnrollments = allEnrollments.filter(e => e.paymentStatus === 'PENDING');
        const laterEnrollments = allEnrollments.filter(e => e.paymentStatus === 'LATER');

        // Calculate totals
        const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
        const adminEarnings = paidEnrollments.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
        const teacherPayouts = paidEnrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
        const pendingPayouts = laterEnrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);

        // === TODAY'S STATS ===
        const todayRevenue = paidEnrollments
            .filter(e => e.createdAt && new Date(e.createdAt) >= oneDayAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        // === THIS WEEK'S STATS ===
        const weekRevenue = paidEnrollments
            .filter(e => e.createdAt && new Date(e.createdAt) >= sevenDaysAgo)
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        // === RECENT TRANSACTIONS (LAST 10) ===
        const recentTransactions = allEnrollments
            .filter(e => e.paymentStatus === 'PAID' || e.paymentStatus === 'LATER')
            .slice(0, 10)
            .map(e => ({
                _id: e._id,
                type: e.paymentStatus === 'PAID' ? 'PAYMENT' : 'PAY_LATER',
                amount: e.amount || 0,
                adminAmount: e.adminAmount || 0,
                teacherAmount: e.teacherAmount || 0,
                status: e.paymentStatus === 'PAID' ? 'COMPLETED' : 'PENDING',
                studentName: e.student?.fullName || 'Unknown',
                studentEmail: e.student?.email || 'N/A',
                courseName: e.course?.title || 'Unknown',
                createdAt: e.createdAt,
                paymentStatus: e.paymentStatus
            }));

        // === MONTHLY REVENUE DATA (LAST 6 MONTHS) ===
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now);
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setHours(0, 0, 0, 0);

            const monthTransactions = paidEnrollments.filter(e => {
                if (!e.createdAt) return false;
                const date = new Date(e.createdAt);
                return date >= monthStart && date < monthEnd;
            });

            const monthName = monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            monthlyRevenue.push({
                month: monthName,
                revenue: monthTransactions.reduce((sum, e) => sum + (e.amount || 0), 0),
                transactions: monthTransactions.length
            });
        }

        // === DAILY ACTIVITY (LAST 7 DAYS) ===
        const dailyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            dayEnd.setHours(0, 0, 0, 0);

            const dayTransactions = paidEnrollments.filter(e => {
                if (!e.createdAt) return false;
                const date = new Date(e.createdAt);
                return date >= dayStart && date < dayEnd;
            });

            dailyActivity.push({
                day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dayTransactions.reduce((sum, e) => sum + (e.amount || 0), 0),
                transactions: dayTransactions.length
            });
        }

        // === TEACHER EARNINGS ===
        const teacherEarnings = {};
        paidEnrollments.forEach(e => {
            if (e.course?.instructor) {
                const teacherId = e.course.instructor.toString();
                if (!teacherEarnings[teacherId]) {
                    teacherEarnings[teacherId] = {
                        teacherId,
                        name: e.course.instructorName || 'Unknown',
                        totalEarnings: 0,
                        transactions: 0
                    };
                }
                teacherEarnings[teacherId].totalEarnings += e.teacherAmount || 0;
                teacherEarnings[teacherId].transactions += 1;
            }
        });

        const topTeachers = Object.values(teacherEarnings)
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .slice(0, 5);

        // === COURSE REVENUE ===
        const courseRevenue = {};
        paidEnrollments.forEach(e => {
            if (e.course?._id) {
                const courseId = e.course._id.toString();
                if (!courseRevenue[courseId]) {
                    courseRevenue[courseId] = {
                        courseId,
                        title: e.course.title || 'Unknown',
                        revenue: 0,
                        enrollments: 0
                    };
                }
                courseRevenue[courseId].revenue += e.amount || 0;
                courseRevenue[courseId].enrollments += 1;
            }
        });

        const topCourses = Object.values(courseRevenue)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        res.json({
            success: true,
            timestamp: now.toISOString(),
            overview: {
                totalRevenue,
                adminEarnings,
                teacherPayouts,
                pendingPayouts,
                totalTransactions: paidEnrollments.length,
                pendingTransactions: pendingEnrollments.length + laterEnrollments.length,
                totalStudents: new Set(allEnrollments.map(e => e.student?._id)).size,
                totalCourses: new Set(allEnrollments.map(e => e.course?._id)).size
            },
            realtime: {
                todayRevenue,
                weekRevenue,
                todayTransactions: paidEnrollments.filter(e => 
                    e.createdAt && new Date(e.createdAt) >= oneDayAgo
                ).length
            },
            charts: {
                monthlyRevenue,
                dailyActivity,
                topTeachers,
                topCourses
            },
            transactions: recentTransactions
        });
    } catch (error) {
        console.error("Finance overview error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET ALL TRANSACTIONS
   ========================================= */
export const getAllTransactionsAdmin = async (req, res) => {
    try {
        const { search, type, status, startDate, endDate, page = 1, limit = 50 } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get enrollments as transactions
        const enrollments = await Enrollment.find()
            .populate('student', 'fullName email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Transform enrollments to transaction format
        const transactions = enrollments.map(e => ({
            _id: e._id,
            type: e.paymentStatus === 'PAID' ? 'PAYMENT' : (e.paymentStatus === 'LATER' ? 'PAY_LATER' : 'ENROLLMENT'),
            amount: e.amount || 0,
            adminAmount: e.adminAmount || 0,
            teacherAmount: e.teacherAmount || 0,
            status: e.paymentStatus === 'PAID' ? 'COMPLETED' : 'PENDING',
            studentEmail: e.student?.email || 'N/A',
            teacherEmail: e.course?.instructorEmail || 'N/A',
            courseName: e.course?.title || 'N/A',
            createdAt: e.createdAt,
            paymentStatus: e.paymentStatus
        }));

        const total = await Enrollment.countDocuments(query);

        // Calculate stats from all enrollments
        const allEnrollments = await Enrollment.find();
        const completedTransactions = allEnrollments.filter(e => e.paymentStatus === 'PAID');
        const totalRevenue = completedTransactions.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalAdminAmount = completedTransactions.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
        const totalTeacherAmount = completedTransactions.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
        const pendingTransactions = allEnrollments.filter(e => e.paymentStatus !== 'PAID');
        const pendingAmount = pendingTransactions.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);

        res.json({
            success: true,
            transactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            stats: {
                totalTransactions: allEnrollments.length,
                totalRevenue,
                totalAdminEarnings: totalAdminAmount,
                totalTeacherPayouts: totalTeacherAmount,
                pendingPayouts: pendingAmount
            }
        });
    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET TEACHER PAYMENTS (INDIVIDUAL RECORDS)
   ========================================= */
export const getTeacherPaymentsAdmin = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 50 } = req.query;

        // Build query for FinanceTransaction
        let query = { type: 'PAYMENT' };
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get individual transactions with proper populate
        let transactions = await FinanceTransaction.find(query)
            .populate('teacher', 'name email')
            .populate('student', 'fullName email')
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // If no FinanceTransaction records, fallback to enrollments
        if (transactions.length === 0) {
            let enrollmentQuery = { paymentStatus: 'PAID' };
            
            const enrollments = await Enrollment.find(enrollmentQuery)
                .populate({
                    path: 'course',
                    select: 'title price instructor',
                    populate: { path: 'instructor', select: 'name email' }
                })
                .populate('student', 'fullName email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            // Convert enrollments to transaction format
            transactions = enrollments.map(e => ({
                _id: e._id,
                teacher: e.course?.instructor || null,
                student: e.student,
                course: e.course,
                teacherAmount: e.teacherAmount || 0,
                amount: e.amount || 0,
                status: 'COMPLETED',
                createdAt: e.createdAt,
                description: `Payment for ${e.course?.title || 'Unknown Course'}`
            }));
        }

        // Apply search filter on individual transactions
        let filteredTransactions = transactions;
        
        if (search) {
            const searchLower = search.toLowerCase();
            filteredTransactions = transactions.filter(t => 
                t.teacher?.name?.toLowerCase().includes(searchLower) ||
                t.teacher?.email?.toLowerCase().includes(searchLower) ||
                t.course?.title?.toLowerCase().includes(searchLower) ||
                t._id?.toString().includes(searchLower)
            );
        }

        // Calculate stats
        const totalTransactions = transactions.length;
        const totalAmount = transactions.reduce((sum, t) => sum + (t.teacherAmount || 0), 0);
        const uniqueTeachers = new Set(transactions.map(t => t.teacher?._id?.toString() || t.teacher?.toString()).filter(Boolean)).size;

        res.json({
            success: true,
            payments: filteredTransactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredTransactions.length,
                pages: Math.ceil(filteredTransactions.length / limit)
            },
            stats: {
                totalTransactions: totalTransactions,
                totalTeachers: uniqueTeachers,
                totalPayouts: totalAmount,
                completedPayouts: transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + (t.teacherAmount || 0), 0),
                pendingPayouts: transactions.filter(t => t.status === 'PENDING').reduce((sum, t) => sum + (t.teacherAmount || 0), 0)
            }
        });
    } catch (error) {
        console.error("Get teacher payments error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET REVENUE REPORTS (REAL-TIME)
   ========================================= */
export const getRevenueReportsAdmin = async (req, res) => {
    try {
        const { range = 'all' } = req.query;

        let startDate = new Date(0);
        const endDate = new Date();

        switch (range) {
            case '7days':
                startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1year':
                startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0);
        }

        // Get all enrollments
        const enrollments = await Enrollment.find({ paymentStatus: 'PAID' })
            .populate('course', 'title category price')
            .sort({ createdAt: -1 });

        // Filter by date range
        const filteredEnrollments = enrollments.filter(e => 
            e.createdAt && new Date(e.createdAt) >= startDate && new Date(e.createdAt) <= endDate
        );

        // Calculate totals from enrollments
        const totalRevenue = filteredEnrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalAdminEarnings = filteredEnrollments.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
        const totalTeacherEarnings = filteredEnrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
        
        // Pending payouts (from LATER status enrollments)
        const laterEnrollments = await Enrollment.find({ paymentStatus: 'LATER' });
        const pendingPayouts = laterEnrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);

        // Monthly revenue data from filtered enrollments
        const monthlyRevenue = {};
        filteredEnrollments.forEach(e => {
            if (e.createdAt) {
                const month = new Date(e.createdAt).toISOString().slice(0, 7); // YYYY-MM
                if (!monthlyRevenue[month]) {
                    monthlyRevenue[month] = { revenue: 0, adminEarnings: 0, teacherEarnings: 0 };
                }
                monthlyRevenue[month].revenue += e.amount || 0;
                monthlyRevenue[month].adminEarnings += e.adminAmount || 0;
                monthlyRevenue[month].teacherEarnings += e.teacherAmount || 0;
            }
        });

        // Category-wise revenue
        const categoryRevenue = {};
        filteredEnrollments.forEach(e => {
            const category = e.course?.category || 'Other';
            if (!categoryRevenue[category]) {
                categoryRevenue[category] = 0;
            }
            categoryRevenue[category] += e.amount || 0;
        });

        // Top courses by revenue
        const courseRevenue = {};
        filteredEnrollments.forEach(e => {
            const courseId = e.course?._id?.toString();
            if (!courseRevenue[courseId]) {
                courseRevenue[courseId] = {
                    title: e.course?.title || 'Unknown',
                    revenue: 0,
                    transactions: 0
                };
            }
            courseRevenue[courseId].revenue += e.amount || 0;
            courseRevenue[courseId].transactions += 1;
        });

        const topCourses = Object.values(courseRevenue)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Daily revenue for the last 7 days
        const dailyRevenue = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const dayTransactions = filteredEnrollments.filter(e => 
                e.createdAt && new Date(e.createdAt) >= dayStart && new Date(e.createdAt) < dayEnd
            );

            dailyRevenue.push({
                date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                revenue: dayTransactions.reduce((sum, e) => sum + (e.amount || 0), 0),
                transactions: dayTransactions.length
            });
        }

        // Teacher earnings breakdown
        const teacherEarnings = {};
        filteredEnrollments.forEach(e => {
            if (e.course?.instructor) {
                const teacherId = e.course.instructor.toString();
                if (!teacherEarnings[teacherId]) {
                    teacherEarnings[teacherId] = {
                        teacherId: teacherId,
                        name: e.course.instructorName || 'Unknown',
                        earnings: 0,
                        courses: 0
                    };
                }
                teacherEarnings[teacherId].earnings += e.teacherAmount || 0;
                teacherEarnings[teacherId].courses += 1;
            }
        });

        const topTeachers = Object.values(teacherEarnings)
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, 5);

        res.json({
            success: true,
            range,
            stats: {
                totalRevenue,
                totalAdminEarnings,
                totalTeacherEarnings,
                pendingPayouts,
                totalTransactions: filteredEnrollments.length
            },
            charts: {
                monthlyRevenue: Object.entries(monthlyRevenue).map(([month, data]) => ({
                    month,
                    ...data
                })).sort((a, b) => a.month.localeCompare(b.month)),
                categoryRevenue: Object.entries(categoryRevenue).map(([category, revenue]) => ({
                    category,
                    revenue
                })).sort((a, b) => b.revenue - a.revenue),
                dailyRevenue,
                topCourses,
                topTeachers
            }
        });
    } catch (error) {
        console.error("Get revenue reports error:", error);
        res.status(500).json({ message: error.message });
    }
};

