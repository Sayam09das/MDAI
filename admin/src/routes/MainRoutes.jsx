import React from "react";
import { Routes, Route } from "react-router-dom";
import ReturnMainPages from "../components/Main/ReturnGetStarted";
import PublicRoute from "./PublicRoute";

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<ReturnMainPages />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
