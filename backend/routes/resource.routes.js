import express from "express";
import {
    createResource,
    updateResource,
    deleteResource,
    getResourcesByCourse,
    getResourceById,
} from "../controllers/resource.Controller.js";

import upload from "../middlewares/multer.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= TEACHER ROUTES ================= */
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

router.delete(
    "/:id",
    protect,
    teacherOnly,
    deleteResource
);

/* ================= VIEW ROUTES ================= */
router.get(
    "/course/:courseId",
    protect,
    getResourcesByCourse
);

router.get(
    "/:id",
    protect,
    getResourceById
);

export default router;
