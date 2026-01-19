import express from "express";
import upload from "../middlewares/multer.js";

import {
    createResource,
    updateResource,
    deleteResource,
    getTeacherResources,
    getAllResources,
} from "../controllers/resource.controller.js";

const router = express.Router();

/* =====================================================
   TEACHER ROUTES
===================================================== */

// CREATE resource (with thumbnail)
router.post(
    "/",
    upload.single("thumbnail"),
    createResource
);

// UPDATE resource (thumbnail optional)
router.put(
    "/:id",
    upload.single("thumbnail"),
    updateResource
);

// DELETE resource
router.delete(
    "/:id",
    deleteResource
);

// GET teacher's own resources
// example: /api/resource/teacher?teacherName=Rahul Sharma
router.get(
    "/teacher",
    getTeacherResources
);

/* =====================================================
   STUDENT ROUTES
===================================================== */

// GET all resources
router.get(
    "/",
    getAllResources
);

export default router;
