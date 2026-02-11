import React from "react"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Routes, Route } from "react-router-dom"
import { SocketProvider } from "./context/SocketContext"

// Main Layout Pages
import MainLayout from "./layouts/MainLayout"
import ReturnMainPages from "./Main/Mainpages/returnMainpages"
import ReturnCoursepage from "./Main/CoursePage/ReturnCoursepage"
import ReturnAboutpage from "./Main/AboutPage/ReturnAboutpage"
import ReturnContactpage from "./Main/ContactPage/ReturnContactpage"

// Auth Pages
import Registration from "./Auth/Registration"
import Login from "./Auth/Login"

// Student Pages
import StudentLayout from "./components/Dashboard/Student/StudentLayout"
import ReturnStudentMain from "./Pages/Student/Dashboard/MainStudentStats/ReturnStudentMain"
import ReturnMyCourses from "./Pages/Student/Dashboard/MyCourses/ReturnMyCourses"
import ReturnCourseProgress from "./Pages/Student/Dashboard/CourseProgress/ReturnCourseProgress"
import StudentLiveClasses from "./Pages/Student/Dashboard/StudentLiveClasses/StudentLiveClasses"
import ReturnStudentResources from "./Pages/Student/Dashboard/StudentResources/ReturnStudentResources"
import ReturnAllCourse from "./Pages/Student/Dashboard/AllCourse/ReturnAllCourse"
import CourseView from "./Pages/Student/Dashboard/MyCourses/CourseView"
import ReturnStudentProfile from "./Pages/Student/Dashboard/StudentProfile/ReturnStudentProfile"
import ReturnAttendence from "./Pages/Student/Dashboard/StudentAttendence/ReturnAttendence"
import ReturnCalendar from "./Pages/Student/Dashboard/StudentCalendar/ReturnCalendar"
import ReturnSearch from "./Pages/Student/Dashboard/Search/ReturnSearch"
import ReturnStudentMessages from "./Pages/Student/Dashboard/Messages/ReturnStudentMessages"
import StudentAnnouncements from "./Pages/Student/Dashboard/Announcements/ReturnAnnouncements"
import ReturnStudentPayments from "./Pages/Student/Dashboard/StudentPayments/ReturnStudentPayments"
import StudentPaymentPage from "./Pages/Student/Dashboard/StudentPayments/StudentPaymentPage"

// Exam Page
import ExamPage from "./Pages/Student/Exam/ExamPage"

// Teacher Pages
import TeacherLayout from "./components/Dashboard/Teacher/TeacherLayout"
import ReturnDashboard from "./Pages/teacher/Dashboard/MainHeaderDashboard/ReturnDashboard"
import ReturnCoursedashboard from "./Pages/teacher/Dashboard/MainCoursesDashboard/ReturnCoursedashboard"
import ReturnCreateCourse from "./Pages/teacher/Dashboard/MainCreateCourseDashboard/ReturnCreateCourse"
import EditCourse from "./Pages/teacher/Dashboard/MainCoursesDashboard/EditCourse"
import TeacherCourseView from "./Pages/teacher/Dashboard/MainCoursesDashboard/TeacherCourseView"
import ReturneacherLiveSessions from "./Pages/teacher/Dashboard/MaineacherLiveSessions/ReturneacherLiveSessions"
import ReturnEnrolledStudents from "./Pages/teacher/Dashboard/MainEnrolledStudents/ReturnEnrolledStudents"
import ReturnStudentAttendance from "./Pages/teacher/Dashboard/MainAttendance/ReturnStudentAttendance"
import ReturnTeacherCalendar from "./Pages/teacher/Dashboard/MainTeacherCalendar/ReturnTeacherCalendar"
import ReturnTeacherprofile from "./Pages/teacher/Dashboard/TeacherProfile/ReturnTeacherprofile"
import ReturnTeacherSettings from "./Pages/teacher/Dashboard/MainTeacherSettings/ReturnTeacherSettings"
import ReturnTeacherResources from "./Pages/teacher/Dashboard/MainResources/ReturnTeacherResources"
import ReturnSearchTeacher from "./Pages/teacher/Dashboard/MainSearch/ReturnSearch"
import ReturnTeacherMessages from "./Pages/teacher/Dashboard/Messages/ReturnTeacherMessages"
import TeacherAnnouncements from "./Pages/teacher/Dashboard/Announcements/ReturnAnnouncements"
import ReturnTeacherFinance from "./Pages/teacher/Dashboard/MainTeacherFinance/ReturnTeacherFinance"

// Assignment Pages
import AssignmentDetail from "./Pages/teacher/Dashboard/AssignmentDetail/AssignmentDetail"
import EditAssignment from "./Pages/teacher/Dashboard/EditAssignment/EditAssignment"
import GradeSubmission from "./Pages/teacher/Dashboard/AssignmentSubmissions/GradeSubmission"
import AssignmentAnalytics from "./Pages/teacher/Dashboard/AssignmentAnalytics/AssignmentAnalytics"
import ReturnTeacherExams from "./Pages/teacher/Dashboard/TeacherExams/ReturnTeacherExams"
import CreateExam from "./Pages/teacher/Dashboard/CreateExam/CreateExam"

