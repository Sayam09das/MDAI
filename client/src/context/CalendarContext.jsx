import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { showBrowserNotification, requestNotificationPermission, checkNotificationPermission } from '../utils/notifications';
import { COUNTRIES } from '../utils/holidays';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

// Generate unique ID
const generateId = () => `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initial demo events
const initialEvents = [
  {
    id: generateId(),
    title: 'Math Assignment Due',
    description: 'Complete Chapter 5 exercises',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'task',
    priority: 'high',
    completed: false,
    reminder: true,
    reminderTime: 30,
  },
  {
    id: generateId(),
    title: 'Science Project',
    description: 'Submit final project report',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '14:00',
    type: 'task',
    priority: 'medium',
    completed: false,
    reminder: true,
    reminderTime: 60,
  },
  {
    id: generateId(),
    title: 'History Quiz',
    description: 'Study World War II chapter',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '09:00',
    type: 'exam',
    priority: 'high',
    completed: false,
    reminder: true,
    reminderTime: 1440,
  },
];

export const CalendarProvider = ({ children }) => {
  // Events state
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  // Selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Current month/year for calendar view
  const [currentDate, setCurrentDate] = useState(new Date());

  // Selected country for holidays
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('calendar_country');
    return saved || 'US';
  });

  // Notification permission
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Initialize notification permission
  useEffect(() => {
    setNotificationPermission(checkNotificationPermission());
  }, []);

  // Persist events to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  // Persist country to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_country', selectedCountry);
  }, [selectedCountry]);

  // Request notification permission on mount
  useEffect(() => {
    const requestPerm = async () => {
      if (notificationPermission === 'default') {
        await requestNotificationPermission();
        setNotificationPermission(checkNotificationPermission());
      }
    };
    requestPerm();
  }, []);

  // Check for event reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      events.forEach((event) => {
        if (!event.reminder || event.completed) return;
        
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const reminderTime = eventDateTime.getTime() - (event.reminderTime * 60000);
        
        if (now.getTime() >= reminderTime && now.getTime() < reminderTime + 60000) {
          showBrowserNotification(`Reminder: ${event.title}`, {
            body: `${event.description || 'Event reminder'}\n${event.date} at ${event.time}`,
            tag: `reminder-${event.id}`,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [events]);

  // Add event
  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...eventData,
    };
    setEvents((prev) => [...prev, newEvent]);
    
    // Show toast
    addToast('Event created successfully!', 'success');
    
    return newEvent;
  }, []);

  // Update event
  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, updatedAt: new Date().toISOString(), ...updates } : event
      )
    );
    
    addToast('Event updated successfully!', 'success');
  }, []);

  // Delete event
  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    addToast('Event deleted!', 'info');
  }, []);

  // Toggle event completion
  const toggleEventCompletion = useCallback((id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, completed: !event.completed, completedAt: !event.completed ? new Date().toISOString() : null } : event
      )
    );
  }, []);

  // Get events for a specific date
  const getEventsForDate = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event) => event.date === dateStr);
  }, [events]);

  // Get all events
  const getAllEvents = useCallback(() => {
    return events;
  }, [events]);

  // Get upcoming events
  const getUpcomingEvents = useCallback((limit = 5) => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventDate = new Date(`${event.date}T${event.time}`);
        return eventDate >= now && !event.completed;
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, limit);
  }, [events]);

  // Get tasks (events with type 'task')
  const getTasks = useCallback(() => {
    return events.filter((event) => event.type === 'task');
  }, [events]);

  // Get pending tasks
  const getPendingTasks = useCallback(() => {
    return events.filter((event) => event.type === 'task' && !event.completed);
  }, [events]);

  // Add toast notification
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Request notification permission
  const requestPerm = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(checkNotificationPermission());
    if (granted) {
      addToast('Notifications enabled!', 'success');
    } else {
      addToast('Notifications denied. Please enable in browser settings.', 'error');
    }
  }, [addToast]);

  // Open event modal for editing
  const openEditModal = useCallback((event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  }, []);

  // Open event modal for new event
  const openNewEventModal = useCallback((date = null) => {
    setEditingEvent(null);
    if (date) {
      setSelectedDate(date);
    }
    setIsEventModalOpen(true);
  }, []);

  // Close event modal
  const closeEventModal = useCallback(() => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  }, []);

  // Get country name
  const getCountryName = useCallback(() => {
    return COUNTRIES[selectedCountry]?.name || 'United States';
  }, [selectedCountry]);

  const value = {
    // State
    events,
    selectedDate,
    setSelectedDate,
    currentDate,
    setCurrentDate,
    selectedCountry,
    setSelectedCountry,
    notificationPermission,
    toasts,
    isEventModalOpen,
    editingEvent,
    
    // Event actions
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventCompletion,
    getEventsForDate,
    getAllEvents,
    getUpcomingEvents,
    getTasks,
    getPendingTasks,
    
    // Modal actions
    openEditModal,
    openNewEventModal,
    closeEventModal,
    
    // Notification actions
    requestPerm,
    addToast,
    removeToast,
    
    // Helper functions
    getCountryName,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;

