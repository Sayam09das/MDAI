import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ReturnMainPages from '../Main/Mainpages/returnMainpages'

const CourseRoutes = () => {
    return (
        <Routes>
            <Route path="/courses" element={< ReturnMainPages />} />
        </Routes>
    )
}

export default CourseRoutes
