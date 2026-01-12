import React from "react";
import { Routes, Route } from "react-router-dom";
import Payment from "../Pages/Student/Dashboard/CoursePayment/Payment";
import StudentProtectedRoute from "../ProtectedRoute/StudentProtectedRoute";
import PaymentDemo from "../Pages/Student/Dashboard/CoursePayment/paymentdemo";

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
            <Route path="/payment-demo" element={<PaymentDemo />} />
        </Routes>
    );
};

export default PaymentRoutes;
