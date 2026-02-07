import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminSocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Track last shown alert to avoid duplicate notifications
let lastAlertId = null;
let lastAlertTime = 0;
const ALERT_COOLDOWN = 30000; // 30 seconds between same alerts

export const useAdminSocket = () => {
  const context = useContext(AdminSocketContext);
  if (!context) {
    throw new Error('useAdminSocket must be used within AdminSocketProvider');
  }
  return context;
};

export const AdminSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastHealthData, setLastHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const lastAlertIdRef = useRef(null);
  const lastAlertTimeRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.log('No admin token found - socket connection skipped');
      return;
    }

    console.log('🔌 Initializing admin socket connection...');

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Admin socket connected:', socketInstance.id);
      setIsConnected(true);
      toast.success('Real-time system monitoring connected');
      
      // Subscribe to health updates
      socketInstance.emit('subscribe_health_updates');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Admin socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Handle system health data updates
    socketInstance.on('system_health', (data) => {
      setLastHealthData(data);
    });

    // Handle health subscription confirmation
    socketInstance.on('health_subscription_confirmed', (data) => {
      console.log('✅ Health subscription confirmed:', data);
    });

    // Handle system alerts with deduplication
    socketInstance.on('system_alert', (alert) => {
      const now = Date.now();
      
      // Skip if same alert within cooldown period
      if (lastAlertIdRef.current === alert.id && (now - lastAlertTimeRef.current) < ALERT_COOLDOWN) {
        console.log('⏭️ Skipping duplicate alert:', alert.message);
        // Just update the alert in the list without notification
        setAlerts((prev) => {
          const exists = prev.find(a => a.id === alert.id);
          if (exists) {
            return prev.map(a => a.id === alert.id ? alert : a);
          }
          return [alert, ...prev.slice(0, 9)];
        });
        return;
      }

      lastAlertIdRef.current = alert.id;
      lastAlertTimeRef.current = now;

      console.log('🚨 Received system alert:', alert);
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]);
      
      // Show toast notification only for significant alerts (not memory warnings > 85%)
      const memPercent = alert.message?.match(/(\d+)%/)?.[1];
      if (memPercent && parseInt(memPercent) >= 85 && alert.type === 'warning') {
        // Don't show toast for memory warnings - just update the UI
        console.log('⏭️ Skipping memory warning toast:', alert.message);
      } else {
        // Show toast for critical alerts or non-memory warnings
        if (alert.type === 'critical') {
          toast.error(`CRITICAL: ${alert.message}`);
        } else if (alert.type === 'warning') {
          toast.warn(`⚠️ ${alert.message}`);
        } else {
          toast.info(alert.message);
        }
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up admin socket connection...');
      socketInstance.disconnect();
    };
  }, []);

  // Function to request fresh health data
  const requestHealthUpdate = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('request_system_health');
    }
  }, [socket, isConnected]);

  // Function to clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    lastAlertIdRef.current = null;
    lastAlertTimeRef.current = 0;
  }, []);

  const value = {
    socket,
    isConnected,
    lastHealthData,
    alerts,
    requestHealthUpdate,
    clearAlerts,
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export default AdminSocketContext;

