import express from "express";
import {
    getCertificateSettings,
    updateCertificateSettings,
    uploadBackgroundImage,
    deleteBackgroundImage,
    checkEligibility,
    getMyCertificates,
    getMyCertificate,
    verifyCertificate,
    getCourseCertificates,
    getAllCertificates,
    generateCourseCertificates
} from "../controllers/certificate.controller.js";

import { protect, adminOnly, teacherOnly } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.js";

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

// Generate certificates for a course (teacher marks course as complete)
router.post("/course/:courseId/generate", protect, teacherOnly, generateCourseCertificates);

/* =====================================
   ADMIN ROUTES
===================================== */

// Get certificate settings
router.get("/settings", protect, adminOnly, getCertificateSettings);

// Update certificate settings
router.put("/settings", protect, adminOnly, updateCertificateSettings);

// Upload certificate background image
router.post("/settings/upload-background", protect, adminOnly, imageUpload.single('backgroundImage'), uploadBackgroundImage);

// Delete certificate background image
router.delete("/settings/background-image", protect, adminOnly, deleteBackgroundImage);

// Get all certificates (admin)
router.get("/all", protect, adminOnly, getAllCertificates);

export default router;

