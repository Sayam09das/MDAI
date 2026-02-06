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
import ReturnSPayment from "../Dashboard/StudentEnrollment/ReturnSPayment";
import ReturnSettings from "../Dashboard/DashboardSettings/ReturnSettings";
import ReturnCourses from "../Dashboard/DashboardCourses/ReturnCourses";
import CourseEditor from "../Dashboard/DashboardCourses/CourseEditor";
import CourseAnalytics from "../Dashboard/DashboardCourses/CourseAnalytics";
import ReturnResources from "../Dashboard/DashboardResources/ReturnResources";
import UploadResource from "../Dashboard/DashboardResources/UploadResource";
import ResourceCategories from "../Dashboard/DashboardResources/ResourceCategories";
import ReturnAnnouncements from "../Dashboard/DashboardAnnouncements/ReturnAnnouncements";
import ReturnReports from "../Dashboard/DashboardReports/ReturnReports";
import ReturnAuditLogs from "../Dashboard/DashboardAuditLogs/ReturnAuditLogs";
import ReturnSystem from "../Dashboard/DashboardSystem/ReturnSystem";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<ReturnDashboard />} />
                    <Route path="dashboard/user" element={<ReturnDashboardUser />} />
                    <Route path="dashboard/students" element={<ReturnDashboardStudent />} />
                    <Route path="dashboard/teachers" element={<TeacherAnalytics />} />
                    <Route path="dashboard/teacherlist" element={<TeacherList />} />
                    <Route path="dashboard/create/teacher" element={<CreateTeacher />} />
                    <Route path="dashboard/studentlist" element={<StudentListPreview />} />
                    <Route path="dashboard/students/paymentaccess" element={<ReturnSPayment />} />
                    
                    {/* Settings */}
                    <Route path="dashboard/settings" element={<ReturnSettings />} />
                    
                    {/* Courses */}
                    <Route path="dashboard/courses" element={<ReturnCourses />} />
                    <Route path="dashboard/courses/new" element={<CourseEditor />} />
                    <Route path="dashboard/courses/:id" element={<CourseEditor />} />
                    <Route path="dashboard/courses/analytics" element={<CourseAnalytics />} />
                    
                    {/* Resources */}
                    <Route path="dashboard/resources" element={<ReturnResources />} />
                    <Route path="dashboard/resources/upload" element={<UploadResource />} />
                    <Route path="dashboard/resources/categories" element={<ResourceCategories />} />
                    
                    {/* Announcements */}
                    <Route path="dashboard/announcements" element={<ReturnAnnouncements />} />
                    
                    {/* Reports */}
                    <Route path="dashboard/reports" element={<ReturnReports />} />
                    
                    {/* Audit Logs */}
                    <Route path="dashboard/audit-logs" element={<ReturnAuditLogs />} />
                    
                    {/* System */}
                    <Route path="dashboard/system" element={<ReturnSystem />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;

