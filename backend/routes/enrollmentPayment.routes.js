import express from "express";
import {
    createEnrollment,
    getMyEnrollments,
    getAllEnrollments,
    updateEnrollmentPaymentStatus,
} from "../controllers/enrollmentPayment.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= STUDENT ================= */
router.post("/enroll/:courseId",protect,createEnrollment);
router.get("/my-enrollments", protect, getMyEnrollments);

/* ================= ADMIN ================= */
router.get("/admin/all", protect, adminOnly, getAllEnrollments);
router.patch(
    "/admin/:enrollmentId/payment-status",
    protect,
    adminOnly,
    updateEnrollmentPaymentStatus
);

export default router;
