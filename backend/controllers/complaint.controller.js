import Complaint from "../models/complaintModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";

// Helper function to get user details based on role
const getUserDetails = async (role, userId) => {
    try {
        if (role === "student") {
            const user = await User.findById(userId).select("fullName email");
            return user ? { name: user.fullName, email: user.email } : null;
        } else if (role === "teacher") {
            const teacher = await Teacher.findById(userId).select("fullName email");
            return teacher ? { name: teacher.fullName, email: teacher.email } : null;
        } else if (role === "admin") {
            const admin = await Admin.findById(userId).select("name email");
            return admin ? { name: admin.name, email: admin.email } : null;
        }
        return null;
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
};

// Helper function to validate recipient based on sender role
const validateRecipient = (senderRole, recipientRole) => {
    // Student can complain to: teacher, admin
    if (senderRole === "student") {
        return ["teacher", "admin"].includes(recipientRole);
    }
    // Teacher can complain to: student, admin (NOT other teachers)
    if (senderRole === "teacher") {
        return ["student", "admin"].includes(recipientRole);
    }
    // Admin can complain to anyone
    if (senderRole === "admin") {
        return ["student", "teacher", "admin"].includes(recipientRole);
    }
    return false;
};

/* =========================================
   CREATE COMPLAINT
   ========================================= */
export const createComplaint = async (req, res) => {
    try {
        const { title, description, recipientId, recipientRole, category, priority, relatedCourse } = req.body;
        const senderRole = req.user.role; // From JWT middleware
        
        // Get sender ID based on role
        let senderId;
        let senderModel;
        if (senderRole === "student") {
            senderId = req.user.id;
            senderModel = "User";
        } else if (senderRole === "teacher") {
            senderId = req.user.id;
            senderModel = "Teacher";
        } else if (senderRole === "admin") {
            senderId = req.user.id;
            senderModel = "Admin";
        }
        
        // Validate recipient role
        if (!validateRecipient(senderRole, recipientRole)) {
            return res.status(403).json({
                success: false,
                message: `Invalid recipient. ${senderRole}s cannot complain against other ${recipientRole}s`
            });
        }
        
        // Get sender details
        const senderDetails = await getUserDetails(senderRole, senderId);
        if (!senderDetails) {
            return res.status(404).json({
                success: false,
                message: "Sender not found"
            });
        }
        
        // Get recipient details
        const recipientDetails = await getUserDetails(recipientRole, recipientId);
        if (!recipientDetails) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }
        
        // Map role to model name
        const roleToModel = {
            student: "User",
            teacher: "Teacher",
            admin: "Admin"
        };
        
        // Create complaint
        const complaint = await Complaint.create({
            title,
            description,
            sender: {
                userId: senderId,
                model: senderModel,
                role: senderRole,
                name: senderDetails.name,
                email: senderDetails.email
            },
            recipient: {
                userId: recipientId,
                model: roleToModel[recipientRole] || "User",
                role: recipientRole,
                name: recipientDetails.name,
                email: recipientDetails.email
            },
            category: category || "other",
            priority: priority || "medium",
            relatedCourse: relatedCourse || null,
            status: "pending",
            statusHistory: [{
                status: "pending",
                changedBy: {
                    userId: senderId,
                    role: senderRole,
                    name: senderDetails.name
                },
                changedAt: new Date(),
                note: "Complaint submitted"
            }]
        });
        
        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate("sender.userId", "fullName email")
            .populate("recipient.userId", "fullName email")
            .populate("relatedCourse", "title");
        
        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: populatedComplaint
        });
    } catch (error) {
        console.error("Create complaint error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to submit complaint"
        });
    }
};

/* =========================================
   GET MY COMPLAINTS (Student/Teacher)
   ========================================= */
export const getMyComplaints = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        
        const { status, category, priority, page = 1, limit = 10 } = req.query;
        
        let query = {
            $or: [
                { "sender.userId": userId, "sender.role": userRole },
                { "recipient.userId": userId, "recipient.role": userRole }
            ],
            isDeleted: false
        };
        
        if (status && status !== "all") {
            query.status = status;
        }
        
        if (category && category !== "all") {
            query.category = category;
        }
        
        if (priority && priority !== "all") {
            query.priority = priority;
        }
        
        const complaints = await Complaint.find(query)
            .populate("sender.userId", "fullName name email")
            .populate("recipient.userId", "name email")
            .populate("adminResponse.respondedBy", "name")
            .populate("relatedCourse", "title")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Complaint.countDocuments(query);
        
        res.json({
            success: true,
            complaints,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get my complaints error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch complaints"
        });
    }
};

