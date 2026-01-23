import React from "react";
import { Routes, Route } from "react-router-dom";
import ReturnMainPages from "../components/Main/ReturnGetStarted";
import PublicRoute from "./PublicRoute";


const MainRoutes = () => {
  return (
    <Routes element={<PublicRoute />}>
        <Route path="/" element={<ReturnMainPages />} />
    </Routes>
  );
};

export default MainRoutes;
