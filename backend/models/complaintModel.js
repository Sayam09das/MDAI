import mongoose from "mongoose";

// Import models to ensure they're registered
import User from "./userModel.js";
import Teacher from "./teacherModel.js";
import Admin from "./adminModel.js";

const complaintSchema = new mongoose.Schema({
    // Complaint Title
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    
    // Complaint Description
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [5000, "Description cannot exceed 5000 characters"]
    },
    
    // Sender Information
    sender: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "sender.model",
            required: true
        },
        model: {
            type: String,
            enum: ["User", "Teacher", "Admin"],
            required: true
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    
    // Recipient Information
    recipient: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "recipient.model",
            required: true
        },
        model: {
            type: String,
            enum: ["User", "Teacher", "Admin"],
            required: true
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    
    // Category
    category: {
        type: String,
        enum: [
            "academic",
            "payment",
            "harassment",
            "technical",
            "discrimination",
            "course_content",
            "assessment",
            "communication",
            "facilities",
            "other"
        ],
        default: "other"
    },
    
    // Priority
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    
    // Status
    status: {
        type: String,
        enum: ["pending", "in_review", "resolved", "rejected", "escalated"],
        default: "pending"
    },
    
    // Admin Response/Remarks
    adminResponse: {
        message: {
            type: String,
            maxlength: [3000, "Response cannot exceed 3000 characters"]
        },
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        },
        respondedAt: {
            type: Date
        }
    },
    
    // Attachments (optional)
    attachments: [{
        filename: String,
        url: String,
        type: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Related Course (optional)
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null
    },
    
    // Escalation
    isEscalated: {
        type: Boolean,
        default: false
    },
    
    // History/Log of status changes
    statusHistory: [{
        status: String,
        changedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            role: String,
            name: String
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    
    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },
    
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
complaintSchema.index({ "sender.userId": 1, createdAt: -1 });
complaintSchema.index({ "recipient.userId": 1, createdAt: -1 });
complaintSchema.index({ "sender.role": 1, status: 1 });
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ isDeleted: 1 });

// Pre-save middleware to add status history
complaintSchema.pre('save', function() {
    // Only add to history if status is modified AND this is NOT a new document
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
});

// Static method to get complaints by user
complaintSchema.statics.getByUser = async function(userId, role) {
    return this.find({
        $or: [
            { "sender.userId": userId, "sender.role": role },
            { "recipient.userId": userId, "recipient.role": role }
        ],
        isDeleted: false
    }).sort({ createdAt: -1 });
};

// Static method for admin queries
complaintSchema.statics.getForAdmin = async function(filters = {}) {
    let query = { isDeleted: false };
    
    if (filters.role) {
        query["sender.role"] = filters.role;
    }
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.priority) {
        query.priority = filters.priority;
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ];
    }
    
    return this.find(query)
        .populate("sender.userId", "fullName email")
        .populate("recipient.userId", "name email")
        .populate("adminResponse.respondedBy", "name email")
        .populate("relatedCourse", "title")
        .sort({ createdAt: -1 });
};

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
