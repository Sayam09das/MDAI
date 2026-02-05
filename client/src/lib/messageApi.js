/* ================= MESSAGE API ================= */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/* ================= TOKEN HELPER ================= */

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
};

/* ================= GENERIC FETCH WRAPPER ================= */

const fetchMessageAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("Message API Error:", error.message);
    throw error;
  }
};

/* ================= SEND MESSAGE ================= */

export const sendMessage = async (data) => {
  return fetchMessageAPI("/api/messages/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/* ================= GET MESSAGES ================= */

export const getMessages = async (conversationId, page = 1, limit = 50) => {
  return fetchMessageAPI(
    `/api/messages/conversation/${conversationId}?page=${page}&limit=${limit}`
  );
};

/* ================= MARK MESSAGE AS READ ================= */

export const markMessageAsRead = async (messageId) => {
  return fetchMessageAPI(`/api/messages/read/${messageId}`, {
    method: "PATCH",
  });
};

/* ================= MARK CONVERSATION AS READ ================= */

export const markConversationAsRead = async (conversationId) => {
  return fetchMessageAPI(`/api/messages/read/conversation/${conversationId}`, {
    method: "PATCH",
  });
};

/* ================= DELETE MESSAGE ================= */

export const deleteMessage = async (messageId) => {
  return fetchMessageAPI(`/api/messages/${messageId}`, {
    method: "DELETE",
  });
};

/* ================= GET CONVERSATIONS ================= */

export const getConversations = async (page = 1, limit = 20) => {
  return fetchMessageAPI(
    `/api/messages/conversations?page=${page}&limit=${limit}`
  );
};

/* ================= GET OR CREATE CONVERSATION ================= */

export const getOrCreateConversation = async (recipientId, recipientModel) => {
  return fetchMessageAPI("/api/messages/conversations/get-or-create", {
    method: "POST",
    body: JSON.stringify({ recipientId, recipientModel }),
  });
};

/* ================= SEARCH CONVERSATIONS ================= */

export const searchConversations = async (query) => {
  return fetchMessageAPI(
    `/api/messages/conversations/search?q=${encodeURIComponent(query)}`
  );
};

/* ================= GET UNREAD COUNT ================= */

export const getUnreadCount = async () => {
  return fetchMessageAPI("/api/messages/conversations/unread-count");
};

/* ================= ARCHIVE CONVERSATION ================= */

export const archiveConversation = async (conversationId) => {
  return fetchMessageAPI(`/api/messages/conversations/archive/${conversationId}`, {
    method: "PATCH",
  });
};

/* ================= UNARCHIVE CONVERSATION ================= */

export const unarchiveConversation = async (conversationId) => {
  return fetchMessageAPI(`/api/messages/conversations/unarchive/${conversationId}`, {
    method: "PATCH",
  });
};

/* ================= GET ARCHIVED CONVERSATIONS ================= */

export const getArchivedConversations = async (page = 1, limit = 20) => {
  return fetchMessageAPI(
    `/api/messages/conversations/archived?page=${page}&limit=${limit}`
  );
};

/* ================= GET MY CONTACTS (Teachers for Students, Students for Teachers) ================= */

export const getMyContacts = async () => {
  return fetchMessageAPI("/api/messages/contacts");
};

/* ================= EXPORT ================= */

export default {
  sendMessage,
  getMessages,
  markMessageAsRead,
  markConversationAsRead,
  deleteMessage,
  getConversations,
  getOrCreateConversation,
  searchConversations,
  getUnreadCount,
  archiveConversation,
  unarchiveConversation,
  getArchivedConversations,
  getMyContacts,
};

