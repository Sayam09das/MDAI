import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminRoutes from '../Admin/AdminRoutes'


const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/admin" element={<AdminRoutes />} />
    </Routes>
  )
}

export default AdminRoutes;