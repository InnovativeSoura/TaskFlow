import Project from "../models/Project.js";
import User from "../models/User.js";

/* ==========================================
   CREATE PROJECT
========================================== */

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      status = "Active",
      startDate,
      endDate,
      members = [],
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (members.length) {
      const existingUsers = await User.find({
        _id: { $in: members },
      });

      if (existingUsers.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: "One or more selected members are invalid.",
        });
      }
    }

    const project = await Project.create({
      title: title.trim(),
      description,
      status,
      startDate,
      endDate,
      members,
      createdBy: req.user._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create Project:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   GET ALL PROJECTS
========================================== */

export const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "Team Member") {
      filter = {
        members: req.user._id,
      };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get Projects:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
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
      .populate("createdBy", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (
      req.user.role === "Team Member" &&
      !project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   UPDATE PROJECT
========================================== */

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update Project:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
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
        message: "Project not found.",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Project:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   ADD MEMBER
========================================== */

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      project.members.some(
        (member) => member.toString() === userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "User is already a member.",
      });
    }

    project.members.push(userId);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Add Member:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};