// Protected Routes
import PublicRoute from "./ProtectedRoute/PublicRoute"
import StudentProtectedRoute from "./ProtectedRoute/StudentProtectedRoute"
import TeacherProtectedRoute from "./ProtectedRoute/TeacherProtectedRoute"

// 404 Page
import NotFound from "./Pages/NotFound/NotFound"

// Payment Routes
import PaymentRoutes from "./routes/PaymentRoutes"
import StudentComplaints from "./Pages/Student/Dashboard/Complaints/StudentComplaints"
import TeacherComplaints from "./Pages/teacher/Dashboard/Complaints/TeacherComplaints"
import ReturnStudentAssignments from "./Pages/Student/Dashboard/StudentAssignments/ReturnStudentAssignments"
import ReturnTeacherAssignments from "./Pages/teacher/Dashboard/MainAssignments/ReturnTeacherAssignments"
import CreateAssignment from "./Pages/teacher/Dashboard/CreateAssignment/CreateAssignment"
import SubmitAssignment from "./Pages/Student/Dashboard/SubmitAssignment/SubmitAssignment"
import SubmissionDetail from "./Pages/Student/Dashboard/SubmissionDetail/SubmissionDetail"

const App = () => {
  return (
    <SocketProvider>
      <ToastContainer />
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PublicRoute>
                <ReturnMainPages />
              </PublicRoute>
            }
          />
          <Route path="/courses" element={<ReturnCoursepage />} />
          <Route path="/about" element={<ReturnAboutpage />} />
          <Route path="/contact" element={<ReturnContactpage />} />
        </Route>

        {/* Auth Routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <StudentProtectedRoute>
              <StudentLayout />
            </StudentProtectedRoute>
          }
        >
          <Route index element={<ReturnStudentMain />} />
          <Route path="student-mycourse" element={<ReturnMyCourses />} />
          <Route path="all-courses" element={<ReturnAllCourse />} />
          <Route path="course-progress" element={<ReturnCourseProgress />} />
          <Route path="student-live-classes/:courseId" element={<StudentLiveClasses />} />
          <Route path="course/:courseId" element={<CourseView />} />
          <Route path="resources" element={<ReturnStudentResources />} />
          <Route path="profile" element={<ReturnStudentProfile />} />
          <Route path="attendance" element={<ReturnAttendence />} />
          <Route path="calendar" element={<ReturnCalendar />} />
          <Route path="search" element={<ReturnSearch />} />
          <Route path="messages" element={<ReturnStudentMessages />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="payments" element={<ReturnStudentPayments />} />
          <Route path="payment/:enrollmentId" element={<StudentPaymentPage />} />
          <Route path="complaints" element={<StudentComplaints />} />
          <Route path="assignments" element={<ReturnStudentAssignments />} />
          <Route path="assignments/:assignmentId/submit" element={<SubmitAssignment />} />
          <Route path="assignments/:assignmentId/detail" element={<SubmissionDetail />} />
          
          {/* Exam Route - Protected by StudentProtectedRoute */}
          <Route path="exam/:assignmentId" element={<ExamPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher-dashboard"
          element={
            <TeacherProtectedRoute>
              <TeacherLayout />
            </TeacherProtectedRoute>
          }
        >
          <Route index element={<ReturnDashboard />} />
          <Route path="mycourse" element={<ReturnCoursedashboard />} />
          <Route path="course/:courseId" element={<TeacherCourseView />} />
          <Route path="create-course" element={<ReturnCreateCourse />} />
          <Route path="edit-course/:courseId" element={<EditCourse />} />
          <Route path="resources" element={<ReturnTeacherResources />} />
          <Route path="live-sessions" element={<ReturneacherLiveSessions />} />
          <Route path="students" element={<ReturnEnrolledStudents />} />
          <Route path="attendance" element={<ReturnStudentAttendance />} />
          <Route path="calendar" element={<ReturnTeacherCalendar />} />
          <Route path="profile" element={<ReturnTeacherprofile />} />
          <Route path="settings" element={<ReturnTeacherSettings />} />
          <Route path="search" element={<ReturnSearchTeacher />} />
          <Route path="messages" element={<ReturnTeacherMessages />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="finance" element={<ReturnTeacherFinance />} />
          <Route path="complaints" element={<TeacherComplaints />} />
          <Route path="assignments" element={<ReturnTeacherAssignments />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="assignments/:assignmentId/detail" element={<AssignmentDetail />} />
          <Route path="assignments/:assignmentId/edit" element={<EditAssignment />} />
          <Route path="assignments/:assignmentId/submissions" element={<GradeSubmission />} />
          <Route path="assignments/:assignmentId/analytics" element={<AssignmentAnalytics />} />
          
          {/* Exam Management Route */}
          <Route path="exams" element={<ReturnTeacherExams />} />
          <Route path="create-exam" element={<CreateExam />} />
        </Route>

        {/* Payment Routes - Specific paths only */}
        <Route path="/payment/*" element={<PaymentRoutes />} />

        {/* 404 - Catch-all route (MUST be last) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  )
}

export default App
