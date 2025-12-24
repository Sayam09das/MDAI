import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ReturnCoursePage from '../Main/returnCoursepage'
const CourseRoutes = () => {
  return (
    <Routes>
      <Route path="/courses" element={<ReturnCoursePage />} />
    </Routes>
  )
}

export default CourseRoutes
