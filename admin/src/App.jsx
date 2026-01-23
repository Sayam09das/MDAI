import React from 'react'
import './App.css'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MainRoutes from './routes/MainRoutes'

const App = () => {
  return (
    <>
      <ToastContainer />
      <MainRoutes />
    </>
  )
}

export default App