import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";
import Course from "../models/Course.js";
import Enrollment from "../models/enrollmentModel.js";

// ============================================
// HELPER: Get user details based on role
// ============================================
const getUserDetails = async (role, userId) => {
    try {
        if (role === "student") {
            const user = await User.findById(userId).select("fullName email");
            return user ? { name: user.fullName, email: user.email, model: "User" } : null;
        } else if (role === "teacher") {
            const teacher = await Teacher.findById(userId).select("fullName email");
            return teacher ? { name: teacher.fullName, email: teacher.email, model: "Teacher" } : null;
        } else if (role === "admin") {
            const admin = await Admin.findById(userId).select("name email");
            return admin ? { name: admin.name, email: admin.email, model: "Admin" } : null;
        }
        return null;
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
};

// ============================================
// HELPER: Convert role to model name
// ============================================
const roleToModel = (role) => {
    const modelMap = {
        "student": "User",
        "teacher": "Teacher",
        "admin": "Admin"
    };
    return modelMap[role] || "User";
};

// ============================================
// HELPER: Validate role-based permissions
// ============================================
const canMessage = (senderRole, targetRole) => {
    // Student can message: Teacher, Admin
    if (senderRole === "student") {
        return ["teacher", "admin"].includes(targetRole);
    }
    // Teacher can message: Student (individual), Course (broadcast), Admin
    if (senderRole === "teacher") {
        return ["student", "admin"].includes(targetRole);
    }
    // Admin can message anyone
    if (senderRole === "admin") {
        return ["student", "teacher", "admin"].includes(targetRole);
    }
    return false;
};

// ============================================
// HELPER: Get or create conversation
// ============================================
const getOrCreateConversation = async (participants) => {
    // participants: [{ userId, role, name, email }]
    
    // Sort participants to ensure consistent conversation lookup
    const participantIds = participants
        .map(p => p.userId.toString())
        .sort()
        .join("-");
    
    let conversation = await Conversation.findOne({
        participantIds: { $all: participants.map(p => p.userId) },
        conversationType: "direct"
    });
    
    if (!conversation) {
        // Convert role to model name for participantsModel
        const participantsWithModel = participants.map(p => ({
            userId: p.userId,
            participantsModel: roleToModel(p.role),
            name: p.name,
            email: p.email,
            joinedAt: new Date(),
            lastSeen: new Date()
        }));
        
        conversation = await Conversation.create({
            participants: participantsWithModel,
            participantIds: participants.map(p => p.userId),
            conversationType: "direct"
        });
    }
    
    return conversation;
};

// ============================================
// CREATE MESSAGE (Individual or Course Broadcast)
// ============================================
export const createMessage = async (req, res) => {
    try {
        const {
            content,
            recipientId,
            recipientRole,
            messageType = "individual", // individual, course, broadcast
            courseId
        } = req.body;
        
        const senderRole = req.user.role;
        const senderId = req.user.id;
        
        // Get sender details
        const senderDetails = await getUserDetails(senderRole, senderId);
        if (!senderDetails) {
            return res.status(404).json({ success: false, message: "Sender not found" });
        }
        
        // Handle Individual Messages
        if (messageType === "individual") {
            // Validate recipient
            if (!recipientId || !recipientRole) {
                return res.status(400).json({ success: false, message: "Recipient required" });
            }
            
            // Check permissions
            if (!canMessage(senderRole, recipientRole)) {
                return res.status(403).json({
                    success: false,
                    message: `${senderRole}s cannot message ${recipientRole}s`
                });
            }
            
            // Get recipient details
            const recipientDetails = await getUserDetails(recipientRole, recipientId);
            if (!recipientDetails) {
                return res.status(404).json({ success: false, message: "Recipient not found" });
            }
            
            // Get or create conversation
            const conversation = await getOrCreateConversation([
                { userId: senderId, role: senderRole, name: senderDetails.name, email: senderDetails.email },
                { userId: recipientId, role: recipientRole, name: recipientDetails.name, email: recipientDetails.email }
            ]);
            
            // Create message
            const message = await Message.create({
                conversationId: conversation._id,
                sender: senderId,
                senderModel: senderRole === "student" ? "User" : "Teacher",
                content,
                messageType: "text"
            });
            
            // Update conversation
            conversation.lastMessage = { content, sender: senderId };
            conversation.lastMessageAt = new Date();
            await conversation.save();
            
            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "fullName name email")
                .populate("conversationId", "participants");
            
            return res.status(201).json({
                success: true,
                message: populatedMessage,
                conversationId: conversation._id
            });
        }
        
        // Handle Course Broadcast
        if (messageType === "course") {
            // Only teachers and admins can send course broadcasts
            if (!["teacher", "admin"].includes(senderRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Only teachers and admins can send course broadcasts"
                });
            }
            
            if (!courseId) {
                return res.status(400).json({ success: false, message: "Course ID required" });
            }
            
            // Verify course exists
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }
            
            // Get all enrolled students
            const enrollments = await Enrollment.find({ course: courseId, status: "active" });
            const studentIds = enrollments.map(e => e.student);
            
            if (studentIds.length === 0) {
                return res.status(400).json({ success: false, message: "No students enrolled in this course" });
            }
            
            // Get student details
            const students = await User.find({ _id: { $in: studentIds } }).select("_id fullName email");
            
            // Create conversation for each student (or use a group conversation)
            let groupConversation = await Conversation.findOne({
                courseId: courseId,
                isGroup: true
            });
            
            if (!groupConversation) {
                const allParticipants = [
                    { userId: senderId, role: senderRole, name: senderDetails.name, email: senderDetails.email },
                    ...students.map(s => ({
                        userId: s._id,
                        role: "student",
                        name: s.fullName,
                        email: s.email
                    }))
                ];
                
                groupConversation = await Conversation.create({
                    participants: allParticipants,
                    participantIds: allParticipants.map(p => p.userId),
                    isGroup: true,
                    groupName: `Course: ${course.title}`,
                    courseId: courseId,
                    createdBy: senderId
                });
            }
            
            // Create message
            const message = await Message.create({
                conversationId: groupConversation._id,
                sender: senderId,
                senderModel: senderRole === "student" ? "User" : "Teacher",
                content,
                messageType: "text",
                isCourseBroadcast: true,
                broadcastCourseId: courseId
            });
            
            // Update conversation
            groupConversation.lastMessage = { content, sender: senderId };
            groupConversation.lastMessageAt = new Date();
            await groupConversation.save();
            
            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "fullName name email")
                .populate("conversationId");
            
            return res.status(201).json({
                success: true,
                message: populatedMessage,
                conversationId: groupConversation._id,
                recipientCount: students.length
            });
        }
        
        // Handle Global Broadcast (Admin only)
        if (messageType === "broadcast") {
            if (senderRole !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admins can send global broadcasts"
                });
            }
            
            // Get all users
            const students = await User.find({ isSuspended: false }).select("_id fullName email");
            const teachers = await Teacher.find({ isSuspended: false }).select("_id fullName email");
            const admins = await Admin.find().select("_id name email");
            
            const allParticipants = [
                { userId: senderId, role: "admin", name: senderDetails.name, email: senderDetails.email },
                ...students.map(s => ({ userId: s._id, role: "student", name: s.fullName, email: s.email })),
                ...teachers.map(t => ({ userId: t._id, role: "teacher", name: t.fullName, email: t.email })),
                ...admins.map(a => ({ userId: a._id, role: "admin", name: a.name, email: a.email }))
            ];
            
            let broadcastConversation = await Conversation.findOne({
                isGlobalBroadcast: true
            });
            
            if (!broadcastConversation) {
                broadcastConversation = await Conversation.create({
                    participants: allParticipants,
                    participantIds: allParticipants.map(p => p.userId),
                    isGroup: true,
                    isGlobalBroadcast: true,
                    groupName: "📢 Global Announcement",
                    createdBy: senderId
                });
            }
            
            const message = await Message.create({
                conversationId: broadcastConversation._id,
                sender: senderId,
                senderModel: "Teacher", // Admin uses Teacher ref
                content,
                messageType: "text",
                isGlobalBroadcast: true
            });
            
            broadcastConversation.lastMessage = { content, sender: senderId };
            broadcastConversation.lastMessageAt = new Date();
            await broadcastConversation.save();
            
            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "fullName name email")
                .populate("conversationId");
            
            return res.status(201).json({
                success: true,
                message: populatedMessage,
                conversationId: broadcastConversation._id,
                recipientCount: allParticipants.length - 1 // Exclude sender
            });
        }
        
        return res.status(400).json({ success: false, message: "Invalid message type" });
        
    } catch (error) {
        console.error("Create message error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to send message" });
    }
};

