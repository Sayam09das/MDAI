import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminSocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
      console.log('📊 Received system health update:', data);
      setLastHealthData(data);
    });

    // Handle health subscription confirmation
    socketInstance.on('health_subscription_confirmed', (data) => {
      console.log('✅ Health subscription confirmed:', data);
    });

    // Handle system alerts
    socketInstance.on('system_alert', (alert) => {
      console.log('🚨 Received system alert:', alert);
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      
      // Show toast notification for alerts
      if (alert.type === 'critical') {
        toast.error(`CRITICAL: ${alert.message}`);
      } else if (alert.type === 'warning') {
        toast(`⚠️ ${alert.message}`, { icon: '⚠️' });
      } else {
        toast.success(alert.message);
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

