import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, "Event date is required"],
    index: true,
  },
  time: {
    type: String, // Format: HH:mm
    default: "09:00",
  },
  type: {
    type: String,
    enum: ["task", "exam", "meeting", "holiday", "other"],
    default: "task",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  reminder: {
    type: Boolean,
    default: true,
  },
  reminderTime: {
    type: Number, // Minutes before event
    default: 30,
    min: 0,
    max: 1440, // 24 hours
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", null],
      default: null,
    },
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "#3b82f6",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for efficient queries
eventSchema.index({ user: 1, date: 1 });
eventSchema.index({ user: 1, completed: 1 });
eventSchema.index({ user: 1, type: 1 });

// Virtual for datetime
eventSchema.virtual("dateTime").get(function () {
  return new Date(`${this.date}T${this.time}`);
});

// Transform output
eventSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

