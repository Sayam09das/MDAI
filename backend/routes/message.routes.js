import express from "express";
import {
    createMessage,
    getMyConversations,
    getConversationMessages,
    getMessageRecipients,
    getCoursesForBroadcast,
    deleteMessage,
    deleteConversation,
    getAllConversationsAdmin
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= MESSAGE ROUTES ================= */

// 🔥 Create message (individual, course broadcast, or global broadcast)
router.post("/", protect, createMessage);

// 🔥 Get my conversations
router.get("/conversations", protect, getMyConversations);

// 🔥 Get messages in a conversation
router.get("/conversations/:conversationId/messages", protect, getConversationMessages);

// 🔥 Get recipients for messaging
router.get("/recipients", protect, getMessageRecipients);

// 🔥 Get courses for broadcast (teacher/admin only)
router.get("/courses", protect, getCoursesForBroadcast);

// 🔥 Delete a message
router.delete("/:messageId", protect, deleteMessage);

// 🔥 Delete a conversation
router.delete("/conversations/:conversationId", protect, deleteConversation);

/* ================= ADMIN ROUTES ================= */

// 🔥 Admin: Get all conversations
router.get("/admin/conversations", protect, getAllConversationsAdmin);

export default router;

