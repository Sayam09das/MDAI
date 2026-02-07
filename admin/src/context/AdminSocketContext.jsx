import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      
      // NOTE: Health subscription DISABLED to prevent notification spam
      // If you want health updates, re-enable this line:
      // socketInstance.emit('subscribe_health_updates');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Admin socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Health updates are disabled - no subscription
    // All health monitoring code removed to prevent notification spam

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up admin socket connection...');
      socketInstance.disconnect();
    };
  }, []);

  // Function to clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value = {
    socket,
    isConnected,
    alerts,
    clearAlerts,
    // Health-related functions disabled
    lastHealthData: null,
    requestHealthUpdate: () => {},
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export default AdminSocketContext;

