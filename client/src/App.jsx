import React from "react"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MainRoutes from "./routes/MainRoutes"
import CourseRoutes from "./routes/CourseRoutes"
import AuthRoutes from "./routes/AuthRoutes"

const App = () => {
  return (
    <>
     <ToastContainer />
      <MainRoutes />
      <CourseRoutes />
      <AuthRoutes />
    </>
  )
}

export default App
