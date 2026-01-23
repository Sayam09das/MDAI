import React from 'react'
import { Routes, Route } from "react-router-dom";
import ReturnDashboard from '../Dashboard/DashboardMain/ReturnDashboard'
import DashboardLayout from '../pages/DashboardLayout';
import ProtectedRoute from "./ProtectedRoute";

const DashboardRoutes = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<ReturnDashboard />} />
            </Route>
        </Routes>
    )
}

export default DashboardRoutes