import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import courseRoutes from "./routes/course.routes.js"
import enrollmentRoutes from "./routes/enrollment.routes.js";
import lessonRoutes from "./routes/lesson.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import studentRoutes from "./routes/student.routes.js";
import eventRoutes from "./routes/event.routes.js";
import messageRoutes from "./routes/message.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import database from "./database/db.js";

dotenv.config();

const app = express();

/* =====================
   CORS CONFIGURATION
===================== */
const corsOptions = {
   origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests, or Postman)
      // Also allow all localhost origins for development
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
         "https://mdai-self.vercel.app",
         "https://mdai-admin.vercel.app",
      ];
      
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('localhost')) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'));
      }
   },
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
   credentials: true,
   optionsSuccessStatus: 204, // Some legacy browsers choke on 200
};

app.use(cors(corsOptions));

// Note: OPTIONS preflight requests are handled automatically by the cors middleware above
// No need for explicit app.options('*', ...) as it causes issues with newer path-to-regexp versions


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

/* =====================
   DATABASE
===================== */
database();

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/complaints", complaintRoutes);


app.get("/ping", (req, res) => {
   res.status(200).send("ok");
});


/* =====================
   404 HANDLER - ALL OTHER ROUTES
   Must be AFTER all route definitions
===================== */
app.use((req, res) => {
   res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl
   });
});


/* =====================
   GLOBAL ERROR HANDLER
===================== */
app.use((err, req, res, next) => {
   console.error("Error:", err.message);
   console.error("Stack:", err.stack);
   
   res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
   });
});


/* =====================
   EXPORT APP
===================== */
export default app;
