import React from "react"
import { Routes, Route } from "react-router-dom"
import AdminLayout from "../Admin/AdminRoutes" // 👈 renamed import

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />} />
    </Routes>
  )
}

export default AdminRoutes
