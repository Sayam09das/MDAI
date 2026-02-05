import React, { useState, useEffect } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Check, CheckCheck, Image, Smile, AtSign } from "lucide-react";
import { format } from "date-fns";
import { useSocket } from "../../context/SocketContext";
import messageApi from "../../lib/messageApi";
import StudentLayout from "../../components/Dashboard/Student/StudentLayout";

/* ================= STUDENT MESSAGES PAGE ================= */

const StudentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const { socket, isConnected, joinConversation, leaveConversation, sendMessage, sendTypingStart, sendTypingStop, isUserOnline } = useSocket();

  const currentUserId = localStorage.getItem("userId");
  const currentUserModel = "User";

  /* ================= LOAD CONVERSATIONS ================= */

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  /* ================= SOCKET LISTENERS ================= */

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
      }
      loadConversations(); // Refresh conversation list
      loadUnreadCount();
    };

    const handleNewNotification = (data) => {
      if (data.senderId !== currentUserId) {
        loadUnreadCount();
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("new_message_notification", handleNewNotification);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("new_message_notification", handleNewNotification);
    };
  }, [socket, selectedConversation]);

  /* ================= LOAD DATA ================= */

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageApi.getConversations();
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await messageApi.getUnreadCount();
      if (response.success) {
        setUnreadTotal(response.totalUnread);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const loadMessages = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      joinConversation(conversation._id);

      const response = await messageApi.getMessages(conversation._id);
      if (response.success) {
        setMessages(response.messages);
      }

      // Mark as read
      await messageApi.markConversationAsRead(conversation._id);
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const loadContacts = async () => {
    // For students, load their enrolled teachers
    try {
      const response = await messageApi.getMyContacts();
      if (response.success) {
        setContacts(response.contacts);
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);

      const messageData = {
        conversationId: selectedConversation._id,
        recipientId: selectedConversation.otherParticipant.userId,
        recipientModel: selectedConversation.otherParticipant.model,
        content: newMessage.trim(),
        messageType: "text",
      };

      const response = await messageApi.sendMessage(messageData);

      if (response.success) {
        setMessages((prev) => [...prev, response.message]);
        setNewMessage("");
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  /* ================= NEW CHAT ================= */

  const startNewChat = async (contact) => {
    try {
      const response = await messageApi.getOrCreateConversation(contact._id, contact.model);
      if (response.success) {
        setSelectedConversation(response.conversation);
        setShowNewChat(false);
        loadMessages(response.conversation);
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to start new chat:", error);
    }
  };

  /* ================= TYPING INDICATOR ================= */

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (selectedConversation) {
      sendTypingStart(selectedConversation._id, selectedConversation.otherParticipant.userId);

      if (typingTimeout) clearTimeout(typingTimeout);

      setTypingTimeout(
        setTimeout(() => {
          sendTypingStop(selectedConversation._id, selectedConversation.otherParticipant.userId);
        }, 2000)
      );
    }
  };

  /* ================= FORMATTING ================= */

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return format(date, "h:mm a");
    }
    return format(date, "MMM d, h:mm a");
  };

  const formatLastMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(date, "h:mm a");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return format(date, "EEEE");
    }
    return format(date, "MMM d");
  };

  /* ================= FILTER ================= */

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
        {/* ================= CONVERSATION LIST ================= */}
        <div
          className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${
            selectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          {/* HEADER */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button
                onClick={() => {
                  setShowNewChat(!showNewChat);
                  if (!showNewChat) loadContacts();
                }}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* NEW CHAT CONTACTS */}
          {showNewChat && (
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Start a new chat with:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {contacts.map((contact) => (
                  <button
                    key={contact._id}
                    onClick={() => startNewChat(contact)}
                    className="flex items-center gap-3 w-full p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {contact.profileImage ? (
                        <img src={contact.profileImage} alt={contact.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        contact.fullName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{contact.fullName}</p>
                      <p className="text-xs text-gray-500">{contact.model}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CONVERSATIONS */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Send className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
                <button
                  onClick={() => {
                    setShowNewChat(true);
                    loadContacts();
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => loadMessages(conversation)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation?._id === conversation._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {conversation.otherParticipant?.profileImage ? (
                        <img
                          src={conversation.otherParticipant.profileImage}
                          alt={conversation.otherParticipant.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        conversation.otherParticipant?.fullName?.charAt(0) || "?"
                      )}
                    </div>
                    {isUserOnline(conversation.otherParticipant?.userId) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.otherParticipant?.fullName || "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(conversation.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ================= CHAT WINDOW ================= */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    leaveConversation(selectedConversation._id);
                    setSelectedConversation(null);
                  }}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedConversation.otherParticipant?.profileImage ? (
                      <img
                        src={selectedConversation.otherParticipant.profileImage}
                        alt={selectedConversation.otherParticipant.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      selectedConversation.otherParticipant?.fullName?.charAt(0) || "?"
                    )}
                  </div>
                  {isUserOnline(selectedConversation.otherParticipant?.userId) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.otherParticipant?.fullName || "Unknown"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isUserOnline(selectedConversation.otherParticipant?.userId) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => {
                const isOwn = message.sender?._id === currentUserId || message.sender === currentUserId;
                const showDate =
                  index === 0 ||
                  new Date(message.createdAt).toDateString() !==
                    new Date(messages[index - 1].createdAt).toDateString();

                return (
                  <React.Fragment key={message._id || index}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {format(new Date(message.createdAt), "MMMM d, yyyy")}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white text-gray-900 shadow-sm rounded-bl-sm"
                        }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium text-blue-600 mb-1">
                            {message.sender?.fullName || "Unknown"}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            isOwn ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          <span className="text-xs">{formatTime(message.createdAt)}</span>
                          {isOwn && (
                            message.readBy?.length > 1 ? (
                              <CheckCheck className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* MESSAGE INPUT */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-gray-500" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <AtSign className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= NO CHAT SELECTED ================= */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h2>
            <p className="text-gray-500 text-center max-w-sm">
              Select a conversation from the list to start chatting with your teachers.
            </p>
            <button
              onClick={() => {
                setShowNewChat(true);
                loadContacts();
              }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentMessages;

