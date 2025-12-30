import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ReturnAboutpage from '../Main/AboutPage/ReturnAboutpage'

const AboutRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/about" element={<ReturnAboutpage />} />
      </Route>
    </Routes>
  )
}

export default AboutRoutes