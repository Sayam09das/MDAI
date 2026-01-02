import React from "react";
import Motivation from "./Motivation";
import TeacherStats from "./TeacherStats";
import DashboardCalendar from "./DashboardCalendar";
import StudentPerformance from "./StudentPerformance";
import StudentAttendance from "./StudentAttendance";
import TodayLectures from "./TodayLectures";

const ReturnDashboard = () => {
    return (
        <div className="px-4 md:px-6">

            {/* TOP SECTION: Motivation + Calendar */}
            <div className="flex flex-col md:flex-row gap-6 mt-6 items-start">

                {/* LEFT SIDE – 75% */}
                <div className="w-full md:w-3/4 flex flex-col gap-4">
                    <Motivation />
                    <TeacherStats />

                    {/* PERFORMANCE + ATTENDANCE */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Left */}
                        <div className="w-full lg:w-1/2">
                            <StudentPerformance />
                        </div>

                        {/* Right */}
                        <div className="w-full lg:w-1/2">
                            <StudentAttendance />
                        </div>
                    </div>
                </div>


                {/* RIGHT SIDE – 25% */}
                <div className="w-full md:w-1/4">
                    <DashboardCalendar />
                    <div className="mt-3">
                        <TodayLectures />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ReturnDashboard;
