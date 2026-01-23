import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from '../Auth/Login/Login'
import PublicRoute from "./PublicRoute";

const AuthRoutes = () => {
    return (
        <Routes element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default AuthRoutes