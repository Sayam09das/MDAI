import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

/* ================= SOCKET CONTEXT ================= */

const SocketContext = createContext(null);

/* ================= SOCKET PROVIDER ================= */

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, skipping socket connection");
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

    newSocket.on("receive_message", (message) => {
      // Handle incoming message - this will be listened by chat components
      console.log("📩 New message received:", message);
    });

    newSocket.on("new_message_notification", (data) => {
      // Handle new message notification
      console.log("🔔 New message notification:", data);
    });

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

    newSocket.on("message_status_update", (data) => {
      console.log("Message status update:", data);
    });

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

  /* ================= HELPER FUNCTIONS ================= */

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

  const value = {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    joinConversation,
    leaveConversation,
    sendTypingStart,
    sendTypingStop,
    sendMessage,
    markMessageDelivered,
    markMessageRead,
    isUserOnline,
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

