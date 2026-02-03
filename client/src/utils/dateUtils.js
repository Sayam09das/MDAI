// Date utility functions for the calendar

// Format date for display
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'medium':
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'full':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'datetime':
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return d.toLocaleDateString();
  }
};

// Get day name
export const getDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Get short day name
export const getShortDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Get month name
export const getMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

// Get short month name
export const getShortMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short' });
};

// Get days in month
export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Get first day of month (0-6, Sunday = 0)
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Get calendar days for a month (including padding days)
export const getCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(date);
  const firstDay = getFirstDayOfMonth(date);
  
  const days = [];
  
  // Add padding days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDate = new Date(year, month, -i);
    days.push({
      date: dayDate,
      day: dayDate.getDate(),
      isCurrentMonth: false,
      isToday: isToday(dayDate),
      isHoliday: false,
    });
  }
  
  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    days.push({
      date: dayDate,
      day: i,
      isCurrentMonth: true,
      isToday: isToday(dayDate),
      isHoliday: false,
    });
  }
  
  // Add padding days from next month (to complete 6 weeks = 42 days)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const dayDate = new Date(year, month + 1, i);
    days.push({
      date: dayDate,
      day: i,
      isCurrentMonth: false,
      isToday: isToday(dayDate),
      isHoliday: false,
    });
  }
  
  return days;
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Check if date is in the past
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Check if date is in the future
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

// Format time for display
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Parse time string to Date
export const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

// Get relative time description
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = date - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 0) {
    return 'Past';
  }
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} from now`;
  }
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} from now`;
  }
  
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} from now`;
  }
  
  return formatDate(date, 'medium');
};

// Create a date with time
export const createDateTime = (date, time) => {
  const [hours, minutes] = time.split(':');
  const dateTime = new Date(date);
  dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return dateTime;
};

// Add days to a date
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Add months to a date
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Get week number
export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default {
  formatDate,
  getDayName,
  getShortDayName,
  getMonthName,
  getShortMonthName,
  getDaysInMonth,
  getFirstDayOfMonth,
  getCalendarDays,
  isToday,
  isSameDay,
  isPastDate,
  isFutureDate,
  formatTime,
  parseTime,
  getRelativeTime,
  createDateTime,
  addDays,
  addMonths,
  getWeekNumber,
};

