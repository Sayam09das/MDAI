import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../pages/DashboardLayout";
import ReturnDashboard from "../Dashboard/DashboardMain/ReturnDashboard";
import DashboardOverview from "../Dashboard/DashboardMain/DashboardOverview";
import ActivityOverview from "../Dashboard/DashboardMain/ActivityOverview";
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
import AnnouncementList from "../Dashboard/DashboardAnnouncements/AnnouncementList";
import ReturnAnnouncements from "../Dashboard/DashboardAnnouncements/ReturnAnnouncements";
import ReturnReports from "../Dashboard/DashboardReports/ReturnReports";
import AuditLogList from "../Dashboard/DashboardAuditLogs/AuditLogList";
import ReturnAuditLogs from "../Dashboard/DashboardAuditLogs/ReturnAuditLogs";
import SystemHealth from "../Dashboard/DashboardSystem/SystemHealth";
import ReturnSystem from "../Dashboard/DashboardSystem/ReturnSystem";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    {/* Dashboard */}
                    <Route path="dashboard" element={<DashboardOverview />} />
                    <Route path="dashboard/activity" element={<ActivityOverview />} />
                    
                    {/* Users */}
                    <Route path="dashboard/user" element={<ReturnDashboardUser />} />
                    <Route path="dashboard/students" element={<ReturnDashboardStudent />} />
                    <Route path="dashboard/studentlist" element={<StudentListPreview />} />
                    <Route path="dashboard/students/paymentaccess" element={<ReturnSPayment />} />
                    
                    {/* Teachers */}
                    <Route path="dashboard/teachers" element={<TeacherAnalytics />} />
                    <Route path="dashboard/teacherlist" element={<TeacherList />} />
                    <Route path="dashboard/create/teacher" element={<CreateTeacher />} />
                    
                    {/* Settings */}
                    <Route path="dashboard/settings" element={<ReturnSettings />} />
                    
                    {/* Courses */}
                    <Route path="dashboard/courses" element={<ReturnCourses />} />
                    <Route path="dashboard/courses/new" element={<CourseEditor />} />
                    <Route path="dashboard/courses/:id" element={<CourseEditor />} />
                    <Route path="dashboard/courses/analytics" element={<CourseAnalytics />} />
                    
                    {/* Announcements */}
                    <Route path="dashboard/announcements" element={<AnnouncementList />} />
                    
                    {/* Reports */}
                    <Route path="dashboard/reports" element={<ReturnReports />} />
                    
                    {/* Audit Logs */}
                    <Route path="dashboard/audit-logs" element={<AuditLogList />} />
                    
                    {/* System */}
                    <Route path="dashboard/system" element={<SystemHealth />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;

