import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainRoutes from "./routes/MainRoutes";
import CourseRoutes from "./routes/CourseRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import AboutRoutes from "./routes/AboutRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const App = () => {
  return (
    <>
      <ToastContainer />

      {/* Public routes */}
      <MainRoutes />
      <CourseRoutes />
      <AboutRoutes />
      <ContactRoutes />
      <AuthRoutes />

      {/* 🔐 Protected routes */}
      <ProtectedRoute>
        <TeacherRoutes />
        <StudentRoutes />
      </ProtectedRoute>
    </>
  );
};

export default App;
