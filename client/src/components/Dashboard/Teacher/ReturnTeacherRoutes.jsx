import React from "react";
import TeacherLayout from "./TeacherLayout";
import Dashboard from "../../../Pages/teacher/Dashboard/Dashboard";
import Mycourse from "../../../Pages/teacher/Dashboard/Mycourse";

const ReturnTeacherRoutes = () => {
    return (
        <TeacherLayout>
            <Dashboard />
            <Mycourse />
        </TeacherLayout>
    );
};

export default ReturnTeacherRoutes;
