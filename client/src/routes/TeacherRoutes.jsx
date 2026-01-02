import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherLayout from "../components/Dashboard/Teacher/TeacherLayout";
import ReturnDashboard from "../Pages/teacher/Dashboard/MainHeaderDashboard/ReturnDashboard";


const TeacherRoutes = () => {
    return (
        <Routes>
            <Route path="/teacher-dashboard" element={<TeacherLayout />}>
                <Route index element={<ReturnDashboard />} />
            </Route>
        </Routes>
    );
};

export default TeacherRoutes;
