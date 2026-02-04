import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/Course.js";
import Lesson from "../models/lessonModel.js";

/* ======================================================
   GET STUDENT'S ALL COURSE PROGRESS
====================================================== */
export const getStudentCourseProgress = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get all paid enrollments with course details
        const enrollments = await Enrollment.find({
            student: studentId,
            paymentStatus: "PAID",
        })
            .populate("course", "title thumbnail description duration instructor")
            .sort({ lastAccessedAt: -1 });

        if (enrollments.length === 0) {
            return res.json({
                success: true,
                message: "No courses enrolled",
                courses: [],
                stats: {
                    totalCourses: 0,
                    completedCourses: 0,
                    averageProgress: 0,
                    totalLessonsCompleted: 0,
                },
            });
        }

        // Get total lessons for each course
        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                if (!enrollment.course) return null;

                const totalLessons = await Lesson.countDocuments({
                    course: enrollment.course._id,
                });

                const completedLessonsCount = enrollment.completedLessons?.length || 0;
                const progress = totalLessons > 0
                    ? Math.round((completedLessonsCount / totalLessons) * 100)
                    : enrollment.progress || 0;

                return {
                    enrollmentId: enrollment._id,
                    courseId: enrollment.course._id,
                    title: enrollment.course.title,
                    thumbnail: enrollment.course.thumbnail,
                    description: enrollment.course.description,
                    status: enrollment.status,
                    progress,
                    totalLessons,
                    completedLessons: completedLessonsCount,
                    lastAccessedAt: enrollment.lastAccessedAt,
                    completedAt: enrollment.completedAt,
                    startedAt: enrollment.createdAt,
                };
            })
        );

        // Filter out null courses (where course was deleted)
        const validCourses = coursesWithProgress.filter((c) => c !== null);

        // Calculate overall stats
        const stats = {
            totalCourses: validCourses.length,
            completedCourses: validCourses.filter((c) => c.status === "COMPLETED").length,
            averageProgress: validCourses.length > 0
                ? Math.round(
                    validCourses.reduce((sum, c) => sum + c.progress, 0) / validCourses.length
                )
                : 0,
            totalLessonsCompleted: validCourses.reduce((sum, c) => sum + c.completedLessons, 0),
        };

        res.json({
            success: true,
            courses: validCourses,
            stats,
        });
    } catch (error) {
        console.error("Get Student Course Progress Error:", error);
        res.status(500).json({ message: "Failed to fetch course progress" });
    }
};

/* ======================================================
   GET SPECIFIC COURSE PROGRESS
====================================================== */
export const getCourseProgressById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Get enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: "PAID",
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Not enrolled in this course" });
        }

        // Get all lessons for this course
        const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });

        // Calculate progress
        const totalLessons = lessons.length;
        const completedLessons = enrollment.completedLessons || [];
        const completedLessonsCount = completedLessons.length;
        const progress = totalLessons > 0
            ? Math.round((completedLessonsCount / totalLessons) * 100)
            : 0;

        // Map lessons with completion status
        const lessonsWithStatus = lessons.map((lesson) => ({
            lessonId: lesson._id,
            title: lesson.title,
            date: lesson.date,
            time: lesson.time,
            duration: lesson.duration,
            meetLink: lesson.meetLink,
            isCompleted: completedLessons.some(
                (id) => id.toString() === lesson._id.toString()
            ),
            isCurrent:
                enrollment.currentLesson?.toString() === lesson._id.toString(),
        }));

        // Find next incomplete lesson
        const nextLesson = lessons.find(
            (lesson) =>
                !completedLessons.some((id) => id.toString() === lesson._id.toString())
        );

        res.json({
            success: true,
            course: {
                courseId: course._id,
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                duration: course.duration,
                level: course.level,
            },
            progress: {
                percentage: progress,
                completedLessons: completedLessonsCount,
                totalLessons,
                remainingLessons: totalLessons - completedLessonsCount,
            },
            status: enrollment.status,
            lastAccessedAt: enrollment.lastAccessedAt,
            completedAt: enrollment.completedAt,
            startedAt: enrollment.createdAt,
            totalTimeSpent: enrollment.totalTimeSpent || 0,
            lessons: lessonsWithStatus,
            nextLesson: nextLesson
                ? {
                    lessonId: nextLesson._id,
                    title: nextLesson.title,
                    date: nextLesson.date,
                    time: nextLesson.time,
                }
                : null,
        });
    } catch (error) {
        console.error("Get Course Progress By ID Error:", error);
        res.status(500).json({ message: "Failed to fetch course progress" });
    }
};

