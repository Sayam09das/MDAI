import React from 'react'
import './App.css'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MainRoutes from './routes/MainRoutes'
import AuthRoutes from './routes/AuthRoutes'

const App = () => {
  return (
    <>
      <ToastContainer />
      <MainRoutes />
      <AuthRoutes />
    </>
  )
}

export default App