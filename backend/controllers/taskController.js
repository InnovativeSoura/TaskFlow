const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
try {
const {
title,
description,
priority,
status,
project,
assignedTo,
dueDate,
workspace,
} = req.body || {};


if (!title) {
  return res.status(400).json({
    success: false,
    message: "Task title is required",
  });
}

const task = await Task.create({
  title,
  description,
  priority,
  status,
  project,
  assignedTo,
  dueDate,
  workspace,
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

// GET SINGLE TASK
const getTaskById = async (req, res) => {
try {
const task = await Task.findById(
req.params.taskId
);


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
res.status(500).json({
success: false,
message: error.message,
});
}
};

// UPDATE TASK
const updateTask = async (req, res) => {
try {
const task =
await Task.findByIdAndUpdate(
req.params.taskId,
req.body,
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

// DELETE TASK
const deleteTask = async (req, res) => {
try {
await Task.findByIdAndDelete(
req.params.taskId
);


res.status(200).json({
  success: true,
  message: "Task deleted",
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
const task =
await Task.findByIdAndUpdate(
req.params.taskId,
{
assignedTo:
req.body.assignedTo,
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
getTaskById,
updateTask,
deleteTask,
assignTask,
};
