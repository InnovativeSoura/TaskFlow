const Project = require("../models/Project");

// GET ALL PROJECTS
const getProjects = async (req, res) => {
try {
const projects = await Project.find();


res.status(200).json({
  success: true,
  projects,
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// CREATE PROJECT
const createProject = async (req, res) => {
try {
const { title, description } = req.body || {};


if (!title || !description) {
  return res.status(400).json({
    success: false,
    message:
      "Title and description are required",
  });
}

const project = await Project.create({
  title,
  description,
});

res.status(201).json({
  success: true,
  project,
});


} catch (error) {
console.error(
"Create Project Error:",
error
);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// ADD MEMBER
const addMember = async (req, res) => {
try {
const project =
await Project.findById(
req.params.projectId
);


if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found",
  });
}

project.members.push({
  user: req.body.userId,
  role:
    req.body.role ||
    "Member",
});

await project.save();

res.status(200).json({
  success: true,
  project,
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

module.exports = {
createProject,
getProjects,
addMember,
};
