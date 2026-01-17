import React, { useState } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-calendar/dist/Calendar.css";

const StudentCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-4 sm:mt-5"
        >
            {/* CARD */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        My Calendar
                    </h3>
                </motion.div>

                {/* CALENDAR */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    <Calendar
                        onChange={setDate}
                        value={date}
                        prevLabel={<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                        nextLabel={<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                        prev2Label={null}
                        next2Label={null}
                        formatShortWeekday={(locale, d) =>
                            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
                        }
                        className="w-full"
                        tileClassName={({ date: d }) => {
                            if (d.toDateString() === new Date().toDateString()) {
                                return "cal-today";
                            }
                            if (d.toDateString() === date.toDateString()) {
                                return "cal-selected";
                            }
                            return "cal-day";
                        }}
                    />
                </motion.div>

                {/* FOOTER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="mt-4 sm:mt-5 pt-4 border-t border-gray-100"
                >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Selected date:
                        </p>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                            {date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* INTERNAL STYLES */}
            <style>{`
                /* Remove all calendar borders */
                .react-calendar {
                    width: 100%;
                    border: none !important;
                    background: transparent;
                    font-family: inherit;
                }

                .react-calendar__navigation {
                    border: none !important;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    height: 40px;
                }

                .react-calendar__navigation button {
                    background: none;
                    border: none;
                    border-radius: 0.5rem;
                    min-width: 32px;
                    height: 32px;
                    color: #374151;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }

                .react-calendar__navigation button:hover:not(:disabled) {
                    background: #f3f4f6;
                }

                .react-calendar__navigation button:disabled {
                    opacity: 0.3;
                }

                .react-calendar__month-view {
                    border: none !important;
                }

                .react-calendar__month-view__weekdays {
                    border-bottom: none;
                    text-align: center;
                    font-size: 0.625rem;
                    color: #9ca3af;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                @media (min-width: 640px) {
                    .react-calendar__month-view__weekdays {
                        font-size: 0.75rem;
                        margin-bottom: 0.5rem;
                    }
                }

                .react-calendar__month-view__weekdays abbr {
                    text-decoration: none;
                }

                .react-calendar__tile {
                    border: none !important;
                    padding: 0.5rem 0;
                    border-radius: 0.5rem;
                    transition: all 0.2s ease;
                    font-size: 0.75rem;
                    color: #1f2937;
                    position: relative;
                }

                @media (min-width: 640px) {
                    .react-calendar__tile {
                        padding: 0.75rem 0;
                        font-size: 0.875rem;
                        border-radius: 0.625rem;
                    }
                }

                @media (min-width: 768px) {
                    .react-calendar__tile {
                        padding: 0.875rem 0;
                        font-size: 0.9375rem;
                    }
                }

                .react-calendar__tile:hover:not(:disabled) {
                    background: #f9fafb;
                }

                .react-calendar__tile--now {
                    background: transparent;
                }

                .react-calendar__tile--active {
                    background: transparent;
                }

                /* Today */
                .cal-today {
                    background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%) !important;
                    color: #1e40af !important;
                    font-weight: 600;
                }

                .cal-today:hover {
                    background: linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 100%) !important;
                }

                /* Selected */
                .cal-selected {
                    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
                    color: white !important;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .cal-selected:hover {
                    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
                }

                /* Neighbor months */
                .react-calendar__month-view__days__day--neighboringMonth {
                    color: #d1d5db;
                }

                /* Disabled */
                .react-calendar__tile:disabled {
                    background: transparent;
                    color: #e5e7eb;
                }
            `}</style>
        </motion.div>
    );
};

export default StudentCalendar;