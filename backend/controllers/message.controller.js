import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

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

    if (recipientParticipant) {
      await conversation.incrementUnreadCount(
        recipientParticipant.userId,
        recipientParticipant.participantsModel
      );

      // Emit socket event for real-time notification
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${recipientParticipant.userId}`).emit("new_message", {
          message,
          conversationId: conversation._id,
        });
      }
    }

    // Populate sender info for response
    await message.populate([
      { path: "sender", select: "fullName profileImage", model: senderModel },
    ]);

    res.status(201).json({
      success: true,
      message,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
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

    // Get messages with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate([
        {
          path: "sender",
          select: "fullName profileImage email",
          model: req.user.role === "teacher" ? "Teacher" : "User",
        },
      ]);

    // Reverse for chronological order
    const reversedMessages = messages.reverse();

    // Get total count
    const totalMessages = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    res.json({
      success: true,
      messages: reversedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalMessages,
        pages: Math.ceil(totalMessages / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
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

    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
      isArchived: { $ne: true },
    })
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate([
        {
          path: "participants.userId",
          select: "fullName profileImage email",
          model: userModel === "Teacher" ? "Teacher" : "User",
        },
        {
          path: "lastMessage.messageId",
          select: "content messageType attachments createdAt",
        },
      ]);

    // Get unread count for each conversation
    const conversationsWithUnread = conversations.map((conv) => {
      const unreadEntry = conv.unreadCount.find(
        (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === userModel
      );

      // Get other participant info
      const otherParticipant = conv.participants.find(
        (p) => p.userId.toString() !== userId.toString()
      );

      return {
        ...conv.toObject(),
        unreadCount: unreadEntry ? unreadEntry.count : 0,
        otherParticipant: otherParticipant
          ? {
              userId: otherParticipant.userId._id,
              fullName: otherParticipant.userId.fullName,
              profileImage: otherParticipant.userId.profileImage,
              model: otherParticipant.participantsModel,
            }
          : null,
      };
    });

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
    res.status(500).json({ message: "Failed to fetch conversations" });
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

    // Populate participants
    await conversation.populate([
      {
        path: "participants.userId",
        select: "fullName profileImage email",
      },
    ]);

    // Get other participant info
    const otherParticipant = conversation.participants.find(
      (p) => p.userId._id.toString() !== userId.toString()
    );

    // Get unread count
    const unreadEntry = conversation.unreadCount.find(
      (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === userModel
    );

    res.json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        unreadCount: unreadEntry ? unreadEntry.count : 0,
        otherParticipant: otherParticipant
          ? {
              userId: otherParticipant.userId._id,
              fullName: otherParticipant.userId.fullName,
              profileImage: otherParticipant.userId.profileImage,
              model: otherParticipant.participantsModel,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get Or Create Conversation Error:", error);
    res.status(500).json({ message: "Failed to get or create conversation" });
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

    // Search in user's conversations
    const conversations = await Conversation.find({
      "participants.userId": userId,
      "participants.participantsModel": userModel,
    })
      .sort({ "lastMessage.createdAt": -1 })
      .populate([
        {
          path: "participants.userId",
          select: "fullName profileImage email",
        },
      ]);

    // Filter conversations based on participant name
    const filteredConversations = conversations.filter((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p.userId._id.toString() !== userId.toString()
      );

      if (otherParticipant) {
        return otherParticipant.userId.fullName
          .toLowerCase()
          .includes(query.toLowerCase());
      }
      return false;
    });

    // Also search in messages
    const messageResults = await Message.find({
      content: { $regex: query, $options: "i" },
      sender: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate([
        {
          path: "sender",
          select: "fullName profileImage",
        },
        {
          path: "conversationId",
          select: "participants",
        },
      ]);

    // Filter message results to only include conversations user is part of
    const validMessageResults = messageResults.filter((msg) => {
      const conv = msg.conversationId;
      return conv.participants.some(
        (p) => p.userId.toString() === userId.toString()
      );
    });

    res.json({
      success: true,
      conversations: filteredConversations,
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
      .populate([
        {
          path: "participants.userId",
          select: "fullName profileImage email",
        },
        {
          path: "lastMessage.messageId",
          select: "content createdAt",
        },
      ]);

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

