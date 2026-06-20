const Task = require("../models/Task");
const Project = require("../models/Project");

/*
=====================================
PROJECT DASHBOARD ANALYTICS
=====================================
*/
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({
      status: "Done",
    });

    const pendingTasks = await Task.countDocuments({
      status: "In Progress",
    });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" },
    });

    const totalProjects = await Project.countDocuments();

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    res.status(200).json({
      success: true,
      analytics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        totalProjects,
        completionRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardAnalytics,
};