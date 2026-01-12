import express from "express";
import {
  createCourse,
  getTeacherCourses,
  getAllPublishedCourses,
  publishCourse,
} from "../controllers/course.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// CREATE COURSE
router.post(
  "/create",
  protect,
  teacherOnly,
  upload.single("thumbnail"),
  createCourse
);

// GET COURSES FOR TEACHER
router.get(
  "/teacher",
  protect,
  teacherOnly,
  getTeacherCourses
);

// GET COURSES FOR USERS
router.get(
  "/",
  getAllPublishedCourses
);

// routes/courseRoutes.js
router.patch(
  "/:id/publish",
  protect,
  teacherOnly,
  publishCourse
);

export default router;