// ============================================
// GET MY CONVERSATIONS
// ============================================
export const getMyConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        const conversations = await Conversation.find({
            participantIds: userId,
            isDeleted: false
        })
            .populate("participants", "fullName name email profileImage")
            .sort({ lastMessageAt: -1 });
        
        // Get unread count per conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id,
                    createdAt: { $gt: conv.lastReadAt || new Date(0) },
                    sender: { $ne: userId }
                });
                
                return {
                    ...conv.toObject(),
                    unreadCount
                };
            })
        );
        
        res.json({ success: true, conversations: conversationsWithUnread });
    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch conversations" });
    }
};

// ============================================
// GET MESSAGES IN CONVERSATION
// ============================================
export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 50 } = req.query;
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        
        // Check if user is participant
        if (!conversation.participantIds.includes(userId)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        
        const messages = await Message.find({
            conversationId,
            isDeleted: false
        })
            .populate("sender", "fullName name email profileImage")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        // Mark messages as read
        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                "readBy.userId": { $ne: userId }
            },
            {
                $push: {
                    readBy: {
                        userId,
                        readByModel: req.user.role === "student" ? "User" : "Teacher",
                        readAt: new Date()
                    }
                }
            }
        );
        
        // Update conversation lastReadAt
        conversation.lastReadAt = new Date();
        await conversation.save();
        
        res.json({
            success: true,
            messages: messages.reverse(),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch messages" });
    }
};

