import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import MainRoutes from "./routes/MainRoutes";
import CourseRoutes from "./routes/CourseRoutes";
import AboutRoutes from "./routes/AboutRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import PaymentRoutes from "./routes/PaymentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import NotFound from "./components/common/NotFound";

const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/*" element={<MainRoutes />} />
        <Route path="/*" element={<CourseRoutes />} />
        <Route path="/*" element={<AboutRoutes />} />
        <Route path="/*" element={<ContactRoutes />} />
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="/*" element={<TeacherRoutes />} />
        <Route path="/*" element={<StudentRoutes />} />
        <Route path="/*" element={<PaymentRoutes />} />
        <Route path="/*" element={<AdminRoutes />} />

        {/* 🔥 MUST BE LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
