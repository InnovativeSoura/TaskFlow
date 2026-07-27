// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ======================================================
   USER SCHEMA
====================================================== */

const userSchema =
  new mongoose.Schema(
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

      /* ==========================================
         PASSWORD
      ========================================== */

      password: {
        type: String,
        default: "",
        minlength: 6,
        select: false,
      },

      /* ==========================================
         PROFILE
      ========================================== */

      avatar: {
        type: String,
        default: "",
      },

      provider: {
        type: String,
        enum: [
          "local",
          "google",
          "github",
        ],
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
        trim: true,
      },

      designation: {
        type: String,
        default: "Team Member",
        trim: true,
      },

      department: {
        type: String,
        default: "",
        trim: true,
      },

      bio: {
        type: String,
        default: "",
        trim: true,
      },

      /* ==========================================
         ROLE
      ========================================== */

      role: {
        type: String,
        enum: [
          "Admin",
          "Project Manager",
          "Team Member",
        ],
        default: "Team Member",
      },

      /* ==========================================
         STATUS
      ========================================== */

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
        ],
        default: "Active",
      },

      /* ==========================================
         VERIFICATION
      ========================================== */

      isVerified: {
        type: Boolean,
        default: false,
      },

      /* ==========================================
         LOGIN
      ========================================== */

      lastLogin: {
        type: Date,
        default: null,
      },

      /* ==========================================
         PASSWORD RESET
      ========================================== */

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

userSchema.pre(
  "save",
  async function () {
    if (
      !this.isModified(
        "password"
      )
    ) {
      return;
    }

    if (
      !this.password ||
      this.password.trim() === ""
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);

/* ======================================================
   MATCH PASSWORD
====================================================== */

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {
    if (
      !enteredPassword ||
      !this.password
    ) {
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

userSchema.methods.toJSON =
  function () {
    const obj =
      this.toObject();

    delete obj.password;

    return obj;
  };

const User =
  mongoose.model(
    "User",
    userSchema
  );

export default User;