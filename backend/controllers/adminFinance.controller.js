import FinanceTransaction from "../models/financeTransactionModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";
import Teacher from "../models/teacherModel.js";

/* ======================================================
   ADMIN PERCENTAGE CONSTANT
====================================================== */
const ADMIN_PERCENTAGE = 10; // 10% admin cut

/* ======================================================
   GET ALL FINANCE TRANSACTIONS (Admin)
====================================================== */
export const getAllFinanceTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status, teacherId, startDate, endDate } = req.query;

        // Build query
        const query = {};

        if (type && type !== "all") {
            query.type = type;
        }

        if (status && status !== "all") {
            query.status = status;
        }

        if (teacherId && teacherId !== "all") {
            query.teacher = teacherId;
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
            .populate("teacher", "fullName email")
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
            teacher: tx.teacher?.fullName || "Unknown Teacher",
            teacherEmail: tx.teacher?.email || "",
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
        console.error("Get All Finance Transactions Error:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

/* ======================================================
   GET ADMIN FINANCE STATS (Admin)
====================================================== */
export const getAdminFinanceStats = async (req, res) => {
    try {
        // Get all transactions
        const transactions = await FinanceTransaction.find({
            type: "PAYMENT",
            status: "COMPLETED",
        }).sort({ createdAt: -1 });

        // Calculate total admin revenue
        const totalAdminRevenue = transactions.reduce((sum, tx) => sum + (tx.adminAmount || 0), 0);

        // Calculate total teacher payouts
        const totalTeacherPayouts = transactions.reduce((sum, tx) => sum + (tx.teacherAmount || 0), 0);

        // Calculate total gross revenue
        const totalGrossRevenue = transactions.reduce((sum, tx) => sum + (tx.grossAmount || 0), 0);

        // Calculate this month's stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthTransactions = transactions.filter(
            (tx) => new Date(tx.createdAt) >= startOfMonth
        );
        
        const thisMonthRevenue = thisMonthTransactions.reduce(
            (sum, tx) => sum + (tx.adminAmount || 0), 0
        );
        
        const thisMonthGross = thisMonthTransactions.reduce(
            (sum, tx) => sum + (tx.grossAmount || 0), 0
        );

        // Calculate last month's stats
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const lastMonthTransactions = transactions.filter((tx) => {
            const createdAt = new Date(tx.createdAt);
            return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
        });
        
        const lastMonthRevenue = lastMonthTransactions.reduce(
            (sum, tx) => sum + (tx.adminAmount || 0), 0
        );

        // Calculate growth
        const growth = lastMonthRevenue > 0
            ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 * 10) / 10
            : thisMonthRevenue > 0 ? 100 : 0;

        // Get transaction counts
        const totalTransactions = transactions.length;
        const pendingTransactions = await FinanceTransaction.countDocuments({ status: "PENDING" });

        // Get top earning teachers
        const teacherEarningsMap = new Map();
        transactions.forEach((tx) => {
            if (tx.teacher) {
                const teacherId = tx.teacher.toString();
                if (!teacherEarningsMap.has(teacherId)) {
                    teacherEarningsMap.set(teacherId, {
                        teacherId,
                        name: tx.teacher.fullName || "Unknown",
                        earnings: 0,
                        transactions: 0,
                    });
                }
                const entry = teacherEarningsMap.get(teacherId);
                entry.earnings += tx.teacherAmount || 0;
                entry.transactions += 1;
            }
        });

        const topTeachers = Array.from(teacherEarningsMap.values())
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalGrossRevenue,
                totalAdminRevenue,
                totalTeacherPayouts,
                thisMonthRevenue,
                lastMonthRevenue,
                thisMonthGross,
                growth,
                totalTransactions,
                pendingTransactions,
                adminPercentage: ADMIN_PERCENTAGE,
            },
            topTeachers,
        });
    } catch (error) {
        console.error("Get Admin Finance Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch finance stats" });
    }
};

