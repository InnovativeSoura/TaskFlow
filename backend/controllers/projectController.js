import Project from "../models/Project.js";
import User from "../models/User.js";

/* ==========================================
   CREATE PROJECT
========================================== */

export const createProject = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate, members } = req.body;

    // Validate members exist
    if (members && members.length > 0) {
      const users = await User.find({ _id: { $in: members } });

      if (users.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: "One or more members are invalid",
        });
      }
    }

    const project = await Project.create({
      title,
      description,
      status: status || "Active",
      startDate,
      endDate,
      members,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET ALL PROJECTS
========================================== */

export const getProjects = async (req, res) => {
  try {
    const filter = {};

    // Optional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET PROJECT BY ID
========================================== */

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email");

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   UPDATE PROJECT
========================================== */

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const fields = [
      "title",
      "description",
      "status",
      "startDate",
      "endDate",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE PROJECT
========================================== */

export const deleteProject = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   ADD MEMBER TO PROJECT
========================================== */

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already in project",
      });
    }

    project.members.push(userId);
    await project.save();

    res.json({
      success: true,
      message: "Member added successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};