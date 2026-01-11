import React from "react"
import "./App.css"
import { BACKEND_URL } from "./config/api";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MainRoutes from "./routes/MainRoutes"
import CourseRoutes from "./routes/CourseRoutes"
import AuthRoutes from "./routes/AuthRoutes"
import AboutRoutes from "./routes/AboutRoutes"
import ContactRoutes from "./routes/ContactRoutes"
import TeacherRoutes from "./routes/TeacherRoutes"
import StudentRoutes from "./routes/StudentRoutes"




const App = () => {
  useEffect(() => {
    fetch(`${BACKEND_URL}/ping`).catch(() => { });
  }, []);

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
    </>
  )
}

export default App
