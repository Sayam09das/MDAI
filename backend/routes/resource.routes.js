import express from "express";
import upload from "../middlewares/multer.js";
import {
    createResource,
    updateResource,
    deleteResource,
    getTeacherResources,
    getAllResources,
} from "../controllers/resource.controller.js";

const router = express.Router();

router.post("/", upload.single("thumbnail"), createResource);
router.put("/:id", upload.single("thumbnail"), updateResource);
router.delete("/:id", deleteResource);

router.get("/teacher", getTeacherResources);
router.get("/", getAllResources);

export default router;
