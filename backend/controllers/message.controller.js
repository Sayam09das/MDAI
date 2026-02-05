import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import mongoose from "mongoose";

/* ======================================================
   SENDER POPULATION UTILITY
   This ensures consistent sender info across all endpoints
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

    // Try to fetch based on senderModel
    if (senderModel === "User") {
      senderData = await User.findById(senderId).select("fullName profileImage email");
    } else if (senderModel === "Teacher") {
      senderData = await Teacher.findById(senderId).select("fullName profileImage email");
    } else {
      // If model is unknown, try both
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

    // Fallback if user not found in either collection
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
   PROCESS MESSAGES WITH SENDER INFO
   Normalizes messages to always have populated sender
====================================================== */
const processMessagesWithSender = async (messages) => {
  return Promise.all(
    messages.map(async (msg) => {
      const messageObj = msg.toObject ? msg.toObject() : msg;
      
      // Determine sender model from the message
      const senderModel = msg.senderModel || "User";
      
      // Populate sender info
      const senderInfo = await populateSenderInfo(msg.sender, senderModel);
      
      return {
        ...messageObj,
        sender: senderInfo,
        senderModel: senderModel
      };
    })
  );
};

/* ======================================================
   SEND MESSAGE
====================================================== */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, recipientId, recipientModel, content, messageType, attachments } = req.body;
    const senderId = req.user.id;
    const senderModel = req.user.role === "teacher" ? "Teacher" : "User";

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // If conversationId is not provided, find or create conversation
    let conversation;
    if (!conversationId) {
      if (!recipientId || !recipientModel) {
        return res.status(400).json({ message: "Recipient information is required" });
      }

      conversation = await Conversation.findOrCreateConversation(
        senderId,
        senderModel,
        recipientId,
        recipientModel
      );
    } else {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      senderModel,
      content,
      messageType: messageType || "text",
      attachments: attachments || [],
      readBy: [{ userId: senderId, readByModel: senderModel }],
    });

    await message.save();

    // Update conversation's last message
    await conversation.updateLastMessage(message._id, content, senderId);

    // Increment unread count for recipient
    const recipientParticipant = conversation.participants.find(
      (p) => p.userId.toString() !== senderId.toString()
    );

    // Populate sender info using the utility function
    const senderInfo = await populateSenderInfo(senderId, senderModel);

    // Create the populated message object
    const populatedMessage = {
      ...message.toObject(),
      sender: senderInfo,
      senderModel: senderModel
    };

    // Emit socket event for real-time notification BEFORE responding
    const io = req.app.get("io");
    if (io) {
      // Emit to conversation room
      io.to(`conversation_${conversation._id}`).emit("receive_message", populatedMessage);

      // Emit notification to recipient
      if (recipientParticipant) {
        await conversation.incrementUnreadCount(
          recipientParticipant.userId,
          recipientParticipant.participantsModel
        );

        io.to(`user_${recipientParticipant.userId}`).emit("new_message_notification", {
          conversationId: conversation._id,
          message: populatedMessage,
          senderId: senderId,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message: " + error.message });
  }
};

/* ======================================================
   GET MESSAGES (with conversation)
====================================================== */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Validate conversationId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Reset unread count
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";
    await conversation.resetUnreadCount(userId, userModel);

    // Validate and sanitize pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    // Get messages with pagination
    const skip = (pageNum - 1) * limitNum;
    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Process messages with sender info using utility
    const processedMessages = await processMessagesWithSender(messages);

    // Reverse for chronological order
    const reversedMessages = processedMessages.reverse();

    // Get total count
    const totalMessages = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    res.json({
      success: true,
      messages: reversedMessages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalMessages,
        pages: Math.ceil(totalMessages / limitNum),
      },
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages: " + error.message });
  }
};

/* ======================================================
   MARK MESSAGE AS READ
====================================================== */
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if already read
    const alreadyRead = message.readBy.some(
      (r) => r.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readByModel: userModel,
        readAt: new Date(),
      });
      await message.save();

      // Emit socket event
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${message.sender}`).emit("message_read", {
          messageId: message._id,
          readBy: userId,
        });
      }
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Mark Message As Read Error:", error);
    res.status(500).json({ message: "Failed to mark message as read" });
  }
};

/* ======================================================
   MARK ALL MESSAGES IN CONVERSATION AS READ
====================================================== */
export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId,
        "readBy.userId": { $ne: userId },
        sender: { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId,
            readByModel: userModel,
            readAt: new Date(),
          },
        },
      }
    );

    // Reset unread count
    await conversation.resetUnreadCount(userId, userModel);

    res.json({
      success: true,
      message: "All messages marked as read",
    });
  } catch (error) {
    console.error("Mark Conversation As Read Error:", error);
    res.status(500).json({ message: "Failed to mark conversation as read" });
  }
};

/* ======================================================
   DELETE MESSAGE (Soft Delete)
====================================================== */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their own messages
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = "This message has been deleted";
    await message.save();

    res.json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};

/* ======================================================
   GET CONVERSATIONS
====================================================== */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get conversations without population first
    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
      isArchived: { $ne: true },
    })
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "lastMessage.messageId",
        select: "content messageType attachments createdAt",
      });

    // Manually populate participants based on their model
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadEntry = conv.unreadCount.find(
          (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === userModel
        );

        // Find the other participant (not the current user)
        const otherParticipant = conv.participants.find((p) => {
          return p.userId.toString() !== userId.toString();
        });

        let userData = null;
        if (otherParticipant) {
          try {
            // Manually populate based on model type
            if (otherParticipant.participantsModel === "User") {
              userData = await User.findById(otherParticipant.userId).select("fullName profileImage email");
            } else if (otherParticipant.participantsModel === "Teacher") {
              userData = await Teacher.findById(otherParticipant.userId).select("fullName profileImage email");
            }
          } catch (error) {
            console.error("Error populating participant:", error);
          }
        }

        return {
          ...conv.toObject(),
          unreadCount: unreadEntry ? unreadEntry.count : 0,
          otherParticipant: otherParticipant
            ? {
                userId: otherParticipant.userId,
                fullName: userData?.fullName || `Unknown ${otherParticipant.participantsModel}`,
                profileImage: userData?.profileImage || null,
                model: otherParticipant.participantsModel,
              }
            : null,
        };
      })
    );

    const totalConversations = await Conversation.countDocuments({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
    });

    res.json({
      success: true,
      conversations: conversationsWithUnread,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalConversations,
        pages: Math.ceil(totalConversations / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ message: "Failed to fetch conversations: " + error.message });
  }
};

/* ======================================================
   GET OR CREATE CONVERSATION
====================================================== */
export const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId, recipientModel } = req.body;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    if (!recipientId || !recipientModel) {
      return res.status(400).json({ message: "Recipient information is required" });
    }

    const conversation = await Conversation.findOrCreateConversation(
      userId,
      userModel,
      recipientId,
      recipientModel
    );

    // Get the conversation without population first
    const foundConversation = await Conversation.findById(conversation._id);

    if (!foundConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find the other participant
    const otherParticipant = foundConversation.participants.find((p) => {
      return p.userId.toString() !== userId.toString();
    });

    // Manually populate the other participant
    let userData = null;
    if (otherParticipant) {
      try {
        if (otherParticipant.participantsModel === "User") {
          userData = await User.findById(otherParticipant.userId).select("fullName profileImage email");
        } else if (otherParticipant.participantsModel === "Teacher") {
          userData = await Teacher.findById(otherParticipant.userId).select("fullName profileImage email");
        }
      } catch (error) {
        console.error("Error populating participant:", error);
      }
    }

    // Get unread count
    const unreadEntry = foundConversation.unreadCount.find(
      (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === userModel
    );

    res.json({
      success: true,
      conversation: {
        _id: foundConversation._id,
        participants: foundConversation.participants,
        conversationType: foundConversation.conversationType,
        unreadCount: unreadEntry ? unreadEntry.count : 0,
        otherParticipant: otherParticipant
          ? {
              userId: otherParticipant.userId.toString(),
              fullName: userData?.fullName || `Unknown ${otherParticipant.participantsModel}`,
              profileImage: userData?.profileImage || null,
              model: otherParticipant.participantsModel,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get Or Create Conversation Error:", error);
    res.status(500).json({ message: "Failed to get or create conversation: " + error.message });
  }
};

/* ======================================================
   SEARCH CONVERSATIONS
====================================================== */
export const searchConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Sanitize the query to prevent regex injection
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Search in user's conversations
    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
    })
      .sort({ "lastMessage.createdAt": -1 });

    // Manually populate and filter conversations based on participant name
    const filteredConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p.userId.toString() !== userId.toString()
        );

        if (otherParticipant) {
          try {
            let userData = null;
            if (otherParticipant.participantsModel === "User") {
              userData = await User.findById(otherParticipant.userId).select("fullName profileImage email");
            } else if (otherParticipant.participantsModel === "Teacher") {
              userData = await Teacher.findById(otherParticipant.userId).select("fullName profileImage email");
            }

            if (userData?.fullName && userData.fullName.toLowerCase().includes(sanitizedQuery.toLowerCase())) {
              return {
                ...conv.toObject(),
                otherParticipant: {
                  userId: otherParticipant.userId,
                  fullName: userData.fullName,
                  profileImage: userData.profileImage,
                  model: otherParticipant.participantsModel,
                },
              };
            }
          } catch (error) {
            console.error("Error populating participant:", error);
          }
        }
        return null;
      })
    );

    // Filter out null results
    const validFilteredConversations = filteredConversations.filter(conv => conv !== null);

    // Also search in messages with manual population
    const messages = await Message.find({
      content: { $regex: sanitizedQuery, $options: "i" },
      sender: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "conversationId",
        select: "participants",
      });

    // Manually populate sender information
    const messageResults = await Promise.all(
      messages.map(async (msg) => {
        try {
          let senderData = null;
          if (msg.senderModel === "User") {
            senderData = await User.findById(msg.sender).select("fullName profileImage");
          } else if (msg.senderModel === "Teacher") {
            senderData = await Teacher.findById(msg.sender).select("fullName profileImage");
          }
          
          return {
            ...msg.toObject(),
            sender: senderData || {
              _id: msg.sender,
              fullName: `Unknown ${msg.senderModel}`,
              profileImage: null,
            },
          };
        } catch (error) {
          console.error("Error populating message sender:", error);
          return {
            ...msg.toObject(),
            sender: {
              _id: msg.sender,
              fullName: `Unknown ${msg.senderModel}`,
              profileImage: null,
            },
          };
        }
      })
    );

    // Filter message results to only include conversations user is part of
    const validMessageResults = messageResults.filter((msg) => {
      const conv = msg.conversationId;
      return conv.participants.some(
        (p) => p.userId.toString() === userId.toString()
      );
    });

    res.json({
      success: true,
      conversations: validFilteredConversations,
      messageResults: validMessageResults,
    });
  } catch (error) {
    console.error("Search Conversations Error:", error);
    res.status(500).json({ message: "Failed to search conversations" });
  }
};

/* ======================================================
   GET UNREAD MESSAGE COUNT
====================================================== */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
    });

    let totalUnread = 0;
    const unreadByConversation = [];

    conversations.forEach((conv) => {
      const unreadEntry = conv.unreadCount.find(
        (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === userModel
      );

      if (unreadEntry && unreadEntry.count > 0) {
        totalUnread += unreadEntry.count;
        unreadByConversation.push({
          conversationId: conv._id,
          unreadCount: unreadEntry.count,
        });
      }
    });

    res.json({
      success: true,
      totalUnread,
      unreadByConversation,
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

/* ======================================================
   ARCHIVE CONVERSATION
====================================================== */
export const archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if already archived by this user
    const alreadyArchived = conversation.archivedBy.some(
      (a) => a.userId.toString() === userId.toString() && a.archivedByModel === userModel
    );

    if (!alreadyArchived) {
      conversation.archivedBy.push({
        userId,
        archivedByModel: userModel,
      });
      await conversation.save();
    }

    res.json({
      success: true,
      message: "Conversation archived",
    });
  } catch (error) {
    console.error("Archive Conversation Error:", error);
    res.status(500).json({ message: "Failed to archive conversation" });
  }
};

/* ======================================================
   UNARCHIVE CONVERSATION
====================================================== */
export const unarchiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Remove from archived
    conversation.archivedBy = conversation.archivedBy.filter(
      (a) => !(a.userId.toString() === userId.toString() && a.archivedByModel === userModel)
    );

    await conversation.save();

    res.json({
      success: true,
      message: "Conversation unarchived",
    });
  } catch (error) {
    console.error("Unarchive Conversation Error:", error);
    res.status(500).json({ message: "Failed to unarchive conversation" });
  }
};

/* ======================================================
   GET ARCHIVED CONVERSATIONS
====================================================== */
export const getArchivedConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "teacher" ? "Teacher" : "User";
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
      "archivedBy.userId": userId,
      "archivedBy.archivedByModel": userModel,
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "participants.userId",
        select: "fullName profileImage email",
      })
      .populate({
        path: "lastMessage.messageId",
        select: "content createdAt",
      });

    const totalArchived = await Conversation.countDocuments({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
      "archivedBy.userId": userId,
      "archivedBy.archivedByModel": userModel,
    });

    res.json({
      success: true,
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalArchived,
        pages: Math.ceil(totalArchived / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get Archived Conversations Error:", error);
    res.status(500).json({ message: "Failed to get archived conversations" });
  }
};

/* ======================================================
   GET CONTACTS (Students for Teachers, Teachers for Students)
====================================================== */
export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let contacts = [];

    if (userRole === "teacher") {
      // Get all students enrolled in teacher's courses
      const Enrollment = (await import("../models/enrollmentModel.js")).default;
      
      const enrollments = await Enrollment.find({
        paymentStatus: "PAID",
      }).populate({
        path: "student",
        select: "fullName email profileImage phone",
        model: "User",
      });

      // Get unique students
      const studentMap = new Map();
      enrollments.forEach((enrollment) => {
        if (enrollment.student && !studentMap.has(enrollment.student._id.toString())) {
          studentMap.set(enrollment.student._id.toString(), {
            _id: enrollment.student._id,
            fullName: enrollment.student.fullName,
            email: enrollment.student.email,
            profileImage: enrollment.student.profileImage,
            phone: enrollment.student.phone,
            model: "User",
          });
        }
      });

      contacts = Array.from(studentMap.values());
    } else {
      // Get teachers from enrolled courses
      const Enrollment = (await import("../models/enrollmentModel.js")).default;
      const Course = (await import("../models/Course.js")).default;

      const enrollments = await Enrollment.find({
        student: userId,
        paymentStatus: "PAID",
      }).populate({
        path: "course",
        select: "instructor",
        populate: {
          path: "instructor",
          select: "fullName email profileImage phone skills",
          model: "Teacher",
        },
      });

      const teacherMap = new Map();
      enrollments.forEach((enrollment) => {
        if (enrollment.course?.instructor && !teacherMap.has(enrollment.course.instructor._id.toString())) {
          teacherMap.set(enrollment.course.instructor._id.toString(), {
            _id: enrollment.course.instructor._id,
            fullName: enrollment.course.instructor.fullName,
            email: enrollment.course.instructor.email,
            profileImage: enrollment.course.instructor.profileImage,
            phone: enrollment.course.instructor.phone,
            skills: enrollment.course.instructor.skills,
            model: "Teacher",
          });
        }
      });

      contacts = Array.from(teacherMap.values());
    }

    res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({ message: "Failed to get contacts" });
  }
};

