import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../pages/DashboardLayout";
import ReturnDashboard from "../Dashboard/DashboardMain/ReturnDashboard";
import ReturnDashboardUser from "../Dashboard/DashboardUser/ReturnDashboardUser";
import ProtectedRoute from "./ProtectedRoute";
import ReturnDashboardStudent from "../Dashboard/DashboardStudent/ReturnDashboardStudent";
import ReturnDashboardTeacher from "../Dashboard/DashboardTeacher/ReturnDashboardTeacher";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<ReturnDashboard />} />
                    <Route path="dashboard/user" element={<ReturnDashboardUser />} />
                    <Route path="dashboard/students" element={<ReturnDashboardStudent />} />
                    <Route path="dashboard/teachers" element={<ReturnDashboardTeacher />} />
                    <Route path="dashboard/courses" element={<div>Courses Page</div>} />
                    <Route path="dashboard/analytics" element={<div>Analytics Page</div>} />
                    <Route path="dashboard/settings" element={<div>Settings Page</div>} />
                </Route>
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;
