import Event from "../models/eventModel.js";

/* ======================================================
   CREATE NEW EVENT
====================================================== */
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      date,
      time,
      type,
      priority,
      reminder,
      reminderTime,
      recurring,
      allDay,
      color,
    } = req.body;

    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Title and date are required",
      });
    }

    const event = new Event({
      user: userId,
      title,
      description,
      date,
      time,
      type: type || "task",
      priority: priority || "medium",
      reminder: reminder !== false,
      reminderTime: reminderTime || 30,
      recurring: recurring || { isRecurring: false, frequency: null },
      allDay: allDay || false,
      color: color || "#3b82f6",
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL EVENTS FOR USER
====================================================== */
export const getEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, type, completed } = req.query;

    // Build query
    const query = { user: userId };

    // Filter by month and year
    if (month && year) {
      const monthStr = String(parseInt(month) + 1).padStart(2, "0");
      query.date = {
        $regex: `^${year}-${monthStr}`,
      };
    }

    // Filter by type
    if (type && type !== "all") {
      query.type = type;
    }

    // Filter by completion status
    if (completed !== undefined && completed !== "all") {
      query.completed = completed === "true";
    }

    const events = await Event.find(query).sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

/* ======================================================
   GET SINGLE EVENT BY ID
====================================================== */
export const getEventById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, user: userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get Event By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

/* ======================================================
   GET EVENTS BY DATE
====================================================== */
export const getEventsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const events = await Event.find({
      user: userId,
      date: date,
    }).sort({ time: 1 });

    res.json({
      success: true,
      count: events.length,
      events,
      date,
    });
  } catch (error) {
    console.error("Get Events By Date Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events for date",
      error: error.message,
    });
  }
};

/* ======================================================
   UPDATE EVENT
====================================================== */
export const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      date,
      time,
      type,
      priority,
      completed,
      reminder,
      reminderTime,
      recurring,
      allDay,
      color,
    } = req.body;

    // Find event and verify ownership
    const event = await Event.findOne({ _id: id, user: userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (date) event.date = date;
    if (time !== undefined) event.time = time;
    if (type) event.type = type;
    if (priority) event.priority = priority;
    if (completed !== undefined) {
      event.completed = completed;
      event.completedAt = completed ? new Date() : null;
    }
    if (reminder !== undefined) event.reminder = reminder;
    if (reminderTime !== undefined) event.reminderTime = reminderTime;
    if (recurring !== undefined) event.recurring = recurring;
    if (allDay !== undefined) event.allDay = allDay;
    if (color) event.color = color;

    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE EVENT
====================================================== */
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findOneAndDelete({ _id: id, user: userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

/* ======================================================
   TOGGLE EVENT COMPLETION
====================================================== */
export const toggleEventCompletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, user: userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Toggle completion status
    event.completed = !event.completed;
    event.completedAt = event.completed ? new Date() : null;

    await event.save();

    res.json({
      success: true,
      message: event.completed ? "Event marked as completed" : "Event marked as incomplete",
      event,
    });
  } catch (error) {
    console.error("Toggle Event Completion Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle event completion",
      error: error.message,
    });
  }
};

/* ======================================================
   GET UPCOMING EVENTS
====================================================== */
export const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const events = await Event.find({
      user: userId,
      date: { $gte: todayStr },
      completed: false,
    })
      .sort({ date: 1, time: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get Upcoming Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events",
      error: error.message,
    });
  }
};

/* ======================================================
   GET PENDING TASKS
====================================================== */
export const getPendingTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const tasks = await Event.find({
      user: userId,
      type: "task",
      completed: false,
    })
      .sort({ date: 1, priority: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Pending Tasks Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending tasks",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE ALL USER EVENTS (for cleanup)
====================================================== */
export const deleteAllUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Event.deleteMany({ user: userId });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} events`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete All User Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete events",
      error: error.message,
    });
  }
};

