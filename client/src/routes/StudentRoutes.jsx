import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../components/Dashboard/Student/StudentLayout";
import PageLoader from "../components/common/PageLoader";
import ReturnDashboard from "../Pages/Student/Dashboard/ReturnDashboard";

const StudentRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/student-dashboard" element={<StudentLayout />}>
          <Route index element={<ReturnDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
