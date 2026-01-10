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

    /* ================= CERTIFICATES ================= */
    class10Certificate: {
      type: String, // file URL / Cloudinary URL
      required: true,
    },

    class12Certificate: {
      type: String,
      required: true,
    },

    collegeCertificate: {
      type: String,
      required: true,
    },

    phdOrOtherCertificate: {
      type: String, // optional
      default: null,
    },

    /* ================= PROFILE ================= */
    profileImage: {
      type: String, // image URL
      default: "",
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
