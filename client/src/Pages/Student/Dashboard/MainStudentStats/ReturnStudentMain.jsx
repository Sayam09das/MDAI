import React from "react";
import StuddentMotivation from "./StuddentMotivation";
import StudentCalendar from "./StudentCalendar";

const ReturnStudentMain = () => {
    return (
        <>
            <div className="md:px-6">

                {/* TOP SECTION: Motivation + Calendar */}
                <div className="flex flex-col md:flex-row gap-6 mt-6 items-start">

                    {/* LEFT SIDE – 75% */}
                    <div className="w-full md:w-3/4 flex flex-col gap-4">
                        <StuddentMotivation />
                        <StudentCalendar />

                        {/* PERFORMANCE + ATTENDANCE */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Left */}
                            <div className="w-full lg:w-1/2">
                                {/* <StudentPerformance /> */}
                            </div>

                            {/* Right */}
                            <div className="w-full lg:w-1/2">
                                {/* <StudentAttendance /> */}
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Left */}
                            <div className="w-full lg:w-1/2">
                                {/* <Performance /> */}
                            </div>

                            {/* Right */}
                            <div className="w-full lg:w-1/2">
                                {/* <StudentGenderStats /> */}
                            </div>
                        </div>
                    </div>
                    {/* RIGHT SIDE – 25% */}
                    <div className="w-full md:w-1/4">
                        {/* <DashboardCalendar /> */}
                        <div className="mt-3">
                            {/* <TodayLectures /> */}
                        </div>

                    </div>

                </div>

            </div>

            <div className="px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-6 mt-6 items-start">
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        {/* <TeacherTasks /> */}
                    </div>
                    <div className="w-full md:w-1/2">
                        {/* <StudentActivity /> */}
                    </div>
                </div>
            </div>

            <div className="mt-5">
                {/* <TeacherStatistics /> */}
                {/* <div className="mt-5"><StudentPerformanceGraph /></div> */}
            </div>

        </>
    );
};

export default ReturnStudentMain;