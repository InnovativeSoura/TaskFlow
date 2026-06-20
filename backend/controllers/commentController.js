const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const { getIO } = require("../sockets/socket.js");

/*
=====================================
ADD COMMENT
=====================================
*/
const addComment = async (req, res) => {
  try {
    const { taskId, userId, text } = req.body;

    if (!taskId || !userId || !text) {
      return res.status(400).json({
        success: false,
        message: "Please provide taskId, userId and text",
      });
    }

    // Create comment
    const comment = await Comment.create({
      task: taskId,
      user: userId,
      text,
    });

    // Populate user details
    const populatedComment = await Comment.findById(
      comment._id
    ).populate("user", "name email profileImage");

    // Create notification
    await Notification.create({
      user: userId,
      message: `New comment added: ${text}`,
    });

    // Real-time socket event
    try {
      const io = getIO();

      io.emit("newComment", {
        _id: comment._id,
        taskId,
        userId,
        text,
        createdAt: comment.createdAt,
      });
    } catch (socketError) {
      console.log(
        "Socket not initialized:",
        socketError.message
      );
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET COMMENTS BY TASK
=====================================
*/
const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({
      task: taskId,
    })
      .populate(
        "user",
        "name email profileImage"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
UPDATE COMMENT
=====================================
*/
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment =
      await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.text = text;

    await comment.save();

    try {
      const io = getIO();

      io.emit("commentUpdated", {
        commentId: id,
        text,
      });
    } catch (socketError) {
      console.log(
        "Socket not initialized:",
        socketError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
DELETE COMMENT
=====================================
*/
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment =
      await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(id);

    try {
      const io = getIO();

      io.emit("commentDeleted", {
        commentId: id,
      });
    } catch (socketError) {
      console.log(
        "Socket not initialized:",
        socketError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};