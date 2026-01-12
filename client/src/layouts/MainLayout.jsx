import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FloatingActions from "../components/FloatingActions"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <FloatingActions />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
