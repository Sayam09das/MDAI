import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  getEventsByDate,
  updateEvent,
  deleteEvent,
  toggleEventCompletion,
  getUpcomingEvents,
  getPendingTasks,
  deleteAllUserEvents,
} from "../controllers/event.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= EVENT ROUTES ================= */

// All routes require authentication
router.use(protect);

// 🔥 CREATE NEW EVENT
router.post("/", createEvent);

// 🔥 GET ALL EVENTS (with optional filters)
router.get("/", getEvents);

// 🔥 GET UPCOMING EVENTS
router.get("/upcoming", getUpcomingEvents);

// 🔥 GET PENDING TASKS
router.get("/tasks/pending", getPendingTasks);

// 🔥 GET EVENTS BY DATE
router.get("/date/:date", getEventsByDate);

// 🔥 GET SINGLE EVENT BY ID
router.get("/:id", getEventById);

// 🔥 UPDATE EVENT
router.put("/:id", updateEvent);

// 🔥 DELETE EVENT
router.delete("/:id", deleteEvent);

// 🔥 TOGGLE EVENT COMPLETION
router.patch("/:id/toggle", toggleEventCompletion);

// 🔥 DELETE ALL USER EVENTS (cleanup)
router.delete("/", deleteAllUserEvents);

export default router;

