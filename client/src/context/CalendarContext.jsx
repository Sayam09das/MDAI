import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { showBrowserNotification, requestNotificationPermission, checkNotificationPermission } from '../utils/notifications';
import { 
  createEvent as apiCreateEvent,
  getEvents as apiGetEvents,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  toggleEventCompletion as apiToggleEventCompletion,
} from '../lib/api/studentApi';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  // Refs for values that don't need re-renders
  const addToastRef = useRef(null);

  // State
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calendar_country') || 'US';
    }
    return 'US';
  });
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [toasts, setToasts] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize notification permission
  useEffect(() => {
    setNotificationPermission(checkNotificationPermission());
  }, []);

  // Persist country to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_country', selectedCountry);
  }, [selectedCountry]);

  // Request notification permission on mount
  useEffect(() => {
    const requestPerm = async () => {
      if (notificationPermission === 'default') {
        const granted = await requestNotificationPermission();
        setNotificationPermission(checkNotificationPermission());
      }
    };
    requestPerm();
  }, [notificationPermission]);

  // Add toast helper - defined early to avoid dependency issues
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  addToastRef.current = addToast;

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetEvents({});
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
  const addEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCreateEvent(eventData);
      setEvents((prev) => [...prev, data.event]);
      addToastRef.current?.('Event created successfully!', 'success');
      return data.event;
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.message);
      addToastRef.current?.('Failed to create event', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event
  const updateEvent = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiUpdateEvent(id, updates);
      setEvents((prev) => 
        Array.isArray(prev) ? prev.map((event) =>
          event.id === id ? { ...event, ...data.event } : event
        ) : []
      );
      addToastRef.current?.('Event updated successfully!', 'success');
      return data.event;
    } catch (err) {
      console.error('Failed to update event:', err);
      setError(err.message);
      addToastRef.current?.('Failed to update event', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteEvent(id);
      setEvents((prev) => 
        Array.isArray(prev) ? prev.filter((event) => event.id !== id) : []
      );
      addToastRef.current?.('Event deleted!', 'info');
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err.message);
      addToastRef.current?.('Failed to delete event', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle event completion
  const toggleEventCompletion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiToggleEventCompletion(id);
      setEvents((prev) => 
        Array.isArray(prev) ? prev.map((event) =>
          event.id === id ? { ...event, ...data.event } : event
        ) : []
      );
      addToastRef.current?.('Event updated!', 'success');
      return data.event;
    } catch (err) {
      console.error('Failed to toggle event:', err);
      setError(err.message);
      addToastRef.current?.('Failed to update event', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get events for a specific date
  const getEventsForDate = useCallback((date) => {
    if (!Array.isArray(events)) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event) => event.date === dateStr);
  }, [events]);

  // Get all events
  const getAllEvents = useCallback(() => {
    return Array.isArray(events) ? events : [];
  }, [events]);

  // Get upcoming events
  const getUpcomingEvents = useCallback((limit = 5) => {
    if (!Array.isArray(events)) return [];
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
    if (!Array.isArray(events)) return [];
    return events.filter((event) => event.type === 'task');
  }, [events]);

  // Get pending tasks
  const getPendingTasks = useCallback((limit = 10) => {
    if (!Array.isArray(events)) return [];
    return events
      .filter((event) => event.type === 'task' && !event.completed)
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.date) - new Date(b.date);
      })
      .slice(0, limit);
  }, [events]);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Request notification permission
  const requestPerm = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(checkNotificationPermission());
    if (granted) {
      addToastRef.current?.('Notifications enabled!', 'success');
    } else {
      addToastRef.current?.('Notifications denied. Please enable in browser settings.', 'error');
    }
  }, []);

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
    const COUNTRIES = {
      US: { name: 'United States' },
      UK: { name: 'United Kingdom' },
      IN: { name: 'India' },
      CA: { name: 'Canada' },
      AU: { name: 'Australia' },
      DE: { name: 'Germany' },
      FR: { name: 'France' },
      JP: { name: 'Japan' },
    };
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
    loading,
    error,
    
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
    refreshEvents: fetchEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;

