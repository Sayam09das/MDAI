import React from "react"
import { Routes, Route } from "react-router-dom"
import AdminLayout from "../Admin/AdminRoutes" // 👈 renamed import
import AdminLogin from "../Admin/AdminLogin"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin-enrollment" element={<AdminLayout />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  )
}

export default AdminRoutes
