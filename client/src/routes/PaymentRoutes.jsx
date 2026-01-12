import React from "react";
import { Routes, Route } from "react-router-dom";
import Payment from "../Pages/Student/Dashboard/CoursePayment/Payment";
import StudentProtectedRoute from "../ProtectedRoute/StudentProtectedRoute";

const PaymentRoutes = () => {
    return (
        <Routes>
            <Route
                path="/payment/:courseId"
                element={
                    <StudentProtectedRoute>
                        <Payment />
                    </StudentProtectedRoute>
                }
            />
        </Routes>
    );
};

export default PaymentRoutes;
