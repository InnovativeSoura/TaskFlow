// backend/models/Task.js

import mongoose from "mongoose";

/* =========================================================
   CHECKLIST SCHEMA
========================================================= */

const checklistSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   COMMENT SCHEMA
========================================================= */

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

/* =========================================================
   ATTACHMENT SCHEMA
========================================================= */

const attachmentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      trim: true,
    },

    fileUrl: {
      type: String,
      trim: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ACTIVITY SCHEMA
========================================================= */

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   TASK SCHEMA
========================================================= */

const taskSchema = new mongoose.Schema(
  {
    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       PROJECT
    ===================================================== */

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    /* =====================================================
       ASSIGNMENT
    ===================================================== */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =====================================================
       STATUS

       IMPORTANT:
       These values must match the frontend and controller.
    ===================================================== */

    status: {
      type: String,

      enum: [
        "To Do",
        "In Progress",
        "Review",
        "Completed",
      ],

      default: "To Do",
    },

    /* =====================================================
       PRIORITY
    ===================================================== */

    priority: {
      type: String,

      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],

      default: "Medium",
    },

    /* =====================================================
       DATE
    ===================================================== */

    dueDate: {
      type: Date,
      default: null,
    },

    /* =====================================================
       TIME TRACKING
    ===================================================== */

    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    actualHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================================================
       PROGRESS
    ===================================================== */

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* =====================================================
       LABELS
    ===================================================== */

    labels: [
      {
        type: String,
        trim: true,
      },
    ],

    /* =====================================================
       CHECKLIST
    ===================================================== */

    checklist: [
      checklistSchema,
    ],

    /* =====================================================
       COMMENTS
    ===================================================== */

    comments: [
      commentSchema,
    ],

    /* =====================================================
       ATTACHMENTS
    ===================================================== */

    attachments: [
      attachmentSchema,
    ],

    /* =====================================================
       ACTIVITY
    ===================================================== */

    activity: [
      activitySchema,
    ],

    /* =====================================================
       ARCHIVE
    ===================================================== */

    isArchived: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

taskSchema.index({
  project: 1,
  status: 1,
});

taskSchema.index({
  assignedTo: 1,
});

taskSchema.index({
  priority: 1,
});

taskSchema.index({
  createdBy: 1,
});

taskSchema.index({
  dueDate: 1,
});

/* =========================================================
   MODEL
========================================================= */

export default mongoose.model(
  "Task",
  taskSchema
);