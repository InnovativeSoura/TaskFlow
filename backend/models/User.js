import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ======================================================
   USER SCHEMA
====================================================== */

const userSchema = new mongoose.Schema(
  {
    /* ==========================
       BASIC INFO
    ========================== */

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
      select: false,
    },

    /* ==========================
       PROFILE
    ========================== */

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

    /* ==========================
       ROLE
    ========================== */

    role: {
      type: String,
      enum: [
        "Admin",
        "Project Manager",
        "Team Member",
      ],
      default: "Team Member",
    },

    /* ==========================
       STATUS
    ========================== */

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    /* ==========================
       ACCOUNT
    ========================== */

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    /* ==========================
       PASSWORD RESET
    ========================== */

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

/* ======================================================
   MATCH PASSWORD
====================================================== */

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!enteredPassword) {
    return false;
  }

  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(
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