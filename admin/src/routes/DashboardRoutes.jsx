import React from 'react'
import { Routes, Route } from "react-router-dom";
import ReturnDashboard from '../Dashboard/DashboardMain/ReturnDashboard'
import DashboardLayout from '../pages/DashboardLayout';
const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<ReturnDashboard />} />
            </Route>
        </Routes>
    )
}

export default DashboardRoutes