/* ======================================================
   MARK LESSON AS COMPLETE
====================================================== */
export const markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const studentId = req.user.id;
        const { timeSpent } = req.body; // optional - time spent on lesson in minutes

        // Validate course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Validate lesson
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Get enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: "PAID",
        });

        if (!enrollment) {
            return res.status(403).json({ message: "Not enrolled in this course" });
        }

        // Check if lesson already completed
        const isAlreadyCompleted = enrollment.completedLessons.some(
            (id) => id.toString() === lessonId
        );

        if (isAlreadyCompleted) {
            return res.status(400).json({
                success: false,
                message: "Lesson already completed",
                progress: enrollment.progress,
            });
        }

        // Add lesson to completed lessons
        enrollment.completedLessons.push(lessonId);
        enrollment.lastAccessedAt = new Date();

        // Update total time spent if provided
        if (timeSpent && typeof timeSpent === "number") {
            enrollment.totalTimeSpent = (enrollment.totalTimeSpent || 0) + timeSpent;
        }

        // Calculate new progress
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const progress = Math.round(
            (enrollment.completedLessons.length / totalLessons) * 100
        );

        enrollment.progress = progress;

        // Set current lesson to next incomplete lesson
        const nextLesson = await Lesson.findOne({
            course: courseId,
            _id: { $nin: enrollment.completedLessons },
        }).sort({ createdAt: 1 });

        enrollment.currentLesson = nextLesson?._id || null;

        // If all lessons completed, mark course as completed
        if (progress === 100) {
            enrollment.status = "COMPLETED";
            enrollment.completedAt = new Date();
        }

        await enrollment.save();

        res.json({
            success: true,
            message: "Lesson marked as completed",
            progress,
            completedLessons: enrollment.completedLessons.length,
            totalLessons,
            isCompleted: progress === 100,
            courseCompletedAt: enrollment.completedAt,
        });
    } catch (error) {
        console.error("Mark Lesson Complete Error:", error);
        res.status(500).json({ message: "Failed to mark lesson as complete" });
    }
};

/* ======================================================
   UNMARK LESSON AS COMPLETE
====================================================== */
export const unmarkLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const studentId = req.user.id;

        // Get enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: "PAID",
        });

        if (!enrollment) {
            return res.status(403).json({ message: "Not enrolled in this course" });
        }

        // Remove lesson from completed lessons
        const initialLength = enrollment.completedLessons.length;
        enrollment.completedLessons = enrollment.completedLessons.filter(
            (id) => id.toString() !== lessonId
        );

        if (enrollment.completedLessons.length === initialLength) {
            return res.status(400).json({
                success: false,
                message: "Lesson was not marked as completed",
            });
        }

        enrollment.lastAccessedAt = new Date();

        // Calculate new progress
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const progress = Math.round(
            (enrollment.completedLessons.length / totalLessons) * 100
        );

        enrollment.progress = progress;

        // If course was completed, reset status
        if (enrollment.status === "COMPLETED") {
            enrollment.status = "ACTIVE";
            enrollment.completedAt = null;
        }

        await enrollment.save();

        res.json({
            success: true,
            message: "Lesson unmarked as completed",
            progress,
            completedLessons: enrollment.completedLessons.length,
            totalLessons,
        });
    } catch (error) {
        console.error("Unmark Lesson Complete Error:", error);
        res.status(500).json({ message: "Failed to unmark lesson" });
    }
};

/* ======================================================
   UPDATE COURSE STATUS (Pause/Resume)
====================================================== */
export const updateCourseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status } = req.body; // ACTIVE, PAUSED, COMPLETED
        const studentId = req.user.id;

        // Validate status
        if (!["ACTIVE", "PAUSED", "COMPLETED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            paymentStatus: "PAID",
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Not enrolled in this course" });
        }

        enrollment.status = status;
        
        if (status === "COMPLETED") {
            enrollment.completedAt = new Date();
            // Calculate final progress
            const totalLessons = await Lesson.countDocuments({ course: courseId });
            enrollment.progress = Math.round(
                (enrollment.completedLessons.length / totalLessons) * 100
            );
        }

        await enrollment.save();

        res.json({
            success: true,
            message: `Course ${status.toLowerCase()}`,
            status: enrollment.status,
            progress: enrollment.progress,
        });
    } catch (error) {
        console.error("Update Course Status Error:", error);
        res.status(500).json({ message: "Failed to update course status" });
    }
};

/* ======================================================
   GET COURSE STATS (for dashboard)
====================================================== */
export const getCourseStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get all enrollments
        const enrollments = await Enrollment.find({
            student: studentId,
            paymentStatus: "PAID",
        })
            .populate("course", "title")
            .sort({ lastAccessedAt: -1 });

        const totalCourses = enrollments.length;
        const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
        const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE").length;

        const totalLessonsCompleted = enrollments.reduce(
            (sum, e) => sum + (e.completedLessons?.length || 0),
            0
        );

        const totalTimeSpent = enrollments.reduce(
            (sum, e) => sum + (e.totalTimeSpent || 0),
            0
        );

        const averageProgress = totalCourses > 0
            ? Math.round(
                enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalCourses
            )
            : 0;

        // Get recent activity (last 5 completed lessons)
        const recentActivity = enrollments
            .filter((e) => e.completedLessons && e.completedLessons.length > 0)
            .flatMap((e) =>
                (e.completedLessons || []).slice(-3).map((lessonId) => ({
                    courseId: e.course._id,
                    courseTitle: e.course.title,
                    lessonId,
                    completedAt: e.updatedAt,
                }))
            )
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalCourses,
                completedCourses,
                inProgressCourses,
                totalLessonsCompleted,
                totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to hours
                averageProgress,
            },
            recentActivity,
        });
    } catch (error) {
        console.error("Get Course Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch course stats" });
    }
};

