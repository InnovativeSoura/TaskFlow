const Task = require("../models/Task");

const {
  createNotification,
} = require("../services/notificationService");

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // NOTIFY USER
    await createNotification({
      user: req.user.id,
      title: "New Task Created",
      message: `Task "${task.title}" has been created successfully`,
      type: "TASK",
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const tasks = await Task.find({
  workspace: req.params.workspaceId,
});

module.exports = { createTask };