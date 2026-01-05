import React, { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Video,
    BookOpen,
    Users,
    ArrowLeft,
    Plus,
    X,
    MapPin,
    Eye,
} from "lucide-react"

const TeacherCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [showEventModal, setShowEventModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const events = [
        {
            id: 1,
            title: "React Hooks Masterclass",
            date: "2025-01-05",
            startTime: "10:00",
            endTime: "11:30",
            type: "live",
            course: "Full Stack Development",
            students: 45,
            location: "Google Meet",
            color: "blue",
        },
        {
            id: 2,
            title: "JavaScript Advanced",
            date: "2025-01-06",
            startTime: "14:00",
            endTime: "15:30",
            type: "live",
            course: "Web Development",
            students: 32,
            location: "Zoom",
            color: "green",
        },
        {
            id: 3,
            title: "CSS Grid Workshop",
            date: "2025-01-08",
            startTime: "09:00",
            endTime: "10:30",
            type: "workshop",
            course: "Frontend Design",
            students: 28,
            location: "Room 101",
            color: "purple",
        },
        {
            id: 4,
            title: "Project Review",
            date: "2025-01-10",
            startTime: "15:00",
            endTime: "17:00",
            type: "review",
            course: "Full Stack Development",
            students: 20,
            location: "Online",
            color: "orange",
        },
        {
            id: 5,
            title: "Node.js Fundamentals",
            date: "2025-01-12",
            startTime: "11:00",
            endTime: "12:30",
            type: "live",
            course: "Backend Development",
            students: 38,
            location: "Google Meet",
            color: "blue",
        },
        {
            id: 6,
            title: "Database Design",
            date: "2025-01-15",
            startTime: "13:00",
            endTime: "14:30",
            type: "lecture",
            course: "Backend Development",
            students: 35,
            location: "Room 202",
            color: "red",
        },
        {
            id: 7,
            title: "Team Standup",
            date: "2025-01-05",
            startTime: "09:00",
            endTime: "09:30",
            type: "meeting",
            course: "Staff",
            students: 8,
            location: "Conference Room",
            color: "gray",
        },
    ]

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()
        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate)
        newDate.setMonth(newDate.getMonth() + direction)
        setCurrentDate(newDate)
    }

    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0]
        return events.filter(e => e.date === dateStr)
    }

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setSelectedDate(clickedDate)
        const dayEvents = getEventsForDate(clickedDate)
        if (dayEvents.length > 0) {
            toast.info(`📅 ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''} on this day`, {
                position: "top-center",
                autoClose: 2000,
            })
        }
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event)
        setShowEventModal(true)
    }

    const getEventColor = (color) => {
        const colors = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
            red: "bg-red-500",
            gray: "bg-gray-500",
        }
        return colors[color] || "bg-blue-500"
    }

    const getEventBgColor = (color) => {
        const colors = {
            blue: "bg-blue-50 border-blue-200",
            green: "bg-green-50 border-green-200",
            purple: "bg-purple-50 border-purple-200",
            orange: "bg-orange-50 border-orange-200",
            red: "bg-red-50 border-red-200",
            gray: "bg-gray-50 border-gray-200",
        }
        return colors[color] || "bg-blue-50 border-blue-200"
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7
    const today = new Date().toDateString()

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-purple-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    <Calendar className="text-indigo-600 flex-shrink-0" size={28} />
                                    <span className="truncate">Calendar</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    Manage class schedules
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.info("📅 Add event coming soon!")}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg whitespace-nowrap"
                        >
                            <Plus size={20} /> <span className="hidden sm:inline">Add</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Calendar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => changeMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </motion.button>

                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{monthName}</h2>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => changeMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-600 py-2">
                                <span className="hidden sm:inline">{day}</span>
                                <span className="sm:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {Array.from({ length: totalCells }, (_, index) => {
                            const day = index - startingDayOfWeek + 1
                            const isValidDay = day > 0 && day <= daysInMonth
                            const date = isValidDay ? new Date(year, month, day) : null
                            const isToday = date && date.toDateString() === today
                            const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString()
                            const dayEvents = date ? getEventsForDate(date) : []

                            return (
                                <motion.div
                                    key={index}
                                    whileHover={isValidDay ? { scale: 1.05 } : {}}
                                    whileTap={isValidDay ? { scale: 0.95 } : {}}
                                    onClick={() => isValidDay && handleDateClick(day)}
                                    className={`aspect-square border rounded-lg p-1 sm:p-2 cursor-pointer transition-all ${!isValidDay
                                            ? 'bg-gray-50 cursor-default'
                                            : isToday
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-indigo-600'
                                                : isSelected
                                                    ? 'bg-indigo-100 border-indigo-400'
                                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    {isValidDay && (
                                        <>
                                            <div className={`text-xs sm:text-sm font-semibold mb-1 ${isToday ? 'text-white' : ''}`}>
                                                {day}
                                            </div>
                                            <div className="space-y-0.5">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`${getEventColor(event.color)} h-1 sm:h-1.5 rounded-full`}
                                                    />
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className={`text-xs ${isToday ? 'text-white' : 'text-gray-600'}`}>
                                                        +{dayEvents.length - 2}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Today Button */}
                    <div className="mt-4 flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setCurrentDate(new Date())
                                setSelectedDate(new Date())
                            }}
                            className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                        >
                            Today
                        </motion.button>
                    </div>
                </motion.div>

                {/* Events List */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen className="text-indigo-600" size={24} />
                        {selectedDate
                            ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                            : 'Upcoming Events'
                        }
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 5)).map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleEventClick(event)}
                                className={`${getEventBgColor(event.color)} border-2 rounded-xl lg:rounded-2xl p-4 sm:p-6 cursor-pointer shadow-md hover:shadow-lg transition-all`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className={`${getEventColor(event.color)} w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                        <Video size={24} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-base sm:text-lg mb-1">{event.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{event.course}</p>

                                        <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {event.startTime} - {event.endTime}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {event.students}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {event.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col gap-2">
                                        <span className={`px-3 py-1 ${getEventBgColor(event.color)} border rounded-full text-xs font-semibold capitalize`}>
                                            {event.type}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEventClick(event)
                                            }}
                                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        >
                                            <Eye size={18} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {((selectedDate && getEventsForDate(selectedDate).length === 0) || (!selectedDate && events.length === 0)) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16 bg-white rounded-2xl shadow-lg"
                        >
                            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-xl font-semibold text-gray-600 mb-2">No events scheduled</p>
                            <p className="text-gray-500">Add your first event to get started</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Event Modal */}
            {showEventModal && selectedEvent && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEventModal(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
                        >
                            <div className={`${getEventBgColor(selectedEvent.color)} border-b-2 p-6 rounded-t-2xl`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`${getEventColor(selectedEvent.color)} w-16 h-16 rounded-xl flex items-center justify-center text-white`}>
                                            <Video size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedEvent.title}</h2>
                                            <p className="text-gray-600">{selectedEvent.course}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowEventModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <Calendar size={18} />
                                            <span className="text-sm font-medium">Date</span>
                                        </div>
                                        <p className="font-bold">
                                            {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <Clock size={18} />
                                            <span className="text-sm font-medium">Time</span>
                                        </div>
                                        <p className="font-bold">
                                            {selectedEvent.startTime} - {selectedEvent.endTime}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <Users size={18} />
                                            <span className="text-sm font-medium">Students</span>
                                        </div>
                                        <p className="font-bold">{selectedEvent.students} enrolled</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <MapPin size={18} />
                                            <span className="text-sm font-medium">Location</span>
                                        </div>
                                        <p className="font-bold">{selectedEvent.location}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toast.success("🎥 Starting class...")}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium"
                                    >
                                        Start Class
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowEventModal(false)}
                                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}

            {/* Mobile FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.info("📅 Add event coming soon!")}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    )
}

export default TeacherCalendar