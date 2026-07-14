import Project from "../models/Project.js";

/* ==========================================
   GET ALL PROJECTS
========================================== */

export const getProjects = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      archived: false,
    };

    // Normal users only see their own projects
    if (req.user.role !== "Admin") {
      query.$or = [
        { owner: req.user._id },
        { members: req.user._id },
      ];
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    console.error("Get Projects:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

/* ==========================================
   GET SINGLE PROJECT
========================================== */

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ==========================================
   CREATE PROJECT
========================================== */

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      progress,
      members,
      color,
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
      startDate,
      endDate,
      progress,
      color,
      owner: req.user._id,
      members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create Project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

/* ==========================================
   UPDATE PROJECT
========================================== */

export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      req.user.role !== "Admin" &&
      project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Project updated",
      project,
    });
  } catch (error) {
    console.error("Update Project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
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

    if (
      req.user.role !== "Admin" &&
      project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

/* ==========================================
   ARCHIVE PROJECT
========================================== */

export const archiveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.archived = true;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project archived successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Archive failed",
    });
  }
};