/* =========================================
   GET SINGLE COMPLAINT
   ========================================= */
export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;
        const userId = req.user.id;
        
        const complaint = await Complaint.findById(id)
            .populate("sender.userId", "fullName name email")
            .populate("recipient.userId", "name email")
            .populate("adminResponse.respondedBy", "name email")
            .populate("relatedCourse", "title");
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        
        // Check if user has access to this complaint
        const isSender = complaint.sender.userId.toString() === userId && complaint.sender.role === userRole;
        const isRecipient = complaint.recipient.userId.toString() === userId && complaint.recipient.role === userRole;
        const isAdmin = userRole === "admin";
        
        if (!isSender && !isRecipient && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this complaint"
            });
        }
        
        res.json({
            success: true,
            complaint
        });
    } catch (error) {
        console.error("Get complaint by ID error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch complaint"
        });
    }
};

/* =========================================
   ADMIN: GET ALL COMPLAINTS
   ========================================= */
export const getAllComplaintsAdmin = async (req, res) => {
    try {
        const { senderRole, status, category, priority, search, page = 1, limit = 20 } = req.query;
        
        let query = { isDeleted: false };
        
        if (senderRole && senderRole !== "all") {
            query["sender.role"] = senderRole;
        }
        
        if (status && status !== "all") {
            query.status = status;
        }
        
        if (category && category !== "all") {
            query.category = category;
        }
        
        if (priority && priority !== "all") {
            query.priority = priority;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { "sender.name": { $regex: search, $options: 'i' } },
                { "recipient.name": { $regex: search, $options: 'i' } }
            ];
        }
        
        const complaints = await Complaint.find(query)
            .populate("sender.userId", "fullName name email")
            .populate("recipient.userId", "name email")
            .populate("adminResponse.respondedBy", "name email")
            .populate("relatedCourse", "title")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Complaint.countDocuments(query);
        
        // Get stats
        const stats = {
            total: total,
            pending: await Complaint.countDocuments({ ...query, status: "pending" }),
            inReview: await Complaint.countDocuments({ ...query, status: "in_review" }),
            resolved: await Complaint.countDocuments({ ...query, status: "resolved" }),
            escalated: await Complaint.countDocuments({ ...query, isEscalated: true })
        };
        
        res.json({
            success: true,
            complaints,
            stats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get all complaints admin error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch complaints"
        });
    }
};

/* =========================================
   ADMIN: UPDATE COMPLAINT STATUS
   ========================================= */
export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, responseMessage } = req.body;
        const adminId = req.user.id;
        
        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        
        // Update status
        complaint.status = status;
        
        // Add admin response if provided
        if (responseMessage) {
            complaint.adminResponse = {
                message: responseMessage,
                respondedBy: adminId,
                respondedAt: new Date()
            };
        }
        
        // Add to status history
        complaint.statusHistory.push({
            status,
            changedBy: {
                userId: adminId,
                role: "admin",
                name: req.user.name || "Admin"
            },
            changedAt: new Date(),
            note: responseMessage || `Status changed to ${status}`
        });
        
        // Handle escalation
        if (status === "escalated") {
            complaint.isEscalated = true;
        }
        
        await complaint.save();
        
        const updatedComplaint = await Complaint.findById(id)
            .populate("sender.userId", "fullName name email")
            .populate("recipient.userId", "name email")
            .populate("adminResponse.respondedBy", "name email");
        
        res.json({
            success: true,
            message: "Complaint status updated successfully",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error("Update complaint status error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update complaint status"
        });
    }
};

/* =========================================
   ADMIN: ADD REMARK TO COMPLAINT
   ========================================= */
