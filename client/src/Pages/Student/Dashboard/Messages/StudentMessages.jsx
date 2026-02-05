import React, { useState, useEffect } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Check, CheckCheck, Image, Smile, AtSign } from "lucide-react";
import { format } from "date-fns";
import { useSocket } from "../../../../context/SocketContext";
import messageApi from "../../../../lib/messageApi";

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

  const {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    isUserOnline
  } = useSocket();

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
      loadConversations();
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
  }, [socket, selectedConversation, currentUserId]);

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

      await messageApi.markConversationAsRead(conversation._id);
      loadUnreadCount();
      loadConversations(); // Refresh to update unread counts
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const loadContacts = async () => {
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
      const response = await messageApi.getOrCreateConversation(
        contact._id,
        contact.model
      );

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
      sendTypingStart(
        selectedConversation._id,
        selectedConversation.otherParticipant.userId
      );

      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        sendTypingStop(
          selectedConversation._id,
          selectedConversation.otherParticipant.userId
        );
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  /* ================= FORMATTING ================= */
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return format(date, "h:mm a");
      }
      return format(date, "MMM d, h:mm a");
    } catch (error) {
      return "";
    }
  };

  const formatLastMessageTime = (dateString) => {
    try {
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
    } catch (error) {
      return "";
    }
  };

  /* ================= FILTER ================= */
  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ================= CONVERSATION LIST ================= */}
      <div
        className={`${
          selectedConversation ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-96 bg-white border-r border-gray-200`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={() => {
              setShowNewChat(!showNewChat);
              if (!showNewChat) loadContacts();
            }}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
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
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Start a new chat with:
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => startNewChat(contact)}
                  className="flex items-center gap-3 w-full p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {contact.profileImage ? (
                      <img
                        src={contact.profileImage}
                        alt={contact.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      contact.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-800">{contact.fullName}</p>
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
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-500 mb-2">No conversations yet</p>
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
                  selectedConversation?._id === conversation._id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
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

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conversation.otherParticipant?.fullName || "Unknown"}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatLastMessageTime(conversation.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
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
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  leaveConversation(selectedConversation._id);
                  setSelectedConversation(null);
                }}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
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
                <h2 className="font-semibold text-gray-800">
                  {selectedConversation.otherParticipant?.fullName || "Unknown"}
                </h2>
                <p className="text-xs text-gray-500">
                  {isUserOnline(selectedConversation.otherParticipant?.userId)
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => {
              const isOwn =
                message.sender?._id === currentUserId ||
                message.sender === currentUserId;

              const showDate =
                index === 0 ||
                new Date(message.createdAt).toDateString() !==
                  new Date(messages[index - 1].createdAt).toDateString();

              return (
                <div key={message._id || index}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {format(new Date(message.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwn ? "items-end" : "items-start"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1 px-1">
                          {message.sender?.fullName || "Unknown"}
                        </p>
                      )}

                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span>{formatTime(message.createdAt)}</span>
                          {isOwn && (
                            message.readBy?.length > 1 ? (
                              <CheckCheck size={14} className="text-blue-200" />
                            ) : (
                              <Check size={14} className="text-blue-200" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MESSAGE INPUT */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Paperclip size={20} className="text-gray-600" />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sendingMessage}
              />

              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ================= NO CHAT SELECTED ================= */
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Messages
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Select a conversation from the list to start chatting with your
              teachers.
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
        </div>
      )}
    </div>
  );
};

export default StudentMessages;