import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { showBrowserNotification, requestNotificationPermission, checkNotificationPermission } from '../utils/notifications';
import { 
  createEvent as apiCreateEvent,
  getEvents as apiGetEvents,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  toggleEventCompletion as apiToggleEventCompletion,
  getUpcomingEvents as apiGetUpcomingEvents,
  getPendingTasks as apiGetPendingTasks,
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
  // Events state
  const [events, setEvents] = useState([]);
  
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

  // Loading states
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
        await requestNotificationPermission();
        setNotificationPermission(checkNotificationPermission());
      }
    };
    requestPerm();
  }, []);

  // Fetch events from API
  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetEvents(params);
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message);
      // Set empty events on error
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
      
      // Show toast
      addToast('Event created successfully!', 'success');
      
      return data.event;
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.message);
      addToast('Failed to create event', 'error');
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
        prev.map((event) =>
          event.id === id ? { ...event, ...data.event } : event
        )
      );
      
      addToast('Event updated successfully!', 'success');
      return data.event;
    } catch (err) {
      console.error('Failed to update event:', err);
      setError(err.message);
      addToast('Failed to update event', 'error');
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
      setEvents((prev) => prev.filter((event) => event.id !== id));
      addToast('Event deleted!', 'info');
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err.message);
      addToast('Failed to delete event', 'error');
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
        prev.map((event) =>
          event.id === id ? { ...event, ...data.event } : event
        )
      );
      
      const event = events.find(e => e.id === id);
      addToast(
        event && event.completed ? 'Event marked as incomplete' : 'Event marked as complete!',
        'success'
      );
      return data.event;
    } catch (err) {
      console.error('Failed to toggle event:', err);
      setError(err.message);
      addToast('Failed to update event', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [events]);

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
  const getUpcomingEvents = useCallback(async (limit = 5) => {
    try {
      const data = await apiGetUpcomingEvents(limit);
      return data.events || [];
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err);
      // Fallback to local events
      const now = new Date();
      return events
        .filter((event) => {
          const eventDate = new Date(`${event.date}T${event.time}`);
          return eventDate >= now && !event.completed;
        })
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
        .slice(0, limit);
    }
  }, [events]);

  // Get tasks (events with type 'task')
  const getTasks = useCallback(() => {
    return events.filter((event) => event.type === 'task');
  }, [events]);

  // Get pending tasks
  const getPendingTasks = useCallback(async (limit = 10) => {
    try {
      const data = await apiGetPendingTasks(limit);
      return data.tasks || [];
    } catch (err) {
      console.error('Failed to fetch pending tasks:', err);
      // Fallback to local events
      return events.filter((event) => event.type === 'task' && !event.completed).slice(0, limit);
    }
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

