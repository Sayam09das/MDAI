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
          enum: ["User", "Teacher"],
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
    conversationType: {
      type: String,
      enum: ["direct", "group"],
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
          enum: ["User", "Teacher"],
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
      createdAt: {
        type: Date,
      },
    },
    unreadCount: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "unreadCountModel",
        },
        unreadCountModel: {
          type: String,
          enum: ["User", "Teacher"],
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
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
          enum: ["User", "Teacher"],
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
          enum: ["User", "Teacher"],
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
        enum: ["User", "Teacher"],
      },
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
conversationSchema.index({ "participants.userId": 1, "participants.participantsModel": 1 });
conversationSchema.index({ "lastMessage.createdAt": -1 });
conversationSchema.index({ updatedAt: -1 });

// Static method to find or create conversation
conversationSchema.statics.findOrCreateConversation = async function (
  userId1,
  model1,
  userId2,
  model2
) {
  try {
    // Check if conversation already exists
    // We need to check both orderings since participants array order doesn't matter
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
      conversationType: "direct",
    });

    return await conversation.save();
  } catch (error) {
    console.error("Error in findOrCreateConversation:", error);
    throw error;
  }
};

// Method to update last message
conversationSchema.methods.updateLastMessage = async function (
  messageId,
  content,
  senderId
) {
  this.lastMessage = {
    messageId,
    content,
    senderId,
    createdAt: new Date(),
  };
  return await this.save();
};

// Method to increment unread count
conversationSchema.methods.incrementUnreadCount = async function (userId, model) {
  const unreadEntry = this.unreadCount.find(
    (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === model
  );

  if (unreadEntry) {
    unreadEntry.count += 1;
  } else {
    this.unreadCount.push({ userId, unreadCountModel: model, count: 1 });
  }

  return await this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnreadCount = async function (userId, model) {
  const unreadEntry = this.unreadCount.find(
    (u) => u.userId.toString() === userId.toString() && u.unreadCountModel === model
  );

  if (unreadEntry) {
    unreadEntry.count = 0;
  }

  return await this.save();
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

