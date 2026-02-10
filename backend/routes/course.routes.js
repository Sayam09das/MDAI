import express from "express";
import {
  createCourse,
  getTeacherCourses,
  getAllPublishedCourses,
  publishCourse,
  getCourseById,
  searchCourses,
  updateCourse,
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

// UPDATE COURSE
router.put(
  "/:id",
  protect,
  teacherOnly,
  updateCourse
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

// Global search for courses - MUST be before /:id route
router.get("/search", searchCourses);

// GET SINGLE COURSE BY ID - Must be after /search
router.get("/:id", getCourseById);


export default router;
