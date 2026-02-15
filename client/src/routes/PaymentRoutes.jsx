import React from "react";
import { Routes, Route } from "react-router-dom";
import Payment from "../Pages/Student/Dashboard/CoursePayment/Payment";
import PaymentInfo from "../Pages/Student/Dashboard/CoursePayment/PaymentInfo";
import StudentProtectedRoute from "../ProtectedRoute/StudentProtectedRoute";
import PaymentDemo from "../Pages/Student/Dashboard/CoursePayment/PaymentDemo";
import PayLaterRequest from "../Pages/Student/Dashboard/CoursePayment/PayLaterRequest"

const PaymentRoutes = () => {
    return (
        <Routes>
            {/* Actual Payment Page (later real gateway) - /payment/:courseId */}
            <Route
                path=":courseId"
                element={
                    <StudentProtectedRoute>
                        <Payment />
                    </StudentProtectedRoute>
                }
            />

            {/* Manual Payment Info Page - /payment/payment-info/:courseId */}
            <Route
                path="payment-info/:courseId"
                element={
                    <StudentProtectedRoute>
                        <PaymentInfo />
                    </StudentProtectedRoute>
                }
            />
            
            {/* Pay Later Request - /payment/pay-later/:courseId */}
            <Route
                path="pay-later/:courseId"
                element={
                    <StudentProtectedRoute>
                        <PayLaterRequest />
                    </StudentProtectedRoute>
                }
            />


            {/* Demo / Test Page - /payment/payment-demo/:courseId */}
            <Route path="payment-demo/:courseId" element={<PaymentDemo />} />
        </Routes>
    );
};

export default PaymentRoutes;
