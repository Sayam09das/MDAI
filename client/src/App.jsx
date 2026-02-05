import React from "react"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Routes, Route } from "react-router-dom"
import MainRoutes from "./routes/MainRoutes"
import CourseRoutes from "./routes/CourseRoutes"
import AuthRoutes from "./routes/AuthRoutes"
import AboutRoutes from "./routes/AboutRoutes"
import ContactRoutes from "./routes/ContactRoutes"
import TeacherRoutes from "./routes/TeacherRoutes"
import StudentRoutes from "./routes/StudentRoutes"
import PaymentRoutes from "./routes/PaymentRoutes"
import NotFound from "./Pages/NotFound/NotFound"
import { SocketProvider } from "./context/SocketContext"

const App = () => {
  return (
    <SocketProvider>
      <ToastContainer />
      <MainRoutes />
      <CourseRoutes />
      <AboutRoutes />
      <ContactRoutes />
      <AuthRoutes />
      <TeacherRoutes />
      <StudentRoutes />
      <PaymentRoutes />
      
      {/* Catch-all route for 404 - must be at the end */}
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  )
}

export default App
