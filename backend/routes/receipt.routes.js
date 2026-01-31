import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getSignedReceiptUrl } from "../controllers/receipt.controller.js";
const router = express.Router();

router.get("/receipt", protect, getSignedReceiptUrl);

export default router;
