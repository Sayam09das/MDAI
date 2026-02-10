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
import ReturnTeacherResources from "../Pages/teacher/Dashboard/MainResources/ReturnTeacherResources";
import ReturnSearch from "../Pages/teacher/Dashboard/MainSearch/ReturnSearch";
import TeacherMessages from "../Pages/teacher/Dashboard/Messages/TeacherMessages";
import ReturnAnnouncements from "../Pages/teacher/Dashboard/Announcements/ReturnAnnouncements";
import ReturnTeacherFinance from "../Pages/teacher/Dashboard/MainTeacherFinance/ReturnTeacherFinance";
import TeacherComplaints from "../Pages/teacher/Dashboard/Complaints/TeacherComplaints";
import ReturnTeacherAssignments from "../Pages/teacher/Dashboard/MainAssignments/ReturnTeacherAssignments";
import CreateAssignment from "../Pages/teacher/Dashboard/CreateAssignment/CreateAssignment";
import GradeSubmission from "../Pages/teacher/Dashboard/AssignmentSubmissions/GradeSubmission";
import AssignmentDetail from "../Pages/teacher/Dashboard/AssignmentDetail/AssignmentDetail";
import EditAssignment from "../Pages/teacher/Dashboard/EditAssignment/EditAssignment";
import AssignmentAnalytics from "../Pages/teacher/Dashboard/AssignmentAnalytics/AssignmentAnalytics";
import EditCourse from "../Pages/teacher/Dashboard/MainCoursesDashboard/EditCourse";

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
                    <Route path="edit-course/:courseId" element={<EditCourse />} />
                    <Route path="resources" element={< ReturnTeacherResources />} />
                    <Route path="live-sessions" element={<ReturneacherLiveSessions />} />
                    <Route path="students" element={<ReturnEnrolledStudents />} />
                    <Route path="attendance" element={<ReturnStudentAttendance />} />
                    <Route path="calendar" element={<ReturnTeacherCalendar />} />
                    <Route path="profile" element={<ReturnTeacherprofile />} />
                    <Route path="settings" element={<ReturnTeacherSettings />} />
                    <Route path="search" element={<ReturnSearch />} />
                    <Route path="messages" element={<TeacherMessages />} />
                    <Route path="announcements" element={<ReturnAnnouncements />} />
                    <Route path="finance" element={<ReturnTeacherFinance />} />
                    <Route path="complaints" element={<TeacherComplaints />} />
                    <Route path="assignments" element={<ReturnTeacherAssignments />} />
                    <Route path="create-assignment" element={<CreateAssignment />} />
                    <Route path="assignments/:assignmentId/detail" element={<AssignmentDetail />} />
                    <Route path="assignments/:assignmentId/edit" element={<EditAssignment />} />
                    <Route path="assignments/:assignmentId/submissions" element={<GradeSubmission />} />
                    <Route path="assignments/:assignmentId/analytics" element={<AssignmentAnalytics />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default TeacherRoutes;
