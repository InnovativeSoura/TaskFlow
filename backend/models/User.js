import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "Team Member",
    },

    department: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "Admin",
        "Manager",
        "Team Member",
      ],
      default: "Admin",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   HASH PASSWORD
=========================== */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ===========================
   MATCH PASSWORD
=========================== */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

const User = mongoose.model("User", userSchema);

export default User;