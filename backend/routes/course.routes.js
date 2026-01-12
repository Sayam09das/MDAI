import express from "express";
import {
  createCourse,
  getTeacherCourses,
  getAllPublishedCourses,
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

export default router;
