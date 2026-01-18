import React from "react"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MainRoutes from "./routes/MainRoutes"
import CourseRoutes from "./routes/CourseRoutes"
import AuthRoutes from "./routes/AuthRoutes"
import AboutRoutes from "./routes/AboutRoutes"
import ContactRoutes from "./routes/ContactRoutes"
import TeacherRoutes from "./routes/TeacherRoutes"
import StudentRoutes from "./routes/StudentRoutes"
import PaymentRoutes from "./routes/PaymentRoutes"
import AdminRoutes from "./routes/AdminRoutes"

const App = () => {
  return (
    <>
      <ToastContainer />
      <MainRoutes />
      <CourseRoutes />
      <AboutRoutes />
      <ContactRoutes />
      <AuthRoutes />
      <TeacherRoutes />
      <StudentRoutes />
      <PaymentRoutes />
      <AdminRoutes />
    </>
  )
}

export default App
