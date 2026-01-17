import React from "react";
import StuddentMotivation from "./StuddentMotivation";
import StudentCalendar from "./StudentCalendar";
import StudentOverview from "./StudentOverview";

const ReturnStudentMain = () => {
    return (
        <div className="px-4 md:px-6 mt-6">

            {/* ================= ROW 1 ================= */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT – Motivation (75%) */}
                <div className="w-full md:w-3/4">
                    <StuddentMotivation />
                </div>

                {/* RIGHT – Calendar (25%) */}
                <div className="w-full md:w-1/4">
                    <StudentCalendar />
                </div>
            </div>

            {/* ================= ROW 2 ================= */}
            <div className="flex flex-col md:flex-row gap-6 items-start mt-6">

                {/* LEFT – Student Overview (75%) */}
                <div className="w-full md:w-3/4">
                    <StudentOverview />
                </div>

                {/* RIGHT – Working Process (25%) */}
                <div className="w-full md:w-1/4 bg-white rounded-xl p-4 shadow text-sm text-gray-700">
                    <h4 className="font-semibold text-gray-900 mb-2">
                        Working Process Pyana dasgupta ❤️
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
    );
};

export default ReturnStudentMain;