export const addComplaintRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const { remark } = req.body;
        const adminId = req.user.id;
        
        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        
        // Update admin response
        complaint.adminResponse = {
            message: remark,
            respondedBy: adminId,
            respondedAt: new Date()
        };
        
        // Update status to in_review if still pending
        if (complaint.status === "pending") {
            complaint.status = "in_review";
            complaint.statusHistory.push({
                status: "in_review",
                changedBy: {
                    userId: adminId,
                    role: "admin",
                    name: req.user.name || "Admin"
                },
                changedAt: new Date(),
                note: "Complaint under review"
            });
        }
        
        await complaint.save();
        
        res.json({
            success: true,
            message: "Remark added successfully",
            complaint
        });
    } catch (error) {
        console.error("Add remark error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to add remark"
        });
    }
};

/* =========================================
   ADMIN: DELETE COMPLAINT (Soft Delete)
   ========================================= */
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        
        const complaint = await Complaint.findById(id);
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }
        
        // Soft delete
        complaint.isDeleted = true;
        complaint.deletedAt = new Date();
        complaint.statusHistory.push({
            status: complaint.status,
            changedBy: {
                userId: req.user.id,
                role: "admin",
                name: req.user.name || "Admin"
            },
            changedAt: new Date(),
            note: "Complaint deleted by admin"
        });
        
        await complaint.save();
        
        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });
    } catch (error) {
        console.error("Delete complaint error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete complaint"
        });
    }
};

/* =========================================
   GET RECIPIENTS FOR DROPDOWN
   ========================================= */
export const getRecipients = async (req, res) => {
    try {
        const senderRole = req.user.role;
        
        let recipients = [];
        
        // Get teachers - use correct field name (fullName) from Teacher model
        const teachers = await Teacher.find({ isSuspended: false })
            .select("_id fullName email")
            .lean();
        
        // Get admins - use 'name' field from Admin model
        const admins = await Admin.find()
            .select("_id name email")
            .lean();
        
        // Build recipient list based on sender role
        if (senderRole === "student") {
            // Students can complain to: teachers, admins
            recipients = [
                ...teachers.map(t => ({
                    userId: t._id,
                    role: "teacher",
                    name: t.fullName, // ✅ FIXED: Use fullName (not name) for Teacher
                    email: t.email
                })),
                ...admins.map(a => ({
                    userId: a._id,
                    role: "admin",
                    name: a.name, // Admin uses 'name' field
                    email: a.email
                }))
            ];
        } else if (senderRole === "teacher") {
            // Teachers can complain to: students, admins
            // Get students - User model uses 'fullName'
            const students = await User.find({ isSuspended: false })
                .select("_id fullName email")
                .lean();
            
            recipients = [
                ...students.map(s => ({
                    userId: s._id,
                    role: "student",
                    name: s.fullName, // User uses 'fullName'
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
            // Admins can complain to anyone
            // Get students - User model uses 'fullName'
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
                    name: t.fullName, // FIXED: Use fullName
                    email: t.email
                })),
                ...admins.map(a => ({
                    userId: a._id,
                    role: "admin",
                    name: a.name,
                    email: a.email
                }))
            ];
        }
        
        // DEBUG: Log the first few recipients to verify names are populated
        console.log(`✅ getRecipients: Returning ${recipients.length} recipients for ${senderRole}`);
        if (recipients.length > 0) {
            console.log("Sample recipient:", recipients[0]);
        }
        
        res.json({
            success: true,
            recipients
        });
    } catch (error) {
        console.error("❌ Get recipients error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch recipients"
        });
    }
};

/* =========================================
   GET COMPLAINT STATS
   ========================================= */
export const getComplaintStats = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        
        let query = { isDeleted: false };
        
        if (userRole !== "admin") {
            // Non-admins see only their own complaints
            query.$or = [
                { "sender.userId": userId, "sender.role": userRole },
                { "recipient.userId": userId, "recipient.role": userRole }
            ];
        }
        
        const stats = {
            total: await Complaint.countDocuments(query),
            pending: await Complaint.countDocuments({ ...query, status: "pending" }),
            inReview: await Complaint.countDocuments({ ...query, status: "in_review" }),
            resolved: await Complaint.countDocuments({ ...query, status: "resolved" }),
            rejected: await Complaint.countDocuments({ ...query, status: "rejected" })
        };
        
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error("Get complaint stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch stats"
        });
    }
};
