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
import PageLoader from "./components/common/PageLoader"
import ReturnStudentMain from "./Pages/Student/Dashboard/MainStudentStats/ReturnStudentMain"
import ReturnMyCourses from "./Pages/Student/Dashboard/MyCourses/ReturnMyCourses"
import ReturnCourseProgress from "./Pages/Student/Dashboard/CourseProgress/ReturnCourseProgress"
import StudentLiveClasses from "./Pages/Student/Dashboard/StudentLiveClasses/StudentLiveClasses"
import StudentPayments from "./Pages/Student/Dashboard/StudentPayments/StudentPayments"
import ReturnStudentResources from "./Pages/Student/Dashboard/StudentResources/ReturnStudentResources"
import ReturnStudentFinance from "./Pages/Student/Dashboard/StudentFinance/ReturnStudentFinance"
import ReturnAllCourse from "./Pages/Student/Dashboard/AllCourse/ReturnAllCourse"
import CourseView from "./Pages/Student/Dashboard/MyCourses/CourseView"
import ReturnStudentProfile from "./Pages/Student/Dashboard/StudentProfile/ReturnStudentProfile"
import ReturnAttendence from "./Pages/Student/Dashboard/StudentAttendence/ReturnAttendence"
import ReturnCalendar from "./Pages/Student/Dashboard/StudentCalendar/ReturnCalendar"
import ReturnSearch from "./Pages/Student/Dashboard/Search/ReturnSearch"
import ReturnStudentMessages from "./Pages/Student/Dashboard/Messages/ReturnStudentMessages"
import ReturnAnnouncements from "../Pages/Student/Dashboard/Announcements/ReturnAnnouncements";


// Payment Pages
import Payment from "./Pages/Student/Dashboard/CoursePayment/Payment"
import PaymentInfo from "./Pages/Student/Dashboard/CoursePayment/PaymentInfo"
import PaymentDemo from "./Pages/Student/Dashboard/CoursePayment/paymentdemo"
import PayLaterRequest from "./Pages/Student/Dashboard/CoursePayment/PayLaterRequest"

// Teacher Pages
import TeacherLayout from "./components/Dashboard/Teacher/TeacherLayout"
import ReturnDashboard from "./Pages/teacher/Dashboard/MainHeaderDashboard/ReturnDashboard"
import ReturnCoursedashboard from "./Pages/teacher/Dashboard/MainCoursesDashboard/ReturnCoursedashboard"
import ReturnCreateCourse from "./Pages/teacher/Dashboard/MainCreateCourseDashboard/ReturnCreateCourse"
import ReturneacherLiveSessions from "./Pages/teacher/Dashboard/MaineacherLiveSessions/ReturneacherLiveSessions"
import ReturnEnrolledStudents from "./Pages/teacher/Dashboard/MainEnrolledStudents/ReturnEnrolledStudents"
import ReturnStudentAttendance from "./Pages/teacher/Dashboard/MainAttendance/ReturnStudentAttendance"
import ReturnTeacherCalendar from "./Pages/teacher/Dashboard/MainTeacherCalendar/ReturnTeacherCalendar"
import ReturnTeacherprofile from "./Pages/teacher/Dashboard/TeacherProfile/ReturnTeacherprofile"
import ReturnTeacherSettings from "./Pages/teacher/Dashboard/MainTeacherSettings/ReturnTeacherSettings"
import ReturnTeacherFinance from "./Pages/teacher/Dashboard/MainTeacherFinance/ReturnTeacherFinance"
import ReturnTeacherResources from "./Pages/teacher/Dashboard/MainResources/ReturnTeacherResources"
import ReturnSearchTeacher from "./Pages/teacher/Dashboard/MainSearch/ReturnSearch"
import ReturnTeacherMessages from "./Pages/teacher/Dashboard/Messages/ReturnTeacherMessages"
import ReturnAnnouncements from "../Pages/teacher/Dashboard/Announcements/ReturnAnnouncements";


// Protected Routes
import PublicRoute from "./ProtectedRoute/PublicRoute"
import StudentProtectedRoute from "./ProtectedRoute/StudentProtectedRoute"
import TeacherProtectedRoute from "./ProtectedRoute/TeacherProtectedRoute"

// 404 Page
import NotFound from "./Pages/NotFound/NotFound"

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
          <Route path="student-payments" element={<StudentPayments />} />
          <Route path="resources" element={<ReturnStudentResources />} />
          <Route path="finance" element={<ReturnStudentFinance />} />
          <Route path="profile" element={<ReturnStudentProfile />} />
          <Route path="attendance" element={<ReturnAttendence />} />
          <Route path="calendar" element={<ReturnCalendar />} />
          <Route path="search" element={<ReturnSearch />} />
          <Route path="messages" element={<ReturnStudentMessages />} />
          <Route path="announcements" element={<ReturnAnnouncements />} />

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
          <Route path="create-course" element={<ReturnCreateCourse />} />
          <Route path="resources" element={<ReturnTeacherResources />} />
          <Route path="live-sessions" element={<ReturneacherLiveSessions />} />
          <Route path="students" element={<ReturnEnrolledStudents />} />
          <Route path="attendance" element={<ReturnStudentAttendance />} />
          <Route path="calendar" element={<ReturnTeacherCalendar />} />
          <Route path="profile" element={<ReturnTeacherprofile />} />
          <Route path="settings" element={<ReturnTeacherSettings />} />
          <Route path="finance" element={<ReturnTeacherFinance />} />
          <Route path="search" element={<ReturnSearchTeacher />} />
          <Route path="messages" element={<ReturnTeacherMessages />} />
          <Route path="announcements" element={<ReturnAnnouncements />} />

        </Route>

        {/* Payment Routes */}
        <Route
          path="/payment/:courseId"
          element={
            <StudentProtectedRoute>
              <Payment />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/payment-info/:courseId"
          element={
            <StudentProtectedRoute>
              <PaymentInfo />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/pay-later/:courseId"
          element={
            <StudentProtectedRoute>
              <PayLaterRequest />
            </StudentProtectedRoute>
          }
        />
        <Route path="/payment-demo" element={<PaymentDemo />} />

        {/* 404 - Catch-all route (MUST be last) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  )
}

export default App