/* ======================================================
   GET ALL TEACHERS WITH EARNINGS (Admin)
====================================================== */
export const getAllTeachersWithEarnings = async (req, res) => {
    try {
        // Get all teachers
        const teachers = await Teacher.find({ isSuspended: false }).select("_id fullName email");
        const teacherIds = teachers.map((t) => t._id);

        // Get all completed payment transactions
        const transactions = await FinanceTransaction.find({
            teacher: { $in: teacherIds },
            type: "PAYMENT",
            status: "COMPLETED",
        });

        // Calculate earnings per teacher
        const teacherEarningsMap = new Map();

        // Initialize teachers with zero
        teachers.forEach((teacher) => {
            teacherEarningsMap.set(teacher._id.toString(), {
                teacherId: teacher._id,
                name: teacher.fullName,
                email: teacher.email,
                totalEarnings: 0,
                adminCut: 0,
                grossRevenue: 0,
                transactionCount: 0,
            });
        });

        // Calculate from transactions
        transactions.forEach((tx) => {
            if (tx.teacher) {
                const teacherId = tx.teacher.toString();
                if (teacherEarningsMap.has(teacherId)) {
                    const entry = teacherEarningsMap.get(teacherId);
                    entry.totalEarnings += tx.teacherAmount || 0;
                    entry.adminCut += tx.adminAmount || 0;
                    entry.grossRevenue += tx.grossAmount || 0;
                    entry.transactionCount += 1;
                }
            }
        });

        // Convert to array and sort
        const teacherEarnings = Array.from(teacherEarningsMap.values())
            .sort((a, b) => b.totalEarnings - a.totalEarnings);

        res.json({
            success: true,
            teachers: teacherEarnings,
        });
    } catch (error) {
        console.error("Get All Teachers With Earnings Error:", error);
        res.status(500).json({ message: "Failed to fetch teacher earnings" });
    }
};

/* ======================================================
   GET REVENUE REPORT (Admin)
====================================================== */
export const getAdminRevenueReport = async (req, res) => {
    try {
        const { period = "30days" } = req.query;

        // Calculate date range
        let startDate = new Date();
        let groupBy = "day";
        
        switch (period) {
            case "7days":
                startDate.setDate(startDate.getDate() - 7);
                groupBy = "day";
                break;
            case "30days":
                startDate.setDate(startDate.getDate() - 30);
                groupBy = "day";
                break;
            case "90days":
                startDate.setDate(startDate.getDate() - 90);
                groupBy = "week";
                break;
            case "1year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                groupBy = "month";
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        const now = new Date();

        // Get all completed payment transactions
        const transactions = await FinanceTransaction.find({
            type: "PAYMENT",
            status: "COMPLETED",
            createdAt: { $gte: startDate, $lte: now },
        }).sort({ createdAt: 1 });

        // Group by time period
        const revenueByPeriod = new Map();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        transactions.forEach((tx) => {
            const txDate = new Date(tx.createdAt);
            let key;

            if (groupBy === "month") {
                key = `${monthNames[txDate.getMonth()]} ${txDate.getFullYear()}`;
            } else if (groupBy === "week") {
                const weekNum = Math.floor(
                    (txDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
                );
                key = `Week ${weekNum + 1}`;
            } else {
                key = txDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
            }

            if (!revenueByPeriod.has(key)) {
                revenueByPeriod.set(key, {
                    period: key,
                    grossRevenue: 0,
                    adminRevenue: 0,
                    teacherPayouts: 0,
                    transactions: 0,
                });
            }

            const entry = revenueByPeriod.get(key);
            entry.grossRevenue += tx.grossAmount || 0;
            entry.adminRevenue += tx.adminAmount || 0;
            entry.teacherPayouts += tx.teacherAmount || 0;
            entry.transactions += 1;
        });

        const revenueData = Array.from(revenueByPeriod.values());

        // Calculate totals
        const totals = {
            grossRevenue: transactions.reduce((sum, tx) => sum + (tx.grossAmount || 0), 0),
            adminRevenue: transactions.reduce((sum, tx) => sum + (tx.adminAmount || 0), 0),
            teacherPayouts: transactions.reduce((sum, tx) => sum + (tx.teacherAmount || 0), 0),
            totalTransactions: transactions.length,
        };

        res.json({
            success: true,
            period,
            data: revenueData,
            totals,
            adminPercentage: ADMIN_PERCENTAGE,
        });
    } catch (error) {
        console.error("Get Admin Revenue Report Error:", error);
        res.status(500).json({ message: "Failed to fetch revenue report" });
    }
};

