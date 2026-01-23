import React from "react";
import { Routes, Route } from "react-router-dom";
import ReturnMainPages from "../components/Main/ReturnGetStarted";


const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<ReturnMainPages />} />
    </Routes>
  );
};

export default MainRoutes;
