const Task = require("../models/Task");
const Project = require("../models/Project");

/*
=====================================
Create Task
=====================================
*/

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to create task",
    });
  }
};

/*
=====================================
Get All Tasks
=====================================
*/

exports.getTasks = async (req, res) => {
  try {

    const tasks = await Task.find()
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch tasks",
    });

  }
};

/*
=====================================
Get Single Task
=====================================
*/

exports.getTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id)
      .populate("project", "title");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      task,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch task",
    });

  }
};

/*
=====================================
Update Task
=====================================
*/

exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update task",
    });

  }

};

/*
=====================================
Delete Task
=====================================
*/

exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {

      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to delete task",
    });

  }

};

/*
=====================================
Dashboard Statistics
=====================================
*/

exports.taskStats = async (req, res) => {

  try {

    const totalTasks = await Task.countDocuments();

    const completed = await Task.countDocuments({
      status: "Completed",
    });

    const todo = await Task.countDocuments({
      status: "Todo",
    });

    const inProgress = await Task.countDocuments({
      status: "In Progress",
    });

    const highPriority = await Task.countDocuments({
      priority: "High",
    });

    res.json({
      success: true,
      stats: {
        totalTasks,
        completed,
        todo,
        inProgress,
        highPriority,
      },
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch task statistics",
    });

  }

};

/*
=====================================
Search Tasks
=====================================
*/

exports.searchTasks = async (req, res) => {

  try {

    const keyword = req.query.keyword || "";

    const tasks = await Task.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.json({
      success: true,
      tasks,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Search failed",
    });

  }

};