import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Edit2, Trash2, CheckCircle, Circle, Bell } from 'lucide-react';
import { useCalendar } from '../../../../../context/CalendarContext';
import { formatTime } from '../../../../../utils/dateUtils';

const EVENT_ICONS = {
  task: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  exam: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  meeting: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  holiday: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  other: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const PRIORITY_COLORS = {
  low: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  high: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const EventList = ({ date, onEdit, onDelete }) => {
  const { getEventsForDate, toggleEventCompletion } = useCalendar();
  const events = getEventsForDate(date);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Events</h3>
        <p className="text-sm text-gray-500">No events scheduled for this day</p>
      </div>
    );
  }

  // Sort events: incomplete first, then by time
  const sortedEvents = [...events].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Events ({events.length})
        </h3>
      </div>

      <AnimatePresence mode="popLayout">
        {sortedEvents.map((event, index) => {
          const priority = PRIORITY_COLORS[event.priority] || PRIORITY_COLORS.medium;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative bg-white rounded-xl border transition-all hover:shadow-md ${
                event.completed 
                  ? 'border-gray-200 bg-gray-50' 
                  : `${priority.bg} border-transparent`
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => toggleEventCompletion(event.id)}
                    className={`flex-shrink-0 mt-0.5 transition-colors ${
                      event.completed 
                        ? 'text-green-500' 
                        : `${priority.text} hover:opacity-75`
                    }`}
                  >
                    {event.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${priority.text}`}>
                        {EVENT_ICONS[event.type] || EVENT_ICONS.other}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        event.completed ? 'bg-gray-200 text-gray-600' : priority.bg
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      {event.reminder && (
                        <Bell className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    
                    <h4 className={`font-medium truncate ${
                      event.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </h4>
                    
                    {event.description && (
                      <p className={`text-sm mt-1 line-clamp-2 ${
                        event.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                      {!event.allDay && (
                        <div className={`flex items-center gap-1 text-xs ${
                          event.completed ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className={`flex items-center gap-1 text-xs ${
                        event.completed ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                        <span className="capitalize">{event.priority}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(event)}
                      className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress indicator for incomplete events */}
              {!event.completed && (
                <div className="h-0.5 bg-transparent overflow-hidden">
                  <div 
                    className={`h-full ${priority.dot} opacity-20`}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default EventList;

