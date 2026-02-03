 // Notification utilities for browser push notifications

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Check if notifications are supported and permitted
export const checkNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Show a browser notification
export const showBrowserNotification = (title, options = {}) => {
  const permission = checkNotificationPermission();
  
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  const defaultOptions = {
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    silent: false,
    ...options,
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Schedule a notification for a specific time
export const scheduleNotification = (title, options, triggerTime) => {
  const delay = new Date(triggerTime).getTime() - Date.now();
  
  if (delay <= 0) {
    // If the time is in the past, show immediately
    return showBrowserNotification(title, options);
  }

  const timeoutId = setTimeout(() => {
    showBrowserNotification(title, options);
  }, delay);

  return timeoutId;
};

// Cancel a scheduled notification
export const cancelScheduledNotification = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};

// Show a reminder notification
export const showReminderNotification = (task) => {
  const options = {
    body: task.description || 'You have a reminder!',
    tag: `task-${task.id}`,
    data: {
      taskId: task.id,
      type: 'task-reminder',
    },
    actions: [
      { action: 'complete', title: 'Mark Complete' },
      { action: 'snooze', title: 'Snooze 10 min' },
    ],
  };

  return showBrowserNotification(`Reminder: ${task.title}`, options);
};

// Close all notifications
export const closeAllNotifications = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    Notification.closeAll();
  }
};

export default {
  requestNotificationPermission,
  checkNotificationPermission,
  showBrowserNotification,
  scheduleNotification,
  cancelScheduledNotification,
  showReminderNotification,
  closeAllNotifications,
};

