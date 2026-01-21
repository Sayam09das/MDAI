import express from "express";
import {
    enrollCourse,
    getMyEnrollments,
    getCourseEnrollmentsForTeacher,
} from "../controllers/enrollment.controller.js";

import {
    protect,
    userOnly,
    teacherOnly,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/my-courses", protect, userOnly, getMyEnrollments);
router.get(
    "/teacher/course/:courseId",
    protect,
    teacherOnly,
    getCourseEnrollmentsForTeacher
);
router.post("/:courseId", protect, userOnly, enrollCourse);

export default router;
