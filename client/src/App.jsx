import React from 'react'
import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MainRoutes from './routes/MainRoutes'

const App = () => {
  return (
    <>
      <Navbar />
      <MainRoutes />
      <Footer />
    </>
  )
}

export default App
