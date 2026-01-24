import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../pages/DashboardLayout";
import ReturnDashboard from "../Dashboard/DashboardMain/ReturnDashboard";
import ReturnDashboardUser from "../Dashboard/DashboardUser/ReturnDashboardUser";
import ProtectedRoute from "./ProtectedRoute";
import ReturnDashboardStudent from "../Dashboard/DashboardStudent/ReturnDashboardStudent";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<ReturnDashboard />} />
                    <Route path="dashboard/user" element={<ReturnDashboardUser />} />
                    <Route path="dashboard/students" element={<ReturnDashboardStudent />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;
