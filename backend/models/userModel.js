import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    skills: {
      type: [String],
      default: []
    },
    profileImage: {
      public_id: String,
      url: String,
    },

    isSuspended: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
