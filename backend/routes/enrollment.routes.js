import express from "express";
import { enrollCourse, getMyEnrollments, getReceipt } from "../controllers/enrollment.controller.js";
import { protect, userOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:courseId", protect, userOnly, enrollCourse);
router.get("/my-courses", protect, userOnly, getMyEnrollments);
router.get("/receipt/:enrollmentId", protect, userOnly, getReceipt);

export default router;
