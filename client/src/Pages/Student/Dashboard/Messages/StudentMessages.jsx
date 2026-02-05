import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, Check, CheckCheck, Image, Smile, X, Camera, Mic } from "lucide-react";
import { format } from "date-fns";
import { useSocket } from "../../../../context/SocketContext";
import messageApi from "../../../../lib/messageApi";
import { normalizeMessage, normalizeMessages, normalizeConversation, normalizeConversations } from "../../../../utils/messageNormalization";
import { useSearchParams } from "react-router-dom";

/* ================= STUDENT MESSAGES PAGE - WHATSAPP STYLE ================= */

const StudentMessages = () => {
  const [searchParams] = useSearchParams();
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
  const [typingUsers, setTypingUsers] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  /* ================= SCROLL TO BOTTOM ================= */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================= LOAD CONVERSATIONS ================= */
  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  /* ================= HANDLE CONVERSATION FROM URL PARAMS ================= */
  useEffect(() => {
    const handleConversationFromParams = async () => {
      const convId = searchParams.get('conversation');
      
      // Wait for conversations to be loaded
      if (!convId || loading) return;

      // Check if conversation exists in the list
      let conv = conversations.find(c => c._id === convId);
      
      if (conv) {
        await loadMessages(conv);
      } else {
        // Try to fetch conversation directly
        try {
          // First try to find the conversation by getting messages
          const response = await messageApi.getMessages(convId);
          if (response.success || response.messages) {
            const messages = response.messages || [];
            if (messages.length > 0) {
              // Find the other participant (not current user)
              const otherMsg = messages.find(m => {
                const senderId = m.sender?._id || m.sender;
                return senderId !== currentUserId;
              }) || messages[messages.length - 1];
              
              const sender = otherMsg?.sender || {};
              const minimalConv = {
                _id: convId,
                otherParticipant: {
                  userId: sender._id || sender,
                  fullName: sender.fullName || "Unknown",
                  profileImage: sender.profileImage || null,
                  model: sender.role === "teacher" ? "Teacher" : "User"
                },
                lastMessage: messages[0]
              };
              await loadMessages(minimalConv);
            }
          } else {
            // Try getOrCreateConversation as fallback
            const createResponse = await messageApi.getOrCreateConversation(convId, "Teacher");
            if (createResponse.success && createResponse.conversation) {
              await loadMessages(createResponse.conversation);
            }
          }
        } catch (err) {
          console.error("Failed to load conversation:", err);
        }
      }
      
      // Clear the URL param without refreshing
      if (window.location.search.includes('conversation=')) {
        window.history.replaceState({}, '', '/student-dashboard/messages');
      }
    };

    // Run when conversations are loaded or when searchParams change
    handleConversationFromParams();
  }, [conversations, searchParams, loading, currentUserId]);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log("📨 Received message:", message);

      const normalizedMsg = normalizeMessage(message, currentUserId);

      if (selectedConversation && normalizedMsg.conversationId === selectedConversation._id) {
        setMessages((prev) => {
          const exists = prev.some(m => m._id === normalizedMsg._id);
          if (exists) return prev;
          return [...prev, normalizedMsg];
        });
      }
      loadConversations();
      loadUnreadCount();
    };

    const handleNewNotification = (data) => {
      console.log("🔔 New notification:", data);

      if (data.message) {
        const normalizedMsg = normalizeMessage(data.message, currentUserId);
        data.normalizedMessage = normalizedMsg;
      }

      if (data.senderId !== currentUserId) {
        loadUnreadCount();
      }
    };

    const handleTypingStart = (data) => {
      console.log("✍️ User typing:", data);
      if (data.conversationId === selectedConversation?._id) {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: {
            fullName: data.fullName || "Someone",
            timestamp: Date.now()
          }
        }));
      }
    };

    const handleTypingStop = (data) => {
      console.log("🛑 User stopped typing:", data);
      setTypingUsers(prev => {
        const updated = { ...prev };
        delete updated[data.userId];
        return updated;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("new_message_notification", handleNewNotification);
    socket.on("typing_start", handleTypingStart);
    socket.on("typing_stop", handleTypingStop);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("new_message_notification", handleNewNotification);
      socket.off("typing_start", handleTypingStart);
      socket.off("typing_stop", handleTypingStop);
    };
  }, [socket, selectedConversation, currentUserId]);

  /* ================= CLEANUP TYPING TIMEOUT ================= */
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  /* ================= LOAD DATA ================= */
  const loadConversations = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await messageApi.getConversations();
      if (response.success) {
        const normalizedConvs = normalizeConversations(response.conversations || []);
        setConversations(normalizedConvs);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setError(error.message);
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
      const normalizedConv = normalizeConversation(conversation);
      setSelectedConversation(normalizedConv);
      joinConversation(normalizedConv._id);

      const response = await messageApi.getMessages(normalizedConv._id);
      if (response.success) {
        const normalizedMsgs = normalizeMessages(response.messages, currentUserId);
        setMessages(normalizedMsgs);
      }

      await messageApi.markConversationAsRead(normalizedConv._id);
      loadUnreadCount();
      loadConversations();
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
        const normalizedMsg = normalizeMessage(response.message, currentUserId);
        setMessages((prev) => [...prev, normalizedMsg]);
        setNewMessage("");
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  /* ================= HANDLE IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedConversation) return;

    // Check if file is image
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select only images or videos');
      return;
    }

    try {
      setSendingMessage(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', selectedConversation._id);
      formData.append('recipientId', selectedConversation.otherParticipant.userId);
      formData.append('recipientModel', selectedConversation.otherParticipant.model);
      formData.append('messageType', file.type.startsWith('image/') ? 'image' : 'video');

      const response = await messageApi.sendMediaMessage(formData);

      if (response.success) {
        const normalizedMsg = normalizeMessage(response.message, currentUserId);
        setMessages((prev) => [...prev, normalizedMsg]);
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to send media:", error);
      alert('Failed to send media. Please try again.');
    } finally {
      setSendingMessage(false);
      e.target.value = '';
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

  /* ================= EMOJI PICKER ================= */
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '👏', '😍', '🥰', '😎', '🤔', '😢', '😭', '😡', '🤗', '🙌', '💪'];

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  /* ================= FORMATTING ================= */
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
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

  /* ================= TYPING INDICATOR COMPONENT ================= */
  const TypingIndicator = () => {
    const typingUsersList = Object.values(typingUsers);
    if (typingUsersList.length === 0) return null;

    return (
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-2">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg px-3 py-2 shadow-sm rounded-tl-none">
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {typingUsersList[0].fullName} is typing...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ================= GET TYPING STATUS FOR CONVERSATION LIST ================= */
  const getTypingStatus = (conversationId) => {
    const typingInConv = Object.entries(typingUsers).find(
      ([userId, data]) => conversations.find(c => c._id === conversationId)
    );
    return typingInConv ? `${typingInConv[1].fullName} is typing...` : null;
  };

  /* ================= FILTER ================= */
  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* ================= CONVERSATION LIST (LEFT SIDEBAR) ================= */}
      <div
        className={`${selectedConversation ? "hidden lg:flex" : "flex"
          } w-full lg:w-[420px] xl:w-[480px] bg-white border-r border-gray-200 flex-col`}
      >
        {/* HEADER */}
        <div className="bg-[#f0f2f5] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
              <h1 className="text-lg font-medium text-gray-900">Messages</h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setShowNewChat(!showNewChat);
                  if (!showNewChat) loadContacts();
                }}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="New chat"
              >
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-3 py-2 bg-white border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-lg text-sm focus:outline-none border-none"
            />
          </div>
        </div>

        {/* NEW CHAT MODAL */}
        {showNewChat && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col lg:relative">
            <div className="bg-blue-600 px-4 py-5 flex items-center gap-6">
              <button
                onClick={() => setShowNewChat(false)}
                className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-white text-lg font-medium">New chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p className="text-sm">No contacts available</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact._id}
                    onClick={() => startNewChat(contact)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6f6] transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {contact.profileImage ? (
                        <img
                          src={contact.profileImage}
                          alt={contact.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        contact.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 text-left border-b border-gray-100 pb-3">
                      <p className="text-gray-900 font-medium">{contact.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {contact.model === "Teacher" ? "Teacher" : contact.model}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* CONVERSATIONS */}
        <div className="flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-center mb-2">No conversations yet</p>
              <button
                onClick={() => {
                  setShowNewChat(true);
                  loadContacts();
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const typingStatus = getTypingStatus(conversation._id);

              return (
                <button
                  key={conversation._id}
                  onClick={() => loadMessages(conversation)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6f6] transition-colors ${selectedConversation?._id === conversation._id ? "bg-[#f0f2f5]" : ""
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                      {conversation.otherParticipant?.profileImage ? (
                        <img
                          src={conversation.otherParticipant.profileImage}
                          alt={conversation.otherParticipant.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        conversation.otherParticipant?.fullName?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    {isUserOnline(conversation.otherParticipant?.userId) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 border-b border-gray-100 pb-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2">
                        {conversation.otherParticipant?.fullName || "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatLastMessageTime(conversation.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {typingStatus ? (
                        <p className="text-sm text-blue-600 italic truncate flex-1">
                          {typingStatus}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                      )}
                      {conversation.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-[#25d366] text-white text-xs rounded-full flex items-center justify-center font-medium flex-shrink-0">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ================= CHAT WINDOW (RIGHT SIDE) ================= */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-[#efeae2] relative">
          {/* CHAT BACKGROUND PATTERN */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* CHAT HEADER */}
          <div className="bg-[#f0f2f5] px-4 py-2 flex items-center justify-between border-b border-gray-200 relative z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  leaveConversation(selectedConversation._id);
                  setSelectedConversation(null);
                }}
                className="lg:hidden p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                  {selectedConversation.otherParticipant?.profileImage ? (
                    <img
                      src={selectedConversation.otherParticipant.profileImage}
                      alt={selectedConversation.otherParticipant.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedConversation.otherParticipant?.fullName?.charAt(0).toUpperCase() || "?"
                  )}
                </div>
                {isUserOnline(selectedConversation.otherParticipant?.userId) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-medium text-gray-900 text-sm">
                  {selectedConversation.otherParticipant?.fullName || "Unknown"}
                </h2>
                <p className="text-xs text-gray-500">
                  {Object.keys(typingUsers).length > 0
                    ? "typing..."
                    : isUserOnline(selectedConversation.otherParticipant?.userId)
                      ? "online"
                      : "offline"
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 relative z-10">
            {messages.map((message, index) => {
              // FIX: Check multiple sender ID formats
              const senderId = message.sender?._id || message.sender || message.senderId;
              const isOwn = senderId === currentUserId;

              const showDate =
                index === 0 ||
                new Date(message.createdAt).toDateString() !==
                new Date(messages[index - 1].createdAt).toDateString();

              return (
                <React.Fragment key={message._id || index}>
                  {showDate && (
                    <div className="flex justify-center my-3">
                      <span className="bg-white shadow-sm px-3 py-1 rounded-md text-xs text-gray-600">
                        {format(new Date(message.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className={`flex mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%]`}>
                      <div
                        className={`rounded-lg px-3 py-2 shadow-sm ${isOwn
                            ? "bg-[#d9fdd3] rounded-tr-none"
                            : "bg-white rounded-tl-none"
                          }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-semibold text-blue-600 mb-1">
                            {message.sender?.fullName || "Unknown"}
                          </p>
                        )}

                        {/* IMAGE/VIDEO MESSAGE */}
                        {(message.messageType === 'image' || message.messageType === 'video') && message.mediaUrl && (
                          <div className="mb-1">
                            {message.messageType === 'image' ? (
                              <img
                                src={message.mediaUrl}
                                alt="Shared image"
                                className="rounded-lg max-w-full h-auto max-h-64 object-cover cursor-pointer"
                                onClick={() => window.open(message.mediaUrl, '_blank')}
                              />
                            ) : (
                              <video
                                src={message.mediaUrl}
                                controls
                                className="rounded-lg max-w-full h-auto max-h-64"
                              />
                            )}
                          </div>
                        )}

                        {/* TEXT MESSAGE */}
                        {message.content && (
                          <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-gray-500">
                            {formatTime(message.createdAt)}
                          </span>
                          {isOwn && (
                            message.readBy?.length > 1 ? (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-500" />
                            )
                          )}
                        </div>
                      </div>
                      {/* Message tail */}
                      <div
                        className={`absolute top-0 w-0 h-0 ${isOwn
                            ? "right-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-[#d9fdd3]"
                            : "left-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-white"
                          }`}
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* TYPING INDICATOR */}
            <TypingIndicator />

            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE INPUT */}
          <div className="bg-[#f0f2f5] px-3 py-2 relative z-10">
            {/* EMOJI PICKER */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg p-3 grid grid-cols-10 gap-2 max-w-md">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <Smile className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <Image className="w-6 h-6" />
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 bg-white rounded-lg flex items-end">
                <textarea
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message"
                  rows={1}
                  className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none resize-none max-h-32 text-sm"
                  style={{ minHeight: '44px' }}
                  disabled={sendingMessage}
                />
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {sendingMessage ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : newMessage.trim() ? (
                  <Send className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ================= NO CHAT SELECTED ================= */
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5]">
          <div className="text-center px-8 max-w-md">
            <div className="w-64 h-64 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full opacity-50"></div>
              <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-24 h-24 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-light text-gray-800 mb-3">
              Student Messages
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Send and receive messages without keeping your phone online.
              <br />
              Select a conversation to start chatting with your teachers.
            </p>
            <button
              onClick={() => {
                setShowNewChat(true);
                loadContacts();
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
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