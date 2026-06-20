const mongoose = require("mongoose");

const commentSchema =
  new mongoose.Schema(
    {
      task: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      text: {
        type: String,
        required: true,
      },
      workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
      
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Comment",
    commentSchema
  );