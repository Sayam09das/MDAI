import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bell, 
  Calendar as CalendarIcon,
  List,
  Grid,
  Settings,
  Globe,
  Clock,
  BookOpen,
  Users,
  Video,
  Briefcase
} from 'lucide-react';
import { useCalendar } from '../../../context/CalendarContext';
import { getHolidaysForMonth, isHoliday, getHolidayColor, COUNTRIES } from '../../../utils/holidays';
import { formatDate, isToday, isSameDay } from '../../../utils/dateUtils';
import EventModal from '../../Student/Dashboard/StudentCalendar/components/EventModal';
import EventList from '../../Student/Dashboard/StudentCalendar/components/EventList';
import HolidayList from '../../Student/Dashboard/StudentCalendar/components/HolidayList';
import TaskList from '../../Student/Dashboard/StudentCalendar/components/TaskList';
import NotificationToast from '../../Student/Dashboard/StudentCalendar/components/NotificationToast';
import 'react-calendar/dist/Calendar.css';

const TeacherCalendar = () => {
  const {
    selectedDate,
    setSelectedDate,
    currentDate,
    setCurrentDate,
    selectedCountry,
    events,
    getEventsForDate,
    openNewEventModal,
    openEditModal,
    deleteEvent,
    toggleEventCompletion,
    notificationPermission,
    requestPerm,
    getUpcomingEvents,
    getPendingTasks,
    loading,
  } = useCalendar();

  const [view, setView] = useState('month'); // 'month', 'list'
  const [showSidebar, setShowSidebar] = useState(true);

  const selectedDateEvents = getEventsForDate(selectedDate);
  
  // Safe array access
  const upcomingEvents = Array.isArray(getUpcomingEvents(5)) ? getUpcomingEvents(5) : [];
  const pendingTasks = Array.isArray(getPendingTasks(5)) ? getPendingTasks(5) : [];

  const holidays = useMemo(() => {
    return getHolidaysForMonth(
      selectedCountry,
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [selectedCountry, currentDate]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const tileClassName = ({ date }) => {
    const classes = ['cal-day'];
    
    if (isToday(date)) {
      classes.push('cal-today');
    }
    
    if (isSameDay(date, selectedDate)) {
      classes.push('cal-selected');
    }
    
    // Check for holidays
    const holiday = isHoliday(date, selectedCountry);
    if (holiday) {
      classes.push('has-holiday');
    }
    
    return classes.join(' ');
  };

  const tileContent = ({ date }) => {
    const dayEvents = getEventsForDate(date);
    const holiday = isHoliday(date, selectedCountry);
    
    return (
      <div className="mt-1 flex flex-col gap-0.5 items-center">
        {dayEvents.length > 0 && (
          <div className="flex gap-0.5 justify-center">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  event.completed 
                    ? 'bg-gray-400' 
                    : event.type === 'exam' 
                      ? 'bg-red-500' 
                      : event.type === 'meeting'
                        ? 'bg-green-500'
                        : event.type === 'class'
                          ? 'bg-purple-500'
                          : 'bg-blue-500'
                }`}
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[8px] text-gray-500">+{dayEvents.length - 3}</span>
            )}
          </div>
        )}
        {holiday && (
          <div className={`w-1.5 h-1.5 rounded-full ${getHolidayColor(holiday.type).split(' ')[0].replace('bg-', 'bg-')}`} />
        )}
      </div>
    );
  };

  // Teacher-specific event type colors
  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'class':
        return <BookOpen className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'live':
        return <Video className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Toast Notifications */}
      <NotificationToast />

      {/* Event Modal */}
      <EventModal />

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Teacher Calendar</h1>
              <p className="text-sm text-gray-500">
                {formatDate(currentDate, 'long')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('month')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Month</span>
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-xl transition-all ${
                showSidebar 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Add Event Button */}
            <button
              onClick={() => openNewEventModal(selectedDate)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Calendar & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Calendar Area */}
          <motion.div
            layout
            className={`flex-1 ${showSidebar ? 'lg:w-2/3' : 'lg:w-full'}`}
          >
            {/* Calendar Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
                    {formatDate(currentDate, 'long').split(',')[0]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={goToToday}
                    className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-4">
                <Calendar
                  onChange={handleDateClick}
                  value={selectedDate}
                  prevLabel={<ChevronLeft className="w-5 h-5" />}
                  nextLabel={<ChevronRight className="w-5 h-5" />}
                  prev2Label={null}
                  next2Label={null}
                  formatShortWeekday={(locale, d) =>
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
                  }
                  formatMonthYear={(locale, date) =>
                    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  }
                  className="w-full"
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                  showNeighboringMonth={true}
                />
              </div>
            </div>

            {/* Selected Date Events (Mobile) */}
            <div className="lg:hidden mt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {formatDate(selectedDate, 'long')}
                  </h3>
                  <button
                    onClick={() => openNewEventModal(selectedDate)}
                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <EventList
                  date={selectedDate}
                  onEdit={openEditModal}
                  onDelete={deleteEvent}
                />
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-1/3 space-y-4"
              >
                {/* Selected Date Events */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">
                        {formatDate(selectedDate, 'medium')}
                      </h3>
                    </div>
                    <button
                      onClick={() => openNewEventModal(selectedDate)}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <EventList
                    date={selectedDate}
                    onEdit={openEditModal}
                    onDelete={deleteEvent}
                  />
                </div>

                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => openEditModal(event)}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            event.type === 'exam' 
                              ? 'bg-red-100 text-red-600' 
                              : event.type === 'meeting'
                                ? 'bg-green-100 text-green-600'
                                : event.type === 'class'
                                  ? 'bg-purple-100 text-purple-600'
                                  : 'bg-blue-100 text-blue-600'
                          }`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{event.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })} at {event.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <TaskList tasks={pendingTasks} />
                </div>

                {/* Holidays */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <HolidayList compact />
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">
                        {notificationPermission === 'granted' 
                          ? 'Enabled' 
                          : notificationPermission === 'denied' 
                            ? 'Blocked' 
                            : 'Enable for reminders'}
                      </p>
                    </div>
                    {notificationPermission !== 'granted' && (
                      <button
                        onClick={requestPerm}
                        className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Internal Styles */}
      <style>{`
        /* Calendar Styles */
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
          height: auto;
          gap: 0.5rem;
        }

        .react-calendar__navigation button {
          background: none;
          border: none;
          border-radius: 0.5rem;
          min-width: 36px;
          height: 36px;
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

        .react-calendar__navigation__label {
          font-size: 1rem;
          font-weight: 700;
          flex: 1;
          text-align: center;
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
          margin-bottom: 0.5rem;
        }

        .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }

        .react-calendar__tile {
          border: none !important;
          padding: 0.75rem 0.5rem;
          border-radius: 0.625rem;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          color: #1f2937;
          position: relative;
          min-height: 60px;
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
          background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%) !important;
          color: #6b21a8 !important;
          font-weight: 600;
        }

        .cal-today:hover {
          background: linear-gradient(135deg, #d8b4fe 0%, #c4b5fd 100%) !important;
        }

        /* Selected */
        .cal-selected {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
          color: white !important;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .cal-selected:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
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

        /* Hover effect for tiles */
        .cal-day:hover {
          background: #f3f4f6;
        }

        .cal-today:hover {
          background: linear-gradient(135deg, #d8b4fe 0%, #c4b5fd 100%) !important;
        }

        .cal-selected:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default TeacherCalendar;

