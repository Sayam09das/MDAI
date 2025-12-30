import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ReturnContactpage from '../Main/ContactPage/ReturnContactpage'

const ContactRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/contact" element={<ReturnContactpage />} />
            </Route>
        </Routes>
    )
}

export default ContactRoutes