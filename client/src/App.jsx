import React from "react"
import "./App.css"

import MainRoutes from "./routes/MainRoutes"
import CourseRoutes from "./routes/CourseRoutes"
import AuthRoutes from "./routes/AuthRoutes"

const App = () => {
  return (
    <>
      <MainRoutes />
      <CourseRoutes />
      <AuthRoutes />
    </>
  )
}

export default App
