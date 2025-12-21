import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainHeader from '../Main/Mainpages/MainHeader'

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainHeader />} />
        </Routes>
    )
}

export default MainRoutes
