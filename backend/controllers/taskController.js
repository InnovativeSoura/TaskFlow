import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

/* ==========================================
   CREATE TASK
========================================== */

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    if (!title || !project || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title, project and assigned user are required.",
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const userExists = await User.findById(assignedTo);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority: priority || "Medium",
      dueDate,
      status: "Pending",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   GET ALL TASKS
========================================== */

export const getTasks = async (req, res) => {
  try {
    const filter = {};

    // Team Members can only see their own tasks
    if (req.user.role === "Team Member") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.project) {
      filter.project = req.query.project;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   GET TASK BY ID
========================================== */

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get Task:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   UPDATE TASK
========================================== */

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update Task:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   DELETE TASK
========================================== */

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   UPDATE TASK STATUS
========================================== */

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
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

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update Task Status:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};