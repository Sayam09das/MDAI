import express from "express";
import { enrollCourse, getMyEnrollments } from "../controllers/enrollment.controller.js";
import { protect, userOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:courseId", protect, userOnly, enrollCourse);
router.get("/my-courses", protect, userOnly, getMyEnrollments);

export default router;
