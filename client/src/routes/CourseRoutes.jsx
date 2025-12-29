import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ReturnCoursePage from '../Main/CoursePage/returnCoursepage'
import MainLayout from '../layouts/MainLayout'

const CourseRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/courses" element={<ReturnCoursePage />} />
      </Route>
    </Routes>
  )
}

export default CourseRoutes
