import FinanceTransaction from "../models/financeTransactionModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";

/* ======================================================
   ADMIN PERCENTAGE CONSTANT
====================================================== */
const ADMIN_PERCENTAGE = 10; // 10% admin cut

/* ======================================================
   GET TEACHER FINANCE STATS
====================================================== */
export const getTeacherFinanceStats = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Get all transactions for this teacher
        const transactions = await FinanceTransaction.find({
            teacher: teacherId,
            type: "PAYMENT",
            status: "COMPLETED",
        }).sort({ createdAt: -1 });

        // Calculate total earnings (teacher's share)
        const totalEarnings = transactions.reduce((sum, tx) => sum + (tx.teacherAmount || 0), 0);

        // Calculate this month's earnings
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthTransactions = transactions.filter(
            (tx) => new Date(tx.createdAt) >= startOfMonth
        );
        const thisMonthEarnings = thisMonthTransactions.reduce(
            (sum, tx) => sum + (tx.teacherAmount || 0), 0
        );

        // Calculate last month's earnings
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const lastMonthTransactions = transactions.filter((tx) => {
            const createdAt = new Date(tx.createdAt);
            return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
        });
        const lastMonthEarnings = lastMonthTransactions.reduce(
            (sum, tx) => sum + (tx.teacherAmount || 0), 0
        );

        // Calculate growth percentage
        const growth = lastMonthEarnings > 0
            ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 * 10) / 10
            : thisMonthEarnings > 0 ? 100 : 0;

        // Get pending transactions (if any)
        const pendingTransactions = await FinanceTransaction.find({
            teacher: teacherId,
            status: "PENDING",
        });
        const pendingAmount = pendingTransactions.reduce((sum, tx) => sum + (tx.teacherAmount || 0), 0);

        // Get total admin cut collected
        const totalAdminCut = transactions.reduce((sum, tx) => sum + (tx.adminAmount || 0), 0);

        // Get total gross revenue
        const totalGrossRevenue = transactions.reduce((sum, tx) => sum + (tx.grossAmount || 0), 0);

        // Get total transactions count
        const totalTransactions = transactions.length;

        res.json({
            success: true,
            stats: {
                totalEarnings,
                thisMonth: thisMonthEarnings,
                lastMonth: lastMonthEarnings,
                pending: pendingAmount,
                growth,
                totalAdminCut,
                totalGrossRevenue,
                totalTransactions,
                adminPercentage: ADMIN_PERCENTAGE,
            },
        });
    } catch (error) {
        console.error("Get Teacher Finance Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch finance stats" });
    }
};

