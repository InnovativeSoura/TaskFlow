const Task = require("../models/Task");

const {
  createNotification,
} = require("../services/notificationService");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    if (req.user) {
      await createNotification({
        user: req.user.id,
        title: "New Task Created",
        message: `Task "${task.title}" has been created successfully`,
        type: "TASK",
      });
    }

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

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ASSIGN TASK
const assignTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        assignedTo: req.body.assignedTo,
      },
      { new: true }
    );

    res.status(200).json({
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

module.exports = {
  createTask,
  getTasks,
  assignTask,
};