import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "System",
        "Project",
        "Task",
        "Comment",
        "Deadline",
        "Assignment",
      ],
      default: "System",
    },

    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    icon: {
      type: String,
      default: "bell",
    },

    color: {
      type: String,
      default: "#2563eb",
    },

    read: {
      type: Boolean,
      default: false,
    },

    actionUrl: {
      type: String,
      default: "",
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ================================
   INDEXES
================================ */

notificationSchema.index({
  user: 1,
  read: 1,
});

notificationSchema.index({
  createdAt: -1,
});

export default mongoose.model(
  "Notification",
  notificationSchema
);