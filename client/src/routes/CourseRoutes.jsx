import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ReturnCoursepage from '../Main/CoursePage/ReturnCoursepage'

const CourseRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/courses" element={<ReturnCoursepage />} />
      </Route>
    </Routes>
  )
}

export default CourseRoutes
