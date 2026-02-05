/* ================= MESSAGE NORMALIZATION UTILITY ================= 
   Ensures consistent message structure across all sources
   (API responses, socket events, local state)
*/

/**
 * Normalizes a message object to always have proper sender info
 * Handles cases where sender might be just an ID or missing fields
 */
export const normalizeMessage = (message, currentUserId) => {
  if (!message) return null;

  // Default sender structure
  const defaultSender = {
    _id: null,
    fullName: "Unknown User",
    profileImage: null,
    role: "unknown",
    email: null
  };

  // Handle sender normalization
  let sender = defaultSender;
  
  if (message.sender) {
    if (typeof message.sender === 'object') {
      // Sender is already an object
      sender = {
        _id: message.sender._id || null,
        fullName: message.sender.fullName || `Unknown ${message.sender.role || ''}`.trim() || "Unknown User",
        profileImage: message.sender.profileImage || null,
        role: message.sender.role || (message.senderModel === "Teacher" ? "teacher" : "student"),
        email: message.sender.email || null
      };
    } else {
      // Sender is just an ID - use the senderModel to provide context
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

  // Determine if message is from current user
  const isOwn = sender._id === currentUserId || 
                message.sender === currentUserId ||
                (message.senderModel === "Teacher" && currentUserId?.startsWith('teacher')) ||
                (message.senderModel === "User" && !currentUserId?.startsWith('teacher'));

  return {
    ...message,
    sender: sender,
    senderModel: message.senderModel || sender.role,
    isOwn: isOwn,
    _id: message._id || message.id
  };
};

/**
 * Normalizes an array of messages
 */
export const normalizeMessages = (messages, currentUserId) => {
  if (!Array.isArray(messages)) return [];
  return messages.map(msg => normalizeMessage(msg, currentUserId));
};

/**
 * Normalizes a conversation object
 */
export const normalizeConversation = (conversation) => {
  if (!conversation) return null;

  const defaultParticipant = {
    userId: null,
    fullName: "Unknown User",
    profileImage: null,
    model: "unknown"
  };

  let otherParticipant = defaultParticipant;

  if (conversation.otherParticipant) {
    if (typeof conversation.otherParticipant === 'object') {
      otherParticipant = {
        userId: conversation.otherParticipant.userId || conversation.otherParticipant._id || null,
        fullName: conversation.otherParticipant.fullName || "Unknown User",
        profileImage: conversation.otherParticipant.profileImage || null,
        model: conversation.otherParticipant.model || conversation.otherParticipant.participantsModel || "unknown"
      };
    } else {
      otherParticipant = {
        userId: conversation.otherParticipant,
        fullName: "Unknown User",
        profileImage: null,
        model: "unknown"
      };
    }
  }

  return {
    ...conversation,
    otherParticipant: otherParticipant,
    _id: conversation._id || conversation.id
  };
};

/**
 * Normalizes an array of conversations
 */
export const normalizeConversations = (conversations) => {
  if (!Array.isArray(conversations)) return [];
  return conversations.map(conv => normalizeConversation(conv));
};

/**
 * Extracts user display name with fallback
 */
export const getUserDisplayName = (sender) => {
  if (!sender) return "Unknown User";
  if (typeof sender === 'string') return "Unknown User";
  
  return sender.fullName || 
         sender.name || 
         (sender.role === 'teacher' ? "Unknown Teacher" : 
          sender.role === 'student' ? "Unknown Student" : "Unknown User");
};

/**
 * Extracts user avatar URL with fallback
 */
export const getUserAvatar = (sender, size = 'md') => {
  if (!sender) return null;
  if (typeof sender === 'string') return null;
  
  if (sender.profileImage) {
    return sender.profileImage;
  }
  
  // Return null to trigger fallback avatar display
  return null;
};

/**
 * Formats sender name for display above message
 */
export const formatSenderName = (sender, role) => {
  if (!sender) return "Unknown";
  
  const name = sender.fullName || sender.name;
  if (name) return name;
  
  // Fallback based on role
  if (role === 'teacher') return "Teacher";
  if (role === 'student') return "Student";
  if (sender.role) return sender.role.charAt(0).toUpperCase() + sender.role.slice(1);
  
  return "Unknown";
};

export default {
  normalizeMessage,
  normalizeMessages,
  normalizeConversation,
  normalizeConversations,
  getUserDisplayName,
  getUserAvatar,
  formatSenderName
};

