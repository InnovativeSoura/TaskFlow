const Project = require("../models/Project");

const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const alreadyExists = project.members.find(
      (member) =>
        member.user.toString() === userId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    project.members.push({
      user: userId,
      role: role || "Member",
    });

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMember,
};