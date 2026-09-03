import mongoose from "mongoose";

import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

const TASK_STATUSES = ["To Do", "In Progress", "Review", "Completed"];

const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"];

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      status,
      dueDate,
      progress,
      estimatedHours,
      labels,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    if (!project) {
      return res.status(400).json({
        success: false,
        message: "Project is required.",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required.",
      });
    }

    if (!isValidObjectId(project)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    if (!isValidObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assigned user ID.",
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const userExists = await User.findById(assignedTo);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found.",
      });
    }

    const taskStatus = status || "To Do";

    if (!TASK_STATUSES.includes(taskStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task status. Allowed values: ${TASK_STATUSES.join(
          ", ",
        )}`,
      });
    }

    const taskPriority = priority || "Medium";

    if (!TASK_PRIORITIES.includes(taskPriority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task priority. Allowed values: ${TASK_PRIORITIES.join(
          ", ",
        )}`,
      });
    }

    const taskProgress =
      progress === undefined || progress === null ? 0 : Number(progress);

    if (Number.isNaN(taskProgress) || taskProgress < 0 || taskProgress > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a number between 0 and 100.",
      });
    }

    const task = await Task.create({
      title: title.trim(),

      description: description?.trim() || "",

      project,

      assignedTo,

      priority: taskPriority,

      status: taskStatus,

      dueDate: dueDate || null,

      progress: taskProgress,

      estimatedHours: estimatedHours !== undefined ? Number(estimatedHours) : 0,

      labels: Array.isArray(labels) ? labels : [],

      createdBy: req.user._id,
    });

    await task.populate([
      {
        path: "project",
        select: "title status",
      },
      {
        path: "assignedTo",
        select: "name email role",
      },
      {
        path: "createdBy",
        select: "name email",
      },
    ]);

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Create Task:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "Team Member") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.project) {
      if (!isValidObjectId(req.query.project)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      filter.project = req.query.project;
    }

    if (req.query.status) {
      if (!TASK_STATUSES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status.",
        });
      }

      filter.status = req.query.status;
    }

    if (req.query.archived !== undefined) {
      filter.isArchived = req.query.archived === "true";
    }

    const tasks = await Task.find(filter)
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findById(id)
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    if (
      req.user.role === "Team Member" &&
      String(task.assignedTo?._id) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this task.",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get Task:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      status,
      dueDate,
      progress,
      estimatedHours,
      actualHours,
      labels,
      isArchived,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty.",
        });
      }

      updateData.title = String(title).trim();
    }

    if (description !== undefined) {
      updateData.description = String(description).trim();
    }

    if (project !== undefined) {
      if (!isValidObjectId(project)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const projectExists = await Project.findById(project);

      if (!projectExists) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      updateData.project = project;
    }

    if (assignedTo !== undefined) {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      const userExists = await User.findById(assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }

      updateData.assignedTo = assignedTo;
    }

    if (priority !== undefined) {
      if (!TASK_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority.",
        });
      }

      updateData.priority = priority;
    }

    if (status !== undefined) {
      if (!TASK_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status.",
        });
      }

      updateData.status = status;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate || null;
    }

    if (progress !== undefined) {
      const numericProgress = Number(progress);

      if (
        Number.isNaN(numericProgress) ||
        numericProgress < 0 ||
        numericProgress > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Progress must be between 0 and 100.",
        });
      }

      updateData.progress = numericProgress;
    }

    if (estimatedHours !== undefined) {
      const value = Number(estimatedHours);

      if (Number.isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Estimated hours must be a positive number.",
        });
      }

      updateData.estimatedHours = value;
    }

    if (actualHours !== undefined) {
      const value = Number(actualHours);

      if (Number.isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Actual hours must be a positive number.",
        });
      }

      updateData.actualHours = value;
    }

    if (labels !== undefined) {
      if (!Array.isArray(labels)) {
        return res.status(400).json({
          success: false,
          message: "Labels must be an array.",
        });
      }

      updateData.labels = labels;
    }

    if (isArchived !== undefined) {
      updateData.isArchived = Boolean(isArchived);
    }

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("project", "title status")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update Task:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    if (!TASK_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task status. Allowed values: ${TASK_STATUSES.join(
          ", ",
        )}`,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    if (
      req.user.role === "Team Member" &&
      String(task.assignedTo) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task.",
      });
    }

    task.status = status;

    if (status === "Completed") {
      task.progress = 100;
    }

    if (status === "To Do" && task.progress === 100) {
      task.progress = 0;
    }

    await task.save();

    await task.populate([
      {
        path: "project",
        select: "title status",
      },
      {
        path: "assignedTo",
        select: "name email role",
      },
      {
        path: "createdBy",
        select: "name email",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update Task Status:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
