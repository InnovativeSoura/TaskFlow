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
const { title, description } = req.body;


const project = await Project.create({
  title,
  description,
});

res.status(201).json({
  success: true,
  project,
});


} catch (error) {
console.error("Create Project Error:", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};
