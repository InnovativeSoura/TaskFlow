const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    plan: {
      type: String,
      enum: ["free", "pro", "team"],
      default: "free",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Workspace",
  workspaceSchema
);