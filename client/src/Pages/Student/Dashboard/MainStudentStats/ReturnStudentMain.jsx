import React from "react";
import StuddentMotivation from "./StuddentMotivation";
import StudentCalendar from "./StudentCalendar";
import StudentOverview from "./StudentOverview";
import StudentProfile from "./StudentProfile";

const ReturnStudentMain = () => {
    return (
        <div className="px-4 md:px-6 mt-6">

            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* ================= LEFT COLUMN (75%) ================= */}
                <div className="w-full md:w-3/4 flex flex-col gap-6">
                    <StuddentMotivation />
                    <StudentOverview />
                </div>

                {/* ================= RIGHT COLUMN (25%) ================= */}
                <div className="w-full md:w-1/4 flex flex-col gap-6">
                    <StudentProfile />
                    <StudentCalendar />

                    <div className="bg-white rounded-xl p-4 shadow text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Working Process
                            *note: Donot disturb the devloper management team
                                                                        --- Leader,
                                                                           Sayam Das
                        </h4>
                        <ul className="space-y-2">
                            <li>📌 Attend classes</li>
                            <li>📌 Complete assignments</li>
                            <li>📌 Practice daily</li>
                            <li>📌 Track progress</li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ReturnStudentMain;
