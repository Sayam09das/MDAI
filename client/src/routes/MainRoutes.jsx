import React from "react"
import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import ReturnMainPages from "../Main/Mainpages/returnMainpages"

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ReturnMainPages />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
