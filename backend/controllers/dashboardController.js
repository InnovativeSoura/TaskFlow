const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {
  try {
    // Project Stats
    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "Active",
    });

    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });

    // Task Stats
    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });

    const todoTasks = await Task.countDocuments({
      status: "Todo",
    });

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    // Recent Projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Tasks
    const recentTasks = await Task.find()
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming Deadlines
    const upcomingTasks = await Task.find({
      dueDate: {
        $gte: new Date(),
      },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    res.json({
      success: true,

      statistics: {
        totalProjects,
        activeProjects,
        completedProjects,

        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,

        completionRate,
      },

      recentProjects,

      recentTasks,

      upcomingTasks,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Dashboard data could not be loaded.",
    });
  }
};