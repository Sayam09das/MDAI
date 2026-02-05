import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

/* ======================================================
   SOCKET.IO SETUP FOR REAL-TIME MESSAGING
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
          profileImage: senderData.profileImage || null,
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

    // Broadcast online status
    socket.broadcast.emit("user_online", {
      userId: socket.user.id,
      role: socket.user.role,
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

      // Broadcast offline status
      socket.broadcast.emit("user_offline", {
        userId: socket.user.id,
        role: socket.user.role,
      });
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

// Send notification to specific user
export const sendNotificationToUser = (io, userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

// Broadcast to all online users
export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

export default setupSocket;

