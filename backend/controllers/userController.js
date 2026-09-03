import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

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

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [projectCount, assignedTasks, completedTasks] = await Promise.all([
      Project.countDocuments({
        members: user._id,
      }),

      Task.countDocuments({
        assignedTo: user._id,
      }),

      Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      }),
    ]);

    return res.status(200).json({
      success: true,
      user,
      statistics: {
        projectCount,
        assignedTasks,
        completedTasks,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["Admin", "Project Manager", "Team Member"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Change Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = user.status === "Active" ? "Inactive" : "Active";

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Search Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserSummary = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
    ] = await Promise.all([
      Project.countDocuments({
        members: userId,
      }),

      Project.countDocuments({
        members: userId,
        status: "Active",
      }),

      Task.countDocuments({
        assignedTo: userId,
      }),

      Task.countDocuments({
        assignedTo: userId,
        status: "Completed",
      }),

      Task.countDocuments({
        assignedTo: userId,
        status: "Pending",
      }),
    ]);

    return res.status(200).json({
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
    console.error("User Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const allowedFields = [
      "name",
      "phone",
      "designation",
      "department",
      "bio",
      "avatar",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
