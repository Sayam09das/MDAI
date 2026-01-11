import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "../Auth/Registration";
import Login from "../Auth/Login";
import PublicRoute from "../ProtectedRoute/PublicRoute";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Registration />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AuthRoutes;
