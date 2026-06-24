const Task = require("../models/Task");

const createTask = async (req, res) => {
try {
console.log("TASK BODY:", req.body);


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
console.error(
"Create Task Error:",
error
);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

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
assignTask,
};
