import express from "express";
import {
    getAllFinanceTransactions,
    getAdminFinanceStats,
    getAllTeachersWithEarnings,
    getAdminRevenueReport,
} from "../controllers/adminFinance.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================
   ADMIN FINANCE ROUTES
===================================== */

// 🔥 GET ALL FINANCE TRANSACTIONS
router.get(
    "/finance/transactions",
    protect,
    adminOnly,
    getAllFinanceTransactions
);

// 🔥 GET ADMIN FINANCE STATS
router.get(
    "/finance/stats",
    protect,
    adminOnly,
    getAdminFinanceStats
);

// 🔥 GET ALL TEACHERS WITH EARNINGS
router.get(
    "/finance/teachers-earnings",
    protect,
    adminOnly,
    getAllTeachersWithEarnings
);

// 🔥 GET REVENUE REPORT
router.get(
    "/finance/revenue-report",
    protect,
    adminOnly,
    getAdminRevenueReport
);

export default router;

