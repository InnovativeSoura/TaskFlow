const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
    },

    status: {
      type: String,
      enum: [
        "Todo",
        "In Progress",
        "Review",
        "Completed",
      ],
      default: "Todo",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    dueDate: Date,
  
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

      timestamps: true,
    },
  );

module.exports = mongoose.model(
  "Task",
  taskSchema
);