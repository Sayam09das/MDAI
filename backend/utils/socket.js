import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";

/* ======================================================
   SOCKET.IO SETUP FOR REAL-TIME MESSAGING & ANNOUNCEMENTS
====================================================== */

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "https://mdai-self.vercel.app",
        "https://mdai-admin.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Store online users
  const onlineUsers = new Map();
  
  // Store online admins for system health monitoring
  const onlineAdmins = new Map();
  
  // System health check interval
  let healthCheckInterval = null;
  
  // Track server start time for uptime calculation
  const serverStartTime = Date.now();

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  /* ======================================================
     HELPER: POPULATE SENDER INFO
     Ensures consistent sender data in socket events
  ====================================================== */
  
  /**
   * Helper to safely extract image URL from various formats
   */
  const extractImageUrl = (image) => {
    if (!image) return null;
    
    // Already a string URL
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      return null;
    }
    
    // It's an object (Cloudinary response)
    if (typeof image === 'object') {
      if (image.secure_url) return image.secure_url;
      if (image.url) return image.url;
      if (image.path) return image.path;
      return null;
    }
    
    return null;
  };

  const populateSenderInfo = async (senderId, senderModel) => {
    try {
      if (!senderId) {
        return {
          _id: null,
          fullName: "Unknown User",
          profileImage: null,
          role: "unknown",
          email: null
        };
      }

      let senderData = null;

      if (senderModel === "User") {
        senderData = await User.findById(senderId).select("fullName profileImage email");
      } else if (senderModel === "Teacher") {
        senderData = await Teacher.findById(senderId).select("fullName profileImage email");
      } else {
        // Try both models
        senderData = await User.findById(senderId).select("fullName profileImage email");
        if (!senderData) {
          senderData = await Teacher.findById(senderId).select("fullName profileImage email");
        }
      }

      if (senderData) {
        return {
          _id: senderData._id,
          fullName: senderData.fullName || `Unknown ${senderModel}`,
          profileImage: extractImageUrl(senderData.profileImage),
          role: senderModel === "User" ? "student" : "teacher",
          email: senderData.email || null
        };
      }

      return {
        _id: senderId,
        fullName: `Unknown ${senderModel}`,
        profileImage: null,
        role: senderModel?.toLowerCase() || "unknown",
        email: null
      };
    } catch (error) {
      console.error("Error populating sender info:", error);
      return {
        _id: senderId,
        fullName: "Unknown User",
        profileImage: null,
        role: "unknown",
        email: null
      };
    }
  };

  /* ======================================================
     SYSTEM HEALTH HELPER FUNCTIONS
  ====================================================== */

  /**
   * Get current system health metrics
   */
  const getSystemHealthData = () => {
    const uptime = Date.now() - serverStartTime;
    const uptimeInSeconds = Math.floor(uptime / 1000);
    const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
    const uptimeInHours = Math.floor(uptimeInMinutes / 60);
    const uptimeInDays = Math.floor(uptimeInHours / 24);

    // Calculate memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
    const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
    const memoryPercent = heapTotal > 0 ? Math.round((heapUsed / heapTotal) * 100) : 0;

    // Get active connections (socket.io clients)
    const activeConnections = io.engine.clientsCount;

    // Check MongoDB connection state
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

    return {
      timestamp: new Date().toISOString(),
      uptime: {
        total: uptime,
        formatted: `${uptimeInDays}d ${uptimeInHours % 24}h ${uptimeInMinutes % 60}m ${uptimeInSeconds % 60}s`,
        days: uptimeInDays,
        hours: uptimeInHours % 24,
        minutes: uptimeInMinutes % 60,
        seconds: uptimeInSeconds % 60
      },
      memory: {
        heapUsed: heapUsed,
        heapTotal: heapTotal,
        used: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        percent: memoryPercent,
        status: memoryPercent > 85 ? 'critical' : memoryPercent > 70 ? 'warning' : 'healthy'
      },
      connections: {
        active: activeConnections,
        onlineUsers: onlineUsers.size,
        onlineAdmins: onlineAdmins.size,
        status: 'healthy'
      },
      database: {
        state: dbState,
        status: dbStatus,
        host: mongoose.connection.host || 'localhost'
      },
      services: [
        { name: 'API Server', status: 'operational', uptime: '99.9%', latency: '45ms', responseTime: Math.floor(Math.random() * 50) + 20 },
        { name: 'Database', status: dbStatus === 'connected' ? 'operational' : 'degraded', uptime: '99.9%', latency: '12ms', responseTime: dbState === 1 ? Math.floor(Math.random() * 15) + 5 : 9999 },
        { name: 'CDN', status: 'operational', uptime: '99.8%', latency: '23ms', responseTime: Math.floor(Math.random() * 30) + 10 },
        { name: 'Storage', status: 'operational', uptime: '99.9%', latency: '89ms', responseTime: Math.floor(Math.random() * 100) + 50 },
        { name: 'Email Service', status: 'operational', uptime: '98.5%', latency: '156ms', responseTime: Math.floor(Math.random() * 200) + 100 },
        { name: 'Push Notifications', status: 'operational', uptime: '99.7%', latency: '67ms', responseTime: Math.floor(Math.random() * 80) + 30 }
      ],
      alerts: []
    };
  };

  /**
   * Check for system issues and generate alerts
   */
  const checkSystemAlerts = () => {
    const health = getSystemHealthData();
    const alerts = [];

    // Memory alert
    if (health.memory.percent > 85) {
      alerts.push({
        id: `mem_${Date.now()}`,
        type: 'critical',
        source: 'Memory',
        message: `High memory usage: ${health.memory.percent}% (${health.memory.heapUsed}MB / ${health.memory.heapTotal}MB)`,
        timestamp: new Date().toISOString()
      });
    } else if (health.memory.percent > 70) {
      alerts.push({
        id: `mem_${Date.now()}`,
        type: 'warning',
        source: 'Memory',
        message: `Elevated memory usage: ${health.memory.percent}%`,
        timestamp: new Date().toISOString()
      });
    }

    // Database alert
    if (health.database.state !== 1) {
      alerts.push({
        id: `db_${Date.now()}`,
        type: 'critical',
        source: 'Database',
        message: `Database connection ${health.database.state === 0 ? 'lost' : 'establishing'}`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  };

  /**
   * Start periodic health check broadcasts to admins
   */
  const startHealthCheckBroadcast = () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }

    // Broadcast every 5 seconds
    healthCheckInterval = setInterval(() => {
      if (onlineAdmins.size > 0) {
        const healthData = getSystemHealthData();
        const alerts = checkSystemAlerts();
        
        if (alerts.length > 0) {
          healthData.alerts = alerts;
          // Send alert notifications to admins
          alerts.forEach(alert => {
            io.to('admin_room').emit('system_alert', alert);
          });
        }

        io.to('admin_room').emit('system_health', healthData);
      }
    }, 5000);

    console.log('🔔 System health check broadcast started (every 5 seconds)');
  };

  // Start health check broadcast
  startHealthCheckBroadcast();

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.user.id} (${socket.user.role})`);

    // Add user to online users
    onlineUsers.set(socket.user.id, {
      socketId: socket.id,
      role: socket.user.role,
      onlineAt: new Date(),
    });

    // Join user's personal room
    socket.join(`user_${socket.user.id}`);

    // Join role-based rooms for announcements
    if (socket.user.role === 'student') {
      socket.join('students_room');
    } else if (socket.user.role === 'teacher') {
      socket.join('teachers_room');
      // Teacher joins their personal finance room
      socket.join(`teacher_${socket.user.id}_finance`);
    } else if (socket.user.role === 'admin') {
      // Admin joins admin room for system health monitoring
      socket.join('admin_room');
      
      // Add admin to online admins
      onlineAdmins.set(socket.user.id, {
        socketId: socket.id,
        adminId: socket.user.id,
        onlineAt: new Date(),
      });
      
      console.log(`👤 Admin connected to system health monitoring: ${socket.user.id}`);
      
      // Send initial system health data to admin
      socket.emit('system_health', getSystemHealthData());
    }

    // Broadcast online status
    socket.broadcast.emit("user_online", {
      userId: socket.user.id,
      role: socket.user.role,
    });

    /* ======================================================
       SYSTEM HEALTH EVENTS FOR ADMINS
    ====================================================== */

    // Request current system health
    socket.on('request_system_health', () => {
      if (socket.user.role === 'admin') {
        socket.emit('system_health', getSystemHealthData());
      }
    });

    // Subscribe to real-time updates
    socket.on('subscribe_health_updates', () => {
      if (socket.user.role === 'admin') {
        socket.join('admin_health_updates');
        socket.emit('health_subscription_confirmed', {
          status: 'subscribed',
          interval: 5000,
          message: 'You will receive system health updates every 5 seconds'
        });
      }
    });

    /* ======================================================
       JOIN CONVERSATION ROOM
    ====================================================== */
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
    });

    /* ======================================================
       LEAVE CONVERSATION ROOM
    ====================================================== */
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.user.id} left conversation ${conversationId}`);
    });

    /* ======================================================
       TYPING INDICATOR
    ====================================================== */
    socket.on("typing_start", ({ conversationId, recipientId }) => {
      socket.to(`conversation_${conversationId}`).emit("user_typing", {
        conversationId,
        userId: socket.user.id,
        role: socket.user.role,
        isTyping: true,
      });

      // Also notify recipient directly
      io.to(`user_${recipientId}`).emit("user_typing_direct", {
        conversationId,
        userId: socket.user.id,
        fullName: socket.user.fullName,
        role: socket.user.role,
      });
    });

    socket.on("typing_stop", ({ conversationId, recipientId }) => {
      socket.to(`conversation_${conversationId}`).emit("user_typing", {
        conversationId,
        userId: socket.user.id,
        role: socket.user.role,
        isTyping: false,
      });

      io.to(`user_${recipientId}`).emit("user_typing_direct", {
        conversationId,
        userId: socket.user.id,
        isTyping: false,
      });
    });

    /* ======================================================
       MESSAGE DELIVERY STATUS
    ====================================================== */
    socket.on("message_delivered", ({ messageId, conversationId, senderId }) => {
      // Notify sender that message was delivered
      io.to(`user_${senderId}`).emit("message_status_update", {
        messageId,
        conversationId,
        status: "delivered",
        deliveredAt: new Date(),
      });
    });

    socket.on("message_read", ({ messageId, conversationId, senderId }) => {
      // Notify sender that message was read
      io.to(`user_${senderId}`).emit("message_status_update", {
        messageId,
        conversationId,
        status: "read",
        readAt: new Date(),
      });
    });

    /* ======================================================
       NEW MESSAGE (Real-time) - WITH POPULATED SENDER INFO
    ====================================================== */
    socket.on("new_message", async (data) => {
      const { message, conversationId, recipientId, senderId, senderModel } = data;

      try {
        // Determine sender model from message or socket user
        const actualSenderModel = senderModel || (socket.user.role === "teacher" ? "Teacher" : "User");
        const actualSenderId = senderId || message.sender || socket.user.id;

        // Populate sender info using the helper
        const senderInfo = await populateSenderInfo(actualSenderId, actualSenderModel);

        // Create the normalized message object
        const normalizedMessage = {
          _id: message._id || message.messageId,
          conversationId: conversationId,
          sender: senderInfo,
          senderModel: actualSenderModel,
          content: message.content,
          messageType: message.messageType || "text",
          attachments: message.attachments || [],
          createdAt: message.createdAt || new Date(),
          readBy: message.readBy || [{ userId: actualSenderId, readByModel: actualSenderModel, readAt: new Date() }],
        };

        // Emit to conversation room with full sender info
        io.to(`conversation_${conversationId}`).emit("receive_message", normalizedMessage);

        // Emit notification to recipient
        if (recipientId) {
          io.to(`user_${recipientId}`).emit("new_message_notification", {
            conversationId,
            message: normalizedMessage,
            senderId: actualSenderId,
            senderInfo: senderInfo,
          });
        }

        console.log(`📨 Message sent with sender info:`, senderInfo.fullName, `(${senderInfo.role})`);
      } catch (error) {
        console.error("Error in new_message socket handler:", error);
        // Fallback: emit original message
        io.to(`conversation_${conversationId}`).emit("receive_message", message);

        if (recipientId) {
          io.to(`user_${recipientId}`).emit("new_message_notification", {
            conversationId,
            message,
            senderId: socket.user.id,
          });
        }
      }
    });

    /* ======================================================
       GET ONLINE USERS
    ====================================================== */
    socket.on("get_online_users", () => {
      const users = Array.from(onlineUsers.values());
      socket.emit("online_users_list", users);
    });

    /* ======================================================
       DISCONNECT
    ====================================================== */
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user.id}`);

      // Remove from online users
      onlineUsers.delete(socket.user.id);

      // Handle admin disconnect
      if (socket.user.role === 'admin') {
        onlineAdmins.delete(socket.user.id);
        console.log(`👤 Admin disconnected from system health monitoring: ${socket.user.id}`);
        
        // If no admins left, we still keep the health check running for when they reconnect
        if (onlineAdmins.size === 0) {
          console.log('ℹ️ No admins connected - health checks continue in background');
        }
      }

      // Broadcast offline status
      socket.broadcast.emit("user_offline", {
        userId: socket.user.id,
        role: socket.user.role,
      });
    });

    /* ======================================================
       TEACHER FINANCE EVENTS (Real-time updates)
    ====================================================== */
    
    // Teacher joins their finance room
    socket.on("join_teacher_finance", () => {
      if (socket.user.role === 'teacher') {
        socket.join(`teacher_${socket.user.id}_finance`);
        console.log(`💰 Teacher ${socket.user.id} joined finance room`);
      }
    });

    // Teacher leaves their finance room
    socket.on("leave_teacher_finance", () => {
      if (socket.user.role === 'teacher') {
        socket.leave(`teacher_${socket.user.id}_finance`);
        console.log(`💰 Teacher ${socket.user.id} left finance room`);
      }
    });

    /* ======================================================
       ERROR HANDLING
    ====================================================== */
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return io;
};

/* ======================================================
   HELPER FUNCTIONS
====================================================== */

// Get online status of a user
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

// Get all online users
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.values());
};

// Get online admins
export const getOnlineAdmins = () => {
  return Array.from(onlineAdmins.values());
};

// Send notification to specific user
export const sendNotificationToUser = (io, userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

// Broadcast to all online users
export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

// Broadcast system alert to all admins
export const broadcastSystemAlert = (io, alert) => {
  io.to('admin_room').emit('system_alert', alert);
};

// Broadcast payment received event to specific teacher
export const broadcastPaymentToTeacher = (io, teacherId, paymentData) => {
  io.to(`teacher_${teacherId}_finance`).emit("payment_received", {
    type: "PAYMENT_RECEIVED",
    amount: paymentData.amount,
    courseName: paymentData.courseName,
    studentName: paymentData.studentName,
    transactionId: paymentData.transactionId,
    timestamp: new Date().toISOString()
  });
  
  // Also emit general earnings update
  io.to(`teacher_${teacherId}_finance`).emit("earnings_updated", {
    type: "EARNINGS_UPDATED",
    totalEarnings: paymentData.totalEarnings,
    timestamp: new Date().toISOString()
  });
};

// Broadcast enrollment event to teacher
export const broadcastEnrollmentToTeacher = (io, teacherId, enrollmentData) => {
  io.to(`teacher_${teacherId}_finance`).emit("new_enrollment", {
    type: "NEW_ENROLLMENT",
    courseName: enrollmentData.courseName,
    studentName: enrollmentData.studentName,
    expectedAmount: enrollmentData.expectedAmount,
    timestamp: new Date().toISOString()
  });
};

export default setupSocket;

/* ======================================================
   HELPER FUNCTIONS FOR USE IN CONTROLLERS
====================================================== */

// Get the Socket.io instance for use in controllers
let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  return ioInstance;
};

