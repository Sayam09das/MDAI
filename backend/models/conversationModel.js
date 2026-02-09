import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participantsModel",
        },
        participantsModel: {
          type: String,
          required: true,
          enum: ["User", "Teacher", "Admin"],
        },
        name: {
          type: String, // Store name for easy access
        },
        email: {
          type: String, // Store email for easy access
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastSeen: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    participantIds: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    conversationType: {
      type: String,
      enum: ["direct", "group", "course", "broadcast"],
      default: "direct",
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    groupAdmin: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "groupAdminModel",
        },
        groupAdminModel: {
          type: String,
          enum: ["User", "Teacher", "Admin"],
        },
      },
    ],
    lastMessage: {
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      content: {
        type: String,
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      senderName: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    },
    lastReadAt: {
      type: Date,
    },
    unreadCount: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "unreadCountModel",
        },
        unreadCountModel: {
          type: String,
          enum: ["User", "Teacher", "Admin"],
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    // Course-specific fields
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      enum: ["User", "Teacher", "Admin"],
    },
    // Global broadcast flag
    isGlobalBroadcast: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "archivedByModel",
        },
        archivedByModel: {
          type: String,
          enum: ["User", "Teacher", "Admin"],
        },
      },
    ],
    isMuted: {
      type: Boolean,
      default: false,
    },
    mutedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "mutedByModel",
        },
        mutedByModel: {
          type: String,
          enum: ["User", "Teacher", "Admin"],
        },
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "blockedByModel",
      },
      blockedByModel: {
        type: String,
        enum: ["User", "Teacher", "Admin"],
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    customSettings: {
      type: Map,
      of: new mongoose.Schema(
        {
          notifications: { type: Boolean, default: true },
          pinConversation: { type: Boolean, default: false },
          theme: { type: String, enum: ["default", "dark", "light"] },
        },
        { _id: false }
      ),
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient participant queries
conversationSchema.index({ "participants.userId": 1 });
conversationSchema.index({ participantIds: 1 });
conversationSchema.index({ "lastMessage.createdAt": -1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ courseId: 1 });
conversationSchema.index({ isGlobalBroadcast: 1 });

// Static method to find or create conversation
conversationSchema.statics.findOrCreateConversation = async function (
  userId1,
  model1,
  userId2,
  model2
) {
  try {
    // Check if conversation already exists
    const existingConversation = await this.findOne({
      conversationType: "direct",
      "participants.userId": { $all: [new mongoose.Types.ObjectId(userId1), new mongoose.Types.ObjectId(userId2)] },
      "participants.participantsModel": { $all: [model1, model2] },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = new this({
      participants: [
        { userId: new mongoose.Types.ObjectId(userId1), participantsModel: model1 },
        { userId: new mongoose.Types.ObjectId(userId2), participantsModel: model2 },
      ],
      participantIds: [new mongoose.Types.ObjectId(userId1), new mongoose.Types.ObjectId(userId2)],
      conversationType: "direct",
    });

    return await conversation.save();
  } catch (error) {
    console.error("Error in findOrCreateConversation:", error);
    throw error;
  }
};

// Pre-save middleware to update participantIds
conversationSchema.pre('save', function(next) {
    if (this.isModified('participants')) {
        this.participantIds = this.participants.map(p => p.userId);
    }
    next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

