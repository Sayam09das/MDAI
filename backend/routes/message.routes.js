import express from "express";
import {
  sendMessage,
  getMessages,
  markMessageAsRead,
  markConversationAsRead,
  deleteMessage,
  getConversations,
  getOrCreateConversation,
  searchConversations,
  getUnreadCount,
  archiveConversation,
  unarchiveConversation,
  getArchivedConversations,
  getContacts,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= MESSAGE ROUTES ================= */

// 🔥 Send a new message
router.post(
  "/send",
  protect,
  sendMessage
);

// 🔥 Get messages for a conversation
router.get(
  "/conversation/:conversationId",
  protect,
  getMessages
);

// 🔥 Mark a single message as read
router.patch(
  "/read/:messageId",
  protect,
  markMessageAsRead
);

// 🔥 Mark all messages in a conversation as read
router.patch(
  "/read/conversation/:conversationId",
  protect,
  markConversationAsRead
);

// 🔥 Delete a message (soft delete)
router.delete(
  "/:messageId",
  protect,
  deleteMessage
);

/* ================= CONVERSATION ROUTES ================= */

// 🔥 Get all conversations
router.get(
  "/conversations",
  protect,
  getConversations
);

// 🔥 Get or create a conversation
router.post(
  "/conversations/get-or-create",
  protect,
  getOrCreateConversation
);

// 🔥 Search conversations and messages
router.get(
  "/conversations/search",
  protect,
  searchConversations
);

// 🔥 Get unread message count
router.get(
  "/conversations/unread-count",
  protect,
  getUnreadCount
);

// 🔥 Archive a conversation
router.patch(
  "/conversations/archive/:conversationId",
  protect,
  archiveConversation
);

// 🔥 Unarchive a conversation
router.patch(
  "/conversations/unarchive/:conversationId",
  protect,
  unarchiveConversation
);

// 🔥 Get archived conversations
router.get(
  "/conversations/archived",
  protect,
  getArchivedConversations
);

// 🔥 Get contacts (students for teachers, teachers for students)
router.get(
  "/contacts",
  protect,
  getContacts
);

export default router;

