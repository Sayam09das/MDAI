import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ReturnMainPages from "../Main/Mainpages/returnMainpages";
import PublicRoute from "../ProtectedRoute/PublicRoute";

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <PublicRoute>
              <ReturnMainPages />
            </PublicRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
