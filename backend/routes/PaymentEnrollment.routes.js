import express from "express";
import { enrollCourse } from "../controllers/enrollment.controller.js";
import { protect, userOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:courseId", protect, userOnly, enrollCourse);

export default router;
