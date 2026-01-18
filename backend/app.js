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
import database from "./database/db.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */
app.use(cors({
   origin: [
      "https://mdai-self.vercel.app",
   ],
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"],
   credentials: true,
}));



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
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/admin", adminRoutes);

app.get("/ping", (req, res) => {
   res.status(200).send("ok");
});


/* =====================
   EXPORT APP
===================== */
export default app;