/* ======================================================
   GET TEACHER FINANCE TRANSACTIONS
====================================================== */
export const getTeacherTransactions = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;

        // Build query
        const query = { teacher: teacherId };

        if (type && type !== "all") {
            query.type = type;
        }

        if (status && status !== "all") {
            query.status = status;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const transactions = await FinanceTransaction.find(query)
            .populate("course", "title thumbnail")
            .populate("student", "fullName email")
            .populate("enrollment", "receipt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await FinanceTransaction.countDocuments(query);

        // Format transactions for response
        const formattedTransactions = transactions.map((tx) => ({
            id: tx._id,
            type: tx.type,
            status: tx.status,
            course: tx.course?.title || "Unknown Course",
            student: tx.student?.fullName || "Unknown Student",
            studentEmail: tx.student?.email || "",
            grossAmount: tx.grossAmount,
            adminPercentage: tx.adminPercentage,
            adminAmount: tx.adminAmount,
            teacherAmount: tx.teacherAmount,
            description: tx.description,
            receiptUrl: tx.enrollment?.receipt?.url || null,
            createdAt: tx.createdAt,
            processedAt: tx.processedAt,
            completedAt: tx.completedAt,
        }));

        res.json({
            success: true,
            transactions: formattedTransactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Get Teacher Transactions Error:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

/* ======================================================
   GET TEACHER COURSE EARNINGS
====================================================== */
export const getTeacherCourseEarnings = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Get all courses by this teacher
        const courses = await Course.find({ instructor: teacherId })
            .select("_id title price thumbnail")
            .sort({ createdAt: -1 });

        if (courses.length === 0) {
            return res.json({
                success: true,
                courses: [],
                summary: {
                    totalCourses: 0,
                    totalStudents: 0,
                    totalEarnings: 0,
                    totalAdminCut: 0,
                    totalGrossRevenue: 0,
                },
            });
        }

        const courseIds = courses.map((course) => course._id);

        // Get all PAID enrollments for teacher's courses
        const enrollments = await Enrollment.find({
            course: { $in: courseIds },
            paymentStatus: "PAID",
        }).populate("course", "title");

        // Calculate earnings per course
        const courseEarningsMap = new Map();

        // Initialize all courses with zero
        courses.forEach((course) => {
            courseEarningsMap.set(course._id.toString(), {
                courseId: course._id,
                title: course.title,
                price: course.price,
                thumbnail: course.thumbnail?.url || "",
                totalStudents: 0,
                grossRevenue: 0,
                adminAmount: 0,
                teacherAmount: 0,
                enrollments: [],
            });
        });

        // Calculate earnings from enrollments
        enrollments.forEach((enrollment) => {
            if (!enrollment.course) return;
            
            const courseId = enrollment.course._id.toString();
            const courseData = courseEarningsMap.get(courseId);
            
            if (courseData) {
                const gross = enrollment.amount || enrollment.course.price || 0;
                const admin = enrollment.adminAmount || Math.round((gross * ADMIN_PERCENTAGE) / 100 * 100) / 100;
                const teacher = enrollment.teacherAmount || Math.round((gross * (100 - ADMIN_PERCENTAGE)) / 100 * 100) / 100;

                courseData.totalStudents += 1;
                courseData.grossRevenue += gross;
                courseData.adminAmount += admin;
                courseData.teacherAmount += teacher;
                
                courseData.enrollments.push({
                    enrollmentId: enrollment._id,
                    studentName: enrollment.student?.fullName || "Unknown",
                    amount: gross,
                    adminAmount: admin,
                    teacherAmount: teacher,
                    date: enrollment.paymentVerifiedAt || enrollment.createdAt,
                });
            }
        });

        // Convert to array and sort by earnings
        const courseEarnings = Array.from(courseEarningsMap.values())
            .map((course) => ({
                ...course,
                netRevenue: course.teacherAmount,
            }))
            .sort((a, b) => b.teacherAmount - a.teacherAmount);

        // Calculate summary
        const summary = {
            totalCourses: courses.length,
            totalStudents: courseEarnings.reduce((sum, c) => sum + c.totalStudents, 0),
            totalEarnings: courseEarnings.reduce((sum, c) => sum + c.teacherAmount, 0),
            totalAdminCut: courseEarnings.reduce((sum, c) => sum + c.adminAmount, 0),
            totalGrossRevenue: courseEarnings.reduce((sum, c) => sum + c.grossRevenue, 0),
            adminPercentage: ADMIN_PERCENTAGE,
        };

        res.json({
            success: true,
            courses: courseEarnings,
            summary,
        });
    } catch (error) {
        console.error("Get Teacher Course Earnings Error:", error);
        res.status(500).json({ message: "Failed to fetch course earnings" });
    }
};

/* ======================================================
   GET TEACHER MONTHLY EARNINGS CHART
====================================================== */
export const getTeacherMonthlyEarnings = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { months = 12 } = req.query;

        // Get all completed payment transactions
        const transactions = await FinanceTransaction.find({
            teacher: teacherId,
            type: "PAYMENT",
            status: "COMPLETED",
        }).sort({ createdAt: 1 });

        // Calculate date range
        const now = new Date();
        const startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - parseInt(months));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const monthsArray = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize months
        for (let i = parseInt(months) - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthIndex = date.getMonth();
            const year = date.getFullYear();
            
            monthsArray.push({
                month: monthNames[monthIndex],
                year: year.toString(),
                fullLabel: `${monthNames[monthIndex]} ${year}`,
                grossRevenue: 0,
                adminAmount: 0,
                teacherAmount: 0,
                transactions: 0,
            });
        }

        // Fill in transaction data
        transactions.forEach((tx) => {
            const txDate = new Date(tx.createdAt);
            if (txDate >= startDate && txDate <= now) {
                const monthIndex = txDate.getMonth();
                const year = txDate.getFullYear();
                
                // Find matching month entry
                const monthEntry = monthsArray.find(
                    (m) => m.month === monthNames[monthIndex] && m.year === year.toString()
                );
                
                if (monthEntry) {
                    monthEntry.grossRevenue += tx.grossAmount || 0;
                    monthEntry.adminAmount += tx.adminAmount || 0;
                    monthEntry.teacherAmount += tx.teacherAmount || 0;
                    monthEntry.transactions += 1;
                }
            }
        });

        res.json({
            success: true,
            data: monthsArray,
            adminPercentage: ADMIN_PERCENTAGE,
        });
    } catch (error) {
        console.error("Get Teacher Monthly Earnings Error:", error);
        res.status(500).json({ message: "Failed to fetch monthly earnings" });
    }
};

/* ======================================================
   GET TEACHER FINANCE SUMMARY
====================================================== */
export const getTeacherFinanceSummary = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Get all courses by this teacher
        const courses = await Course.find({ instructor: teacherId });
        const courseIds = courses.map((course) => course._id);

        // Get all PAID enrollments
        const enrollments = await Enrollment.find({
            course: { $in: courseIds },
            paymentStatus: "PAID",
        });

        // Calculate summary
        const totalGrossRevenue = enrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalAdminCut = enrollments.reduce((sum, e) => sum + (e.adminAmount || 0), 0);
        const totalTeacherEarnings = enrollments.reduce((sum, e) => sum + (e.teacherAmount || 0), 0);
        const totalStudents = enrollments.length;

        // Get recent transactions (last 10)
        const recentTransactions = await FinanceTransaction.find({
            teacher: teacherId,
            type: "PAYMENT",
        })
            .populate("course", "title")
            .sort({ createdAt: -1 })
            .limit(10);

        // Get monthly average
        const now = new Date();
        const firstTransaction = await FinanceTransaction.findOne({
            teacher: teacherId,
            type: "PAYMENT",
            status: "COMPLETED",
        }).sort({ createdAt: 1 });

        let monthlyAverage = 0;
        if (firstTransaction) {
            const monthsDiff = Math.max(
                1,
                Math.floor(
                    (now.getTime() - new Date(firstTransaction.createdAt).getTime()) /
                        (30 * 24 * 60 * 60 * 1000)
                )
            );
            monthlyAverage = Math.round((totalTeacherEarnings / monthsDiff) * 100) / 100;
        }

        res.json({
            success: true,
            summary: {
                totalGrossRevenue,
                totalAdminCut,
                totalTeacherEarnings,
                totalStudents,
                adminPercentage: ADMIN_PERCENTAGE,
                monthlyAverage,
                totalCourses: courses.length,
            },
            recentTransactions: recentTransactions.map((tx) => ({
                id: tx._id,
                course: tx.course?.title || "Unknown",
                amount: tx.grossAmount,
                teacherShare: tx.teacherAmount,
                date: tx.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get Teacher Finance Summary Error:", error);
        res.status(500).json({ message: "Failed to fetch finance summary" });
    }
};

