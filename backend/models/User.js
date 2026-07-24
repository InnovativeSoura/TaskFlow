import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ======================================================
   USER SCHEMA
====================================================== */

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

    // Optional for OAuth users
    password: {
      type: String,
      default: "",
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    // NEW
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    googleId: {
      type: String,
      default: "",
    },

    githubId: {
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
        "Project Manager",
        "Team Member",
      ],
      default: "Team Member",
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
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

/* ======================================================
   HASH PASSWORD
====================================================== */

userSchema.pre("save", async function () {
  // Don't hash if password hasn't changed
  if (!this.isModified("password")) {
    return;
  }

  // Skip hashing for OAuth users
  if (!this.password || this.password.trim() === "") {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

/* ======================================================
   MATCH PASSWORD
====================================================== */

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!enteredPassword || !this.password) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

/* ======================================================
   REMOVE PASSWORD FROM JSON
====================================================== */

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;

  return obj;
};

const User = mongoose.model(
  "User",
  userSchema
);

export default User;