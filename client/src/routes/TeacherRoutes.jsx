import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import TeacherLayout from "../components/Dashboard/Teacher/TeacherLayout";
import PageLoader from "../components/common/PageLoader";
import ReturneacherLiveSessions from "../Pages/teacher/Dashboard/MaineacherLiveSessions/ReturneacherLiveSessions";
import ReturnEnrolledStudents from "../Pages/teacher/Dashboard/MainEnrolledStudents/ReturnEnrolledStudents";

// 🔥 Lazy imports
const ReturnDashboard = lazy(() =>
    import("../Pages/teacher/Dashboard/MainHeaderDashboard/ReturnDashboard")
);
const ReturnCoursedashboard = lazy(() =>
    import("../Pages/teacher/Dashboard/MainCoursesDashboard/ReturnCoursedashboard")
);
const ReturnCreateCourse = lazy(() =>
    import("../Pages/teacher/Dashboard/MainCreateCourseDashboard/ReturnCreateCourse")
);
const ReturnLessonManager = lazy(() =>
    import("../Pages/teacher/Dashboard/MainLessonManager/ReturnLessonManager")
);

const TeacherRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/teacher-dashboard" element={<TeacherLayout />}>
                    <Route index element={<ReturnDashboard />} />
                    <Route path="mycourse" element={<ReturnCoursedashboard />} />
                    <Route path="create-course" element={<ReturnCreateCourse />} />
                    <Route path="lessons" element={<ReturnLessonManager />} />
                    <Route path="live-sessions" element={<ReturneacherLiveSessions />} />
                    <Route path="students" element={<ReturnEnrolledStudents />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default TeacherRoutes;
