import express from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createResource,
    updateResource,
    deleteResource,
    getTeacherResources,
    getAllResources,
    getAllResourcesAdmin,
    getResourceById,
} from "../controllers/resource.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher/Admin: Create resource
router.post("/", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), createResource);

// Teacher: Update own resource | Admin: Update any resource
router.put("/:id", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), updateResource);

// Teacher: Delete own resource | Admin: Delete any resource
router.delete("/:id", deleteResource);

// Get single resource
router.get("/:id", getResourceById);

// Teacher: Get own resources
router.get("/teacher/me", getTeacherResources);

// Student: Get all resources (public to authenticated users)
router.get("/", getAllResources);

// Admin: Get all resources with full details
router.get("/admin/all", getAllResourcesAdmin);

export default router;
