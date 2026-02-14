import express from "express";
import {
    getCertificateSettings,
    updateCertificateSettings,
    checkEligibility,
    getMyCertificates,
    getMyCertificate,
    verifyCertificate,
    getCourseCertificates,
    getAllCertificates
} from "../controllers/certificate.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================
   PUBLIC ROUTES
===================================== */

// Verify certificate (public - anyone can verify with certificate ID)
router.get("/verify/:certificateId", verifyCertificate);

/* =====================================
   STUDENT ROUTES
===================================== */

// Get my certificates
router.get("/my-certificates", protect, getMyCertificates);

// Get single certificate by ID
router.get("/my-certificates/:certificateId", protect, getMyCertificate);

// Check eligibility for a course
router.get("/eligibility/:courseId", protect, checkEligibility);

/* =====================================
   TEACHER ROUTES
===================================== */

// Get certificates for a course (teacher can see their course students)
router.get("/course/:courseId", protect, getCourseCertificates);

/* =====================================
   ADMIN ROUTES
===================================== */

// Get certificate settings
router.get("/settings", protect, adminOnly, getCertificateSettings);

// Update certificate settings
router.put("/settings", protect, adminOnly, updateCertificateSettings);

// Get all certificates (admin)
router.get("/all", protect, adminOnly, getAllCertificates);

export default router;

