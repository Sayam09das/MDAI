import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherLayout from "../components/Dashboard/Teacher/TeacherLayout";
import ReturnDashboard from "../Pages/teacher/Dashboard/MainHeaderDashboard/ReturnDashboard";
import TeacherCourses from "../Pages/teacher/Dashboard/MainCoursesDashboard/TeacherCourses";
import ReturnCreateCourse from "../Pages/teacher/Dashboard/MainCreateCourseDashboard/ReturnCreateCourse";
import ReturnLessonManager from "../Pages/teacher/Dashboard/MainLessonManager/ReturnLessonManager";

const TeacherRoutes = () => {
    return (
        <Routes>
            <Route path="/teacher-dashboard" element={<TeacherLayout />}>
                <Route index element={<ReturnDashboard />} />
                <Route path="mycourse" element={<TeacherCourses />} />
                <Route path="create-course" element={<ReturnCreateCourse />} />
                <Route path="lessons" element={<ReturnLessonManager />} />
            </Route>
        </Routes>
    );
};

export default TeacherRoutes;
