import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import StudentLayout from "../components/Dashboard/Student/StudentLayout";
import PageLoader from "../components/common/PageLoader";
import StudentProtectedRoute from "../ProtectedRoute/StudentProtectedRoute";

import ReturnStudentMain from "../Pages/Student/Dashboard/MainStudentStats/ReturnStudentMain";
import ReturnMyCourses from "../Pages/Student/Dashboard/MyCourses/ReturnMyCourses";
import ReturnCourseProgress from "../Pages/Student/Dashboard/CourseProgress/ReturnCourseProgress";
import StudentLiveClasses from "../Pages/Student/Dashboard/StudentLiveClasses/StudentLiveClasses";
import ReturnStudentResources from "../Pages/Student/Dashboard/StudentResources/ReturnStudentResources";
import ReturnAllCourse from "../Pages/Student/Dashboard/AllCourse/ReturnAllCourse";
import CourseView from "../Pages/Student/Dashboard/MyCourses/CourseView";
import ReturnStudentProfile from "../Pages/Student/Dashboard/StudentProfile/ReturnStudentProfile";
import ReturnAttendence from "../Pages/Student/Dashboard/StudentAttendence/ReturnAttendence";
import ReturnCalendar from "../Pages/Student/Dashboard/StudentCalendar/ReturnCalendar";
import ReturnSearch from "../Pages/Student/Dashboard/Search/ReturnSearch";
import ReturnStudentMessages from "../Pages/Student/Dashboard/Messages/ReturnStudentMessages";
import ReturnAnnouncements from "../Pages/Student/Dashboard/Announcements/ReturnAnnouncements";

const StudentRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route
                    path="/student-dashboard"
                    element={
                        <StudentProtectedRoute>
                            <StudentLayout />
                        </StudentProtectedRoute>
                    }
                >
                    <Route index element={<ReturnStudentMain />} />
                    <Route path="student-mycourse" element={<ReturnMyCourses />} />
                    <Route path="all-courses" element={<ReturnAllCourse />} />
                    <Route path="course-progress" element={<ReturnCourseProgress />} />
                    <Route path="student-live-classes/:courseId" element={<StudentLiveClasses />} />

                    {/* ✅ FIXED HERE */}
                    <Route path="course/:courseId" element={<CourseView />} />

                    <Route path="resources" element={<ReturnStudentResources />} />
                    <Route path="profile" element= {<ReturnStudentProfile />} />
                    <Route path="attendance" element={<ReturnAttendence />} />
                    <Route path="calendar" element={<ReturnCalendar />} />
                    <Route path="search" element={<ReturnSearch />} />
                    <Route path="messages" element={<ReturnStudentMessages />} />
                    <Route path="announcements" element={<ReturnAnnouncements />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default StudentRoutes;

