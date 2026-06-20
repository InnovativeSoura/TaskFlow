const Workspace = require("../models/Workspace");

/*
=====================================
CREATE WORKSPACE
=====================================
*/
const createWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      success: true,
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET USER WORKSPACES
=====================================
*/
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user.id,
    });

    res.json({
      success: true,
      workspaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
ADD MEMBER TO WORKSPACE
=====================================
*/
const addMember = async (req, res) => {
  try {
    const { workspaceId, userId } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (!workspace.members.includes(userId)) {
      workspace.members.push(userId);
    }

    await workspace.save();

    res.json({
      success: true,
      message: "Member added",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  addMember,
};