import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ==========================
    // APPEARANCE
    // ==========================

    darkMode: {
      type: Boolean,
      default: false,
    },

    themeColor: {
      type: String,
      default: "#2563eb",
    },

    // ==========================
    // NOTIFICATIONS
    // ==========================

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    pushNotifications: {
      type: Boolean,
      default: true,
    },

    desktopNotifications: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // PRIVACY
    // ==========================

    profileVisibility: {
      type: String,
      enum: [
        "Public",
        "Private",
        "Team Only",
      ],
      default: "Team Only",
    },

    // ==========================
    // REGIONAL
    // ==========================

    language: {
      type: String,
      default: "English",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    dateFormat: {
      type: String,
      default: "DD/MM/YYYY",
    },

    timeFormat: {
      type: String,
      enum: [
        "12 Hour",
        "24 Hour",
      ],
      default: "12 Hour",
    },

    // ==========================
    // APPLICATION
    // ==========================

    autoSave: {
      type: Boolean,
      default: true,
    },

    itemsPerPage: {
      type: Number,
      default: 10,
      min: 5,
      max: 100,
    },

    defaultProjectView: {
      type: String,
      enum: [
        "List",
        "Kanban",
        "Calendar",
      ],
      default: "Kanban",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Settings",
  settingsSchema
);