import Admin from "../models/adminModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";
import Resource from "../models/ResourceModel.js";
import AuditLog from "../models/auditLogModel.js";
import Announcement from "../models/announcementModel.js";
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
            .populate("student", "name email")
            .populate("course", "title");

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





export const updatePaymentStatusByAdmin = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;

        // First, check if enrollment exists
        const existingEnrollment = await Enrollment.findById(enrollmentId);
        if (!existingEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (status !== "PAID") {
            return res.status(400).json({ message: "Only PAID allowed" });
        }

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
        await existingEnrollment.save();

        // Now populate for receipt generation
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "fullName email")
            .populate("course", "title price");

        // 1️⃣ Generate image with populated data
        const imagePath = await generateReceiptImage(enrollment);

        // 2️⃣ Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: "receipts",
            resource_type: "image",
        });

        existingEnrollment.receipt.public_id = uploadResult.public_id;
        existingEnrollment.receipt.url = uploadResult.secure_url;

        fs.unlinkSync(imagePath);
        await existingEnrollment.save();

        res.json({
            success: true,
            message: "Payment approved & receipt image generated",
            receiptImage: uploadResult.secure_url,
        });
    } catch (error) {
        console.error("Payment approval error:", error);
        res.status(500).json({ message: error.message });
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
        // Get enrollment stats
        const totalEnrollments = await Enrollment.countDocuments();
        const paidEnrollments = await Enrollment.countDocuments({
            paymentStatus: "PAID",
        });

        // Get course stats
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });

        // Get student stats
        const totalStudents = await Enrollment.distinct("student").then((students) => students.length);

        // Get revenue stats
        const enrollments = await Enrollment.find({ paymentStatus: "PAID" });
        const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amount || 0), 0);

        // Get monthly enrollment data for charts
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
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

        res.json({
            success: true,
            stats: {
                totalEnrollments,
                paidEnrollments,
                totalCourses,
                publishedCourses,
                totalStudents,
                totalRevenue,
            },
            charts: {
                monthlyEnrollments,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================================
   ADMIN: GET SYSTEM STATS
   ========================================= */
export const getSystemStatsAdmin = async (req, res) => {
    try {
        // User counts
        const totalStudents = await require("../models/userModel.js").User.countDocuments();
        const totalTeachers = await require("../models/teacherModel.js").Teacher.countDocuments();
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

        // Get User model and Teacher model
        const User = require("../models/userModel.js").User;
        const Teacher = require("../models/teacherModel.js").Teacher;

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

