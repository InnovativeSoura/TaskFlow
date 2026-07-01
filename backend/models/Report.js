import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
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

    type: {
      type: String,
      enum: [
        "Project",
        "Task",
        "User",
        "Productivity",
        "Performance",
        "Custom",
      ],
      default: "Project",
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    exportFormat: {
      type: String,
      enum: [
        "PDF",
        "Excel",
        "CSV",
      ],
      default: "PDF",
    },

    statistics: {
      totalProjects: {
        type: Number,
        default: 0,
      },

      completedProjects: {
        type: Number,
        default: 0,
      },

      totalTasks: {
        type: Number,
        default: 0,
      },

      completedTasks: {
        type: Number,
        default: 0,
      },

      pendingTasks: {
        type: Number,
        default: 0,
      },

      overdueTasks: {
        type: Number,
        default: 0,
      },

      activeUsers: {
        type: Number,
        default: 0,
      },

      productivity: {
        type: Number,
        default: 0,
      },
    },

    charts: [
      {
        label: String,

        value: Number,
      },
    ],

    fileUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Generating",
        "Completed",
        "Failed",
      ],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

/* ==============================
   INDEXES
============================== */

reportSchema.index({
  generatedBy: 1,
});

reportSchema.index({
  project: 1,
});

reportSchema.index({
  createdAt: -1,
});

export default mongoose.model(
  "Report",
  reportSchema
);