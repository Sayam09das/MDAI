import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getBackendURL } from "../lib/config";

/* ================= SOCKET CONTEXT ================= */

const SocketContext = createContext(null);

/* ================= MESSAGE NORMALIZATION HELPER ================= */
// Keep this in sync with utils/messageNormalization.js

/**
 * Safely extracts image URL from various formats (string, Cloudinary object)
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

const normalizeMessage = (message, currentUserId) => {
  if (!message) return null;

  const defaultSender = {
    _id: null,
    fullName: "Unknown User",
    profileImage: null,
    role: "unknown",
    email: null
  };

  let sender = defaultSender;
  
  if (message.sender) {
    if (typeof message.sender === 'object') {
      sender = {
        _id: message.sender._id || null,
        fullName: message.sender.fullName || `Unknown ${message.sender.role || ''}`.trim() || "Unknown User",
        profileImage: extractImageUrl(message.sender.profileImage),
        role: message.sender.role || (message.senderModel === "Teacher" ? "teacher" : "student"),
        email: message.sender.email || null
      };
    } else {
      const role = message.senderModel === "Teacher" ? "teacher" : 
                   message.senderModel === "User" ? "student" : "unknown";
      sender = {
        _id: message.sender,
        fullName: `Unknown ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        profileImage: null,
        role: role,
        email: null
      };
    }
  }

  return {
    ...message,
    sender: sender,
    senderModel: message.senderModel || sender.role,
    _id: message._id || message.id
  };
};

/* ================= SOCKET PROVIDER ================= */

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [messages, setMessages] = useState({}); // { conversationId: [messages] }
  const [conversations, setConversations] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const reconnectAttempts = useRef(0);

  // Current user info
  const currentUserId = localStorage.getItem("userId") || localStorage.getItem("teacherId");
  const userRole = localStorage.getItem("role") || "student";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, skipping socket connection");
      return;
    }

    const SOCKET_URL = getBackendURL() || "http://localhost:3000";

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Request online users list
      newSocket.emit("get_online_users");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      reconnectAttempts.current += 1;
    });

    newSocket.on("user_online", (user) => {
      setOnlineUsers((prev) => {
        if (prev.some((u) => u.userId === user.userId)) {
          return prev;
        }
        return [...prev, user];
      });
    });

    newSocket.on("user_offline", (user) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    });

    newSocket.on("online_users_list", (users) => {
      setOnlineUsers(users);
    });

    /* ======================================================
       REAL-TIME MESSAGE HANDLING (WHATSAPP STYLE)
    ====================================================== */
    
    newSocket.on("receive_message", (message) => {
      console.log("📩 New message received:", message);
      
      // Normalize the message
      const normalizedMessage = normalizeMessage(message, currentUserId);
      
      // Add message to conversation
      setMessages((prev) => {
        const convId = message.conversationId;
        const existingMessages = prev[convId] || [];
        
        // Check if message already exists
        if (existingMessages.some(m => m._id === normalizedMessage._id)) {
          return prev;
        }
        
        return {
          ...prev,
          [convId]: [...existingMessages, normalizedMessage]
        };
      });
    });

    newSocket.on("new_message_notification", (data) => {
      console.log("🔔 New message notification:", data);
      
      const { conversationId, message, senderId, senderName, senderRole } = data;
      
      // Increment unread count for this conversation
      setConversations((prev) =>
        prev.map(c => {
          if (c._id === conversationId) {
            return { ...c, unreadCount: (c.unreadCount || 0) + 1 };
          }
          return c;
        })
      );
      
      // Increment total unread
      setTotalUnread((prev) => prev + 1);
    });

    newSocket.on("message_status_update", (data) => {
      console.log("📬 Message status update:", data);
      const { messageId, conversationId, status } = data;
      
      // Update message status in local state
      setMessages((prev) => {
        const convMessages = prev[conversationId];
        if (!convMessages) return prev;
        
        return {
          ...prev,
          [conversationId]: convMessages.map(m => 
            m._id === messageId ? { ...m, status } : m
          )
        };
      });
    });

    /* ======================================================
       TYPING INDICATOR
    ====================================================== */
    
    newSocket.on("user_typing", (data) => {
      const { conversationId, userId, isTyping } = data;
      setTypingUsers((prev) => {
        const key = `${conversationId}_${userId}`;
        if (isTyping) {
          return { ...prev, [key]: true };
        } else {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
      });
    });

    newSocket.on("user_typing_direct", (data) => {
      const { conversationId, userId, isTyping } = data;
      setTypingUsers((prev) => {
        const key = `${conversationId}_${userId}`;
        if (isTyping) {
          return { ...prev, [key]: true };
        } else {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
      });
    });

    /* ======================================================
       ERROR HANDLING
    ====================================================== */
    
    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  /* ======================================================
     CALCULATE TOTAL UNREAD
  ====================================================== */
  
  useEffect(() => {
    // Calculate total unread from conversations
    const total = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    setTotalUnread(total);
  }, [conversations]);

  /* ======================================================
     HELPER FUNCTIONS
  ====================================================== */

  const joinConversation = useCallback(
    (conversationId) => {
      if (socket && isConnected) {
        socket.emit("join_conversation", conversationId);
      }
    },
    [socket, isConnected]
  );

  const leaveConversation = useCallback(
    (conversationId) => {
      if (socket && isConnected) {
        socket.emit("leave_conversation", conversationId);
      }
    },
    [socket, isConnected]
  );

  const sendTypingStart = useCallback(
    (conversationId, recipientId) => {
      if (socket && isConnected) {
        socket.emit("typing_start", { conversationId, recipientId });
      }
    },
    [socket, isConnected]
  );

  const sendTypingStop = useCallback(
    (conversationId, recipientId) => {
      if (socket && isConnected) {
        socket.emit("typing_stop", { conversationId, recipientId });
      }
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (message, conversationId, recipientId) => {
      if (socket && isConnected) {
        socket.emit("new_message", { message, conversationId, recipientId });
      }
    },
    [socket, isConnected]
  );

  const markMessageDelivered = useCallback(
    (messageId, conversationId, senderId) => {
      if (socket && isConnected) {
        socket.emit("message_delivered", { messageId, conversationId, senderId });
      }
    },
    [socket, isConnected]
  );

  const markMessageRead = useCallback(
    (messageId, conversationId, senderId) => {
      if (socket && isConnected) {
        socket.emit("message_read", { messageId, conversationId, senderId });
      }
    },
    [socket, isConnected]
  );

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.some((u) => u.userId === userId);
    },
    [onlineUsers]
  );

  const addMessage = useCallback(
    (conversationId, message) => {
      const normalized = normalizeMessage(message, currentUserId);
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), normalized]
      }));
    },
    [currentUserId]
  );

  const updateMessageStatus = useCallback(
    (conversationId, messageId, status) => {
      setMessages((prev) => {
        const convMessages = prev[conversationId];
        if (!convMessages) return prev;
        
        return {
          ...prev,
          [conversationId]: convMessages.map(m => 
            m._id === messageId ? { ...m, status } : m
          )
        };
      });
    },
    []
  );

  const setConversationsData = useCallback((convs) => {
    setConversations(convs);
  }, []);

  const updateConversationUnread = useCallback((conversationId, count) => {
    setConversations((prev) =>
      prev.map(c => c._id === conversationId ? { ...c, unreadCount: count } : c)
    );
  }, []);

  const clearUnread = useCallback((conversationId) => {
    setTotalUnread((prev) => {
      const conv = conversations.find(c => c._id === conversationId);
      if (conv) {
        return prev - (conv.unreadCount || 0);
      }
      return prev;
    });
    
    setConversations((prev) =>
      prev.map(c => c._id === conversationId ? { ...c, unreadCount: 0 } : c)
    );
  }, [conversations]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    messages,
    conversations,
    totalUnread,
    currentUserId,
    userRole,
    joinConversation,
    leaveConversation,
    sendTypingStart,
    sendTypingStop,
    sendMessage,
    markMessageDelivered,
    markMessageRead,
    isUserOnline,
    addMessage,
    updateMessageStatus,
    setConversationsData,
    updateConversationUnread,
    clearUnread,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

/* ================= USE SOCKET HOOK ================= */

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;

