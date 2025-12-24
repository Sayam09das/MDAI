import React from 'react'
import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MainRoutes from './routes/MainRoutes'
import CourseRoutes from './routes/CourseRoutes'

const App = () => {
  return (
    <>
      <Navbar />
      <MainRoutes />
      <CourseRoutes />
      <Footer />
    </>
  )
}

export default App
