const Project = require("../models/Project");

/*
=====================================
Create Project
=====================================
*/

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      deadline,
      members,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project = await Project.create({
      title,
      description,
      status,
      priority,
      deadline,
      members,
      owner: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to create project",
    });
  }
};

/*
=====================================
Get All Projects
=====================================
*/

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch projects",
    });
  }
};

/*
=====================================
Get Single Project
=====================================
*/

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch project",
    });
  }
};

/*
=====================================
Update Project
=====================================
*/

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update project",
    });
  }
};

/*
=====================================
Delete Project
=====================================
*/

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to delete project",
    });
  }
};

/*
=====================================
Dashboard Statistics
=====================================
*/

exports.projectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "Active",
    });

    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });

    const planningProjects = await Project.countDocuments({
      status: "Planning",
    });

    res.json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        planningProjects,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch project statistics",
    });
  }
};