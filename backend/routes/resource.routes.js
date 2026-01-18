import express from "express";
import upload from "../middlewares/multer.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

import {
    createResource,
    updateResource,
    deleteResource,
    getResourcesForStudent,
    getResourcesForTeacher,
} from "../controllers/resource.Controller.js";

const router = express.Router();

/* =====================================================
   CREATE RESOURCE (Teacher only)
===================================================== */
router.post(
    "/",
    protect,
    teacherOnly,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createResource
);

/* =====================================================
   UPDATE RESOURCE (Teacher only)
===================================================== */
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

/* =====================================================
   DELETE RESOURCE (Teacher only)
===================================================== */
router.delete(
    "/:id",
    protect,
    teacherOnly,
    deleteResource
);

/* =====================================================
   STUDENT → GET ACTIVE RESOURCES
===================================================== */
router.get(
    "/student",
    protect,
    getResourcesForStudent
);

/* =====================================================
   TEACHER / ADMIN → GET ALL RESOURCES
===================================================== */
router.get(
    "/teacher",
    protect,
    teacherOnly,
    getResourcesForTeacher
);

export default router;
