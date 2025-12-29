import React from "react"
import { Routes, Route } from "react-router-dom"
import Registration from "../Auth/Registration"

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
    </Routes>
  )
}

export default AuthRoutes
