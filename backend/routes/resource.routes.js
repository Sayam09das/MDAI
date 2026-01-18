import express from "express";
import {
    createResource,
    updateResource,
    deleteResource,
    getResourcesByCourse,
    getResourceById,
    getMyResources, // ✅ NEW
} from "../controllers/resource.Controller.js";

import upload from "../middlewares/multer.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */

// ✅ CREATE
router.post(
    "/create",
    protect,
    teacherOnly,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createResource
);

// ✅ UPDATE
router.put(
    "/:id",
    protect,
    teacherOnly,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    updateResource
);

// ✅ DELETE
router.delete(
    "/:id",
    protect,
    teacherOnly,
    deleteResource
);

// ✅ GET MY RESOURCES (RELOAD FIX)
router.get(
    "/my",
    protect,
    teacherOnly,
    getMyResources
);

/* ================= VIEW ROUTES ================= */

// GET BY COURSE (STUDENT / PUBLIC VIEW)
router.get(
    "/course/:courseId",
    protect,
    getResourcesByCourse
);

// GET SINGLE RESOURCE
router.get(
    "/:id",
    protect,
    getResourceById
);

export default router;
