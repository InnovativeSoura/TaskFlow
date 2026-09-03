const User = require("../models/User");

const Project = require("../models/Project");

const Task = require("../models/Task");

const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();

    const projects = await Project.countDocuments();

    const tasks = await Task.countDocuments();

    res.json({
      success: true,
      users,
      projects,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = req.body.role;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isActive = !user.isActive;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateRole,
  toggleUserStatus,
};
