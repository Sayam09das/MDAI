import express from "express";
import { createCourse } from "../controllers/course.controller.js";
import { protect, teacherOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  teacherOnly,
  upload.single("thumbnail"),
  createCourse
);

export default router;
