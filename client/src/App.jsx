import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainRoutes from "./routes/MainRoutes";
import CourseRoutes from "./routes/CourseRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AboutRoutes from "./routes/AboutRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudentRoutes from "./routes/StudentRoutes";

import Payment from "./Pages/Student/Dashboard/CoursePayment/Payment";
import StudentProtectedRoute from "./ProtectedRoute/StudentProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* ✅ GLOBAL PAYMENT ROUTE (FIXES /payment/:id) */}
        <Route
          path="/payment/:courseId"
          element={
            <StudentProtectedRoute>
              <Payment />
            </StudentProtectedRoute>
          }
        />
      </Routes>

      {/* OTHER ROUTE GROUPS */}
      <MainRoutes />
      <CourseRoutes />
      <AboutRoutes />
      <ContactRoutes />
      <AuthRoutes />
      <TeacherRoutes />
      <StudentRoutes />
    </BrowserRouter>
  );
};

export default App;
