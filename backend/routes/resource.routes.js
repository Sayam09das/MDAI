import express from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createResource,
    updateResource,
    deleteResource,
    getTeacherResources,
    getAllResources,
    searchResources,
} from "../controllers/resource.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher/Admin: Create resource
router.post("/", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), createResource);

// Teacher: Get own resources
router.get("/teacher/me", getTeacherResources);

// Student: Get all resources (public to authenticated users)
router.get("/", getAllResources);

// Global search across resources - MUST be before /:id route
router.get("/search", searchResources);

// Teacher: Update own resource | Admin: Update any resource
router.put("/:id", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), updateResource);

// Teacher: Delete own resource | Admin: Delete any resource
router.delete("/:id", deleteResource);

export default router;
