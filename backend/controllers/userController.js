import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

/* ==========================================
   GET ALL USERS
========================================== */

export const getUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   GET USER BY ID
========================================== */

export const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const projectCount =
      await Project.countDocuments({
        members: user._id,
      });

    const assignedTasks =
      await Task.countDocuments({
        assignedTo: user._id,
      });

    const completedTasks =
      await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      });

    res.json({
      success: true,
      user,
      statistics: {
        projectCount,
        assignedTasks,
        completedTasks,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   UPDATE USER PROFILE
========================================== */

export const updateUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const fields = [
      "name",
      "phone",
      "designation",
      "department",
      "bio",
      "avatar",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

/* ==========================================
   GET ALL USERS
========================================== */

export const getUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   GET USER BY ID
========================================== */

export const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const projectCount =
      await Project.countDocuments({
        members: user._id,
      });

    const assignedTasks =
      await Task.countDocuments({
        assignedTo: user._id,
      });

    const completedTasks =
      await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      });

    res.json({
      success: true,
      user,
      statistics: {
        projectCount,
        assignedTasks,
        completedTasks,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   UPDATE USER PROFILE
========================================== */

export const updateUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const fields = [
      "name",
      "phone",
      "designation",
      "department",
      "bio",
      "avatar",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
/* ==========================================
   DELETE USER
========================================== */

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   CHANGE USER ROLE
========================================== */

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["Admin", "Manager", "Member"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role provided.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully.",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   ACTIVATE / DEACTIVATE USER
========================================== */

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.status = user.status === "Active" ? "Inactive" : "Active";

    await user.save();

    res.json({
      success: true,
      message: `User ${user.status === "Active" ? "activated" : "deactivated"} successfully.`,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   SEARCH USERS
========================================== */

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { designation: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   USER DASHBOARD SUMMARY
========================================== */

export const getUserSummary = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
    ] = await Promise.all([
      Project.countDocuments({ members: userId }),
      Project.countDocuments({ members: userId, status: "Active" }),
      Task.countDocuments({ assignedTo: userId }),
      Task.countDocuments({ assignedTo: userId, status: "Completed" }),
      Task.countDocuments({ assignedTo: userId, status: "Pending" }),
    ]);

    res.json({
      success: true,
      user,
      summary: {
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};