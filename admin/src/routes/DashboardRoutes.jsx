import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../pages/DashboardLayout";
import ReturnDashboard from "../Dashboard/DashboardMain/ReturnDashboard";
import ReturnDashboardUser from "../Dashboard/DashboardUser/ReturnDashboardUser";
import ProtectedRoute from "./ProtectedRoute";
import ReturnDashboardStudent from "../Dashboard/DashboardStudent/ReturnDashboardStudent";
import TeacherAnalytics from "../Dashboard/DashboardTeacher/TeacherAnalytics";
import TeacherList from "../Dashboard/DashboardTeacher/TeacherList";
import CreateTeacher from "../Dashboard/DashboardTeacher/CreateTeacher";
import StudentListPreview from "../Dashboard/DashboardStudent/StudentListPreview";
import ReturnStudentPaymentAccess from "../Dashboard/StudentEnrollment/ReturnStudentPaymentAccess.jsx";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<ReturnDashboard />} />
                    <Route path="dashboard/user" element={<ReturnDashboardUser />} />
                    <Route path="dashboard/students" element={<ReturnDashboardStudent />} />
                    <Route path="dashboard/teachers" element={< TeacherAnalytics/>} />
                    <Route path="dashboard/teacherlist" element={<TeacherList />} />
                    <Route path="dashboard/create/teacher" element={<CreateTeacher />} />
                    <Route path="dashboard/studentlist" element={<StudentListPreview />} />
                    <Route path="dashboard/students/paymentaccess" element={<ReturnStudentPaymentAccess />} />
                    <Route path="dashboard/settings" element={<div>Settings Page</div>} />
                </Route>
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;
