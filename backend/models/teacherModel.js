import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    /* ================= AUTH ================= */
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    about: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    skills: {
      type: [String],
      validate: [arr => arr.length <= 10, "Max 10 skills allowed"]
    },

    experience: {
      type: Number, // in years
      default: 0,
    },

    /* ================= CERTIFICATES ================= */
    class10Certificate: {
      public_id: String,
      url: { type: String },
    },

    class12Certificate: {
      public_id: String,
      url: { type: String },
    },

    collegeCertificate: {
      public_id: String,
      url: { type: String },
    },

    phdOrOtherCertificate: {
      public_id: String,
      url: String,
    },

    profileImage: {
      public_id: String,
      url: String,
    },


    isSuspended: { type: Boolean, default: false },

    /* ================= SETTINGS ================= */
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      language: {
        type: String,
        enum: ["en", "es", "fr", "de", "zh", "ja"],
        default: "en",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        newStudent: { type: Boolean, default: true },
        classReminder: { type: Boolean, default: true },
        newMessage: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: false },
      },
      privacy: {
        profileVisible: { type: Boolean, default: true },
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        allowMessages: { type: Boolean, default: true },
      },
    },

  },
  {
    timestamps: true,
  }
);

/* ================= PASSWORD HASH ================= */
teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


/* ================= PASSWORD COMPARE ================= */
teacherSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
