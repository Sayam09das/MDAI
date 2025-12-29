import React from "react"
import { Routes, Route } from "react-router-dom"
import Registration from "../Auth/Registration"
import Login from "../Auth/Login"

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default AuthRoutes
