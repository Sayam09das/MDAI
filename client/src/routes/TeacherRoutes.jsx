import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import TeacherLayout from "../components/Dashboard/Teacher/TeacherLayout";
import PageLoader from "../components/common/PageLoader";
import TeacherProtectedRoute from "../ProtectedRoute/TeacherProtectedRoute";

import ReturneacherLiveSessions from "../Pages/teacher/Dashboard/MaineacherLiveSessions/ReturneacherLiveSessions";
import ReturnEnrolledStudents from "../Pages/teacher/Dashboard/MainEnrolledStudents/ReturnEnrolledStudents";
import ReturnStudentAttendance from "../Pages/teacher/Dashboard/MainAttendance/ReturnStudentAttendance";
import ReturnTeacherCalendar from "../Pages/teacher/Dashboard/MainTeacherCalendar/ReturnTeacherCalendar";
import ReturnTeacherprofile from "../Pages/teacher/Dashboard/TeacherProfile/ReturnTeacherprofile";
import ReturnTeacherSettings from "../Pages/teacher/Dashboard/MainTeacherSettings/ReturnTeacherSettings";
import ReturnTeacherFinance from "../Pages/teacher/Dashboard/MainTeacherFinance/ReturnTeacherFinance";
import ReturnTeacherResources from "../Pages/teacher/Dashboard/MainResources/ReturnTeacherResources";
import ReturnSearch from "../Pages/teacher/Dashboard/MainSearch/ReturnSearch";

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


const TeacherRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route
                    path="/teacher-dashboard"
                    element={
                        <TeacherProtectedRoute>
                            <TeacherLayout />
                        </TeacherProtectedRoute>
                    }
                >
                    <Route index element={<ReturnDashboard />} />
                    <Route path="mycourse" element={<ReturnCoursedashboard />} />
                    <Route path="create-course" element={<ReturnCreateCourse />} />
                    <Route path="resources" element={< ReturnTeacherResources />} />
                    <Route path="live-sessions" element={<ReturneacherLiveSessions />} />
                    <Route path="students" element={<ReturnEnrolledStudents />} />
                    <Route path="attendance" element={<ReturnStudentAttendance />} />
                    <Route path="calendar" element={<ReturnTeacherCalendar />} />
                    <Route path="profile" element={<ReturnTeacherprofile />} />
                    <Route path="settings" element={<ReturnTeacherSettings />} />
                    <Route path="finance" element={<ReturnTeacherFinance />} />
                    <Route path="search" element={<ReturnSearch />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default TeacherRoutes;
