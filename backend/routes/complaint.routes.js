import express from "express";
import {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaintsAdmin,
    updateComplaintStatus,
    addComplaintRemark,
    deleteComplaint,
    getRecipients,
    getComplaintStats
} from "../controllers/complaint.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/* =====================================
   COMMON ROUTES (Student/Teacher)
===================================== */

// Create a new complaint
router.post("/", createComplaint);

// Get recipients for dropdown
router.get("/recipients", getRecipients);

// Get my complaints (sent or received)
router.get("/my", getMyComplaints);

// Get complaint stats
router.get("/stats", getComplaintStats);

// Get single complaint by ID
router.get("/:id", getComplaintById);

/* =====================================
   ADMIN ROUTES
===================================== */

// Get all complaints (admin only)
router.get("/admin/all", getAllComplaintsAdmin);

// Update complaint status (admin only)
router.patch("/:id/status", updateComplaintStatus);

// Add remark to complaint (admin only)
router.patch("/:id/remark", addComplaintRemark);

// Delete complaint (admin only - soft delete)
router.delete("/:id", deleteComplaint);

export default router;
