import React, { useState } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-calendar/dist/Calendar.css";

const DashboardCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full mt-5"
        >
            {/* CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Calendar
                </h3>

                {/* CALENDAR (FULL AREA) */}
                <Calendar
                    onChange={setDate}
                    value={date}
                    prevLabel={<ChevronLeft size={18} />}
                    nextLabel={<ChevronRight size={18} />}
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

                {/* FOOTER */}
                <p className="mt-4 text-sm text-gray-600">
                    Selected date:
                    <span className="ml-1 font-medium text-gray-900">
                        {date.toDateString()}
                    </span>
                </p>
            </div>

            {/* INTERNAL STYLES (NO EXTERNAL CSS) */}
            <style>{`
                /* Remove all calendar borders */
                .react-calendar {
                    width: 100%;
                    border: none !important;
                    background: transparent;
                }

                .react-calendar__navigation {
                    border: none !important;
                    margin-bottom: 0.75rem;
                }

                .react-calendar__navigation button {
                    background: none;
                    border: none;
                    border-radius: 0.5rem;
                    min-width: 36px;
                    color: #374151;
                }

                .react-calendar__month-view {
                    border: none !important;
                }

                .react-calendar__month-view__weekdays {
                    border-bottom: none;
                    text-align: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                    text-transform: uppercase;
                }

                .react-calendar__month-view__weekdays abbr {
                    text-decoration: none;
                }

                .react-calendar__tile {
                    border: none !important;
                    padding: 0.9rem 0;
                    border-radius: 0.75rem;
                    transition: background 0.2s ease;
                }

                .react-calendar__tile:hover {
                    background: #f3f4f6;
                }

                /* Today */
                .cal-today {
                    background: #e0f2fe;
                    color: #0369a1;
                    font-weight: 600;
                }

                /* Selected */
                .cal-selected {
                    background: #2563eb !important;
                    color: white !important;
                    font-weight: 600;
                }
            `}</style>
        </motion.div>
    );
};

export default DashboardCalendar;
