import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../components/Dashboard/Student/StudentLayout";
import PageLoader from "../components/common/PageLoader";
import StudentProtectedRoute from "../ProtectedRoute/StudentProtectedRoute";

import ReturnStudentStats from "../Pages/Student/Dashboard/MainStudentStats/ReturnStudentStats";
import ReturnMyCourses from "../Pages/Student/Dashboard/MyCourses/ReturnMyCourses";
import ReturnCourseProgress from "../Pages/Student/Dashboard/CourseProgress/ReturnCourseProgress";
import StudentLiveClasses from "../Pages/Student/Dashboard/StudentLiveClasses/StudentLiveClasses";
import StudentPayments from "../Pages/Student/Dashboard/StudentPayments/StudentPayments";
import ReturnStudentResources from "../Pages/Student/Dashboard/StudentResources/ReturnStudentResources";

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
                    {/* DEFAULT PAGE */}
                    <Route index element={<ReturnStudentStats />} />

                    {/* MY COURSES PAGE */}
                    <Route path="student-mycourse" element={<ReturnMyCourses />} />
                    <Route path="course-progress" element={<ReturnCourseProgress />} />
                    <Route path="student-live-classes" element={<StudentLiveClasses />} />
                    <Route path="student-payments" element={<StudentPayments />} />
                    <Route path="resources" element={<ReturnStudentResources />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default StudentRoutes;
