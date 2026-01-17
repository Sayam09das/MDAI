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

                {/* LEFT – Future Section (75%) */}
                <div className="w-full md:w-3/4">
                    {/* Future Component Here */}
                    <div className="h-40 rounded-xl border border-dashed flex items-center justify-center text-gray-400">
                        Future Content
                    </div>
                </div>

                {/* RIGHT – Overview (25%) */}
                <div className="w-full md:w-1/4">
                    <StudentOverview />
                </div>
            </div>

        </div>
    );
};

export default ReturnStudentMain;