// ============================================
// GET RECIPIENTS FOR MESSAGING
// ============================================
export const getMessageRecipients = async (req, res) => {
    try {
        const senderRole = req.user.role;
        const senderId = req.user.id;
        
        let recipients = [];
        
        // Get teachers
        const teachers = await Teacher.find({ isSuspended: false })
            .select("_id fullName email")
            .lean();
        
        // Get admins
        const admins = await Admin.find()
            .select("_id name email")
            .lean();
        
        // Build recipient list based on sender role
        if (senderRole === "student") {
            // Students can message: teachers, admins
            recipients = [
                ...teachers.filter(t => t._id.toString() !== senderId).map(t => ({
                    userId: t._id,
                    role: "teacher",
                    name: t.fullName,
                    email: t.email
                })),
                ...admins.map(a => ({
                    userId: a._id,
                    role: "admin",
                    name: a.name,
                    email: a.email
                }))
            ];
        } else if (senderRole === "teacher") {
            // Teachers can message: students, admins
            const students = await User.find({ isSuspended: false })
                .select("_id fullName email")
                .lean();
            
            recipients = [
                ...students.map(s => ({
                    userId: s._id,
                    role: "student",
                    name: s.fullName,
                    email: s.email
                })),
                ...admins.map(a => ({
                    userId: a._id,
                    role: "admin",
                    name: a.name,
                    email: a.email
                }))
            ];
        } else if (senderRole === "admin") {
            // Admins can message anyone
            const students = await User.find({ isSuspended: false })
                .select("_id fullName email")
                .lean();
            
            recipients = [
                ...students.map(s => ({
                    userId: s._id,
                    role: "student",
                    name: s.fullName,
                    email: s.email
                })),
                ...teachers.map(t => ({
                    userId: t._id,
                    role: "teacher",
                    name: t.fullName,
                    email: t.email
                })),
                ...admins.filter(a => a._id.toString() !== senderId).map(a => ({
                    userId: a._id,
                    role: "admin",
                    name: a.name,
                    email: a.email
                }))
            ];
        }
        
        res.json({ success: true, recipients });
    } catch (error) {
        console.error("Get recipients error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch recipients" });
    }
};

// ============================================
// GET COURSES FOR BROADCAST (Teachers only)
// ============================================
export const getCoursesForBroadcast = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        
        let courses = [];
        
        if (userRole === "teacher") {
            // Get courses where teacher is the instructor
            courses = await Course.find({ instructor: userId, isActive: true })
                .select("_id title description")
                .lean();
        } else if (userRole === "admin") {
            // Admin can broadcast to all courses
            courses = await Course.find({ isActive: true })
                .select("_id title description")
                .lean();
        }
        
        // Get student count for each course
        const coursesWithStats = await Promise.all(
            courses.map(async (course) => {
                const studentCount = await Enrollment.countDocuments({
                    course: course._id,
                    status: "active"
                });
                
                return {
                    ...course,
                    studentCount
                };
            })
        );
        
        res.json({ success: true, courses: coursesWithStats });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch courses" });
    }
};

// ============================================
// DELETE MESSAGE
// ============================================
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        
        // Only sender can delete their own message
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Can only delete your own messages" });
        }
        
        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();
        
        res.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete message" });
    }
};

// ============================================
// DELETE CONVERSATION
// ============================================
export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        
        // Check if user is participant
        if (!conversation.participantIds.includes(userId)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        
        // Soft delete - just hide from user
        conversation.isDeleted = true;
        await conversation.save();
        
        res.json({ success: true, message: "Conversation deleted" });
    } catch (error) {
        console.error("Delete conversation error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete conversation" });
    }
};

// ============================================
// ADMIN: GET ALL CONVERSATIONS
// ============================================
export const getAllConversationsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const conversations = await Conversation.find({ isDeleted: false })
            .populate("participants", "fullName name email")
            .sort({ lastMessageAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Conversation.countDocuments({ isDeleted: false });
        
        res.json({
            success: true,
            conversations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get all conversations error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch conversations" });
    }
};

