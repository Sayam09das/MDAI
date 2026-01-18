import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import StuddentMotivation from "./StuddentMotivation";
import StudentCalendar from "./StudentCalendar";
import StudentOverview from "./StudentOverview";
import StudentProfile from "./StudentProfile";
import StudentPerformance from "./StudentPerformance";
import StudentHourActivity from "./StudentHourActivity";

const ReturnStudentMain = () => {
    return (
        <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 items-start">

                {/* ================= LEFT COLUMN (70%) ================= */}
                <div className="w-full lg:w-[70%] flex flex-col gap-4 sm:gap-5 md:gap-6">
                    <StuddentMotivation />
                    <StudentOverview />
                </div>

                {/* ================= RIGHT COLUMN (30%) ================= */}
                <div className="w-full lg:w-[30%] flex flex-col gap-4 sm:gap-5 md:gap-6">
                    <StudentProfile />
                    <StudentCalendar />

                    {/* WORKING PROCESS CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-sm"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                                    Working Process
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    <span className="font-medium">Note:</span> Do not disturb the developer management team
                                </p>
                            </div>
                        </div>

                        {/* Task List */}
                        <ul className="space-y-2 sm:space-y-2.5">
                            <TaskItem text="Attend classes" delay={0.7} />
                            <TaskItem text="Complete assignments" delay={0.75} />
                            <TaskItem text="Practice daily" delay={0.8} />
                            <TaskItem text="Track progress" delay={0.85} />
                        </ul>

                        {/* Footer */}
                        <div className="mt-4 pt-3 sm:pt-4 border-t border-orange-200">
                            <p className="text-xs text-right text-gray-700">
                                <span className="font-medium">— Leader,</span>
                                <br />
                                <span className="text-orange-700 font-semibold">Sayam Das</span>
                            </p>
                        </div>
                    </motion.div>
                </div>

            </div>
            <div>
                <StudentHourActivity />
                Ï<StudentPerformance />
            </div>
        </div>
    );
};

/* ================= TASK ITEM COMPONENT ================= */
const TaskItem = ({ text, delay }) => {
    return (
        <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
        >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
                {text}
            </span>
        </motion.li>
    );
};

export default ReturnStudentMain;