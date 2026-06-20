const Invitation = require(
  "../models/Invitation"
);

const Project = require(
  "../models/Project"
);

/*
==================================
SEND INVITATION
==================================
*/
const sendInvitation =
  async (req, res) => {
    try {
      const {
        email,
        project,
        invitedBy,
      } = req.body;

      if (
        !email ||
        !project ||
        !invitedBy
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all fields",
        });
      }

      const projectExists =
        await Project.findById(
          project
        );

      if (!projectExists) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found",
        });
      }

      const existingInvitation =
        await Invitation.findOne({
          email,
          project,
          status: "Pending",
        });

      if (existingInvitation) {
        return res.status(400).json({
          success: false,
          message:
            "Invitation already sent",
        });
      }

      const invitation =
        await Invitation.create({
          email,
          project,
          invitedBy,
        });

      res.status(201).json({
        success: true,
        message:
          "Invitation sent successfully",
        invitation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
GET ALL INVITATIONS
==================================
*/
const getInvitations =
  async (req, res) => {
    try {
      const invitations =
        await Invitation.find()
          .populate(
            "project",
            "name"
          )
          .populate(
            "invitedBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          invitations.length,
        invitations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
GET USER INVITATIONS
==================================
*/
const getUserInvitations =
  async (req, res) => {
    try {
      const invitations =
        await Invitation.find({
          email:
            req.params.email,
        })
          .populate(
            "project"
          )
          .populate(
            "invitedBy",
            "name email"
          );

      res.status(200).json({
        success: true,
        invitations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
ACCEPT INVITATION
==================================
*/
const acceptInvitation =
  async (req, res) => {
    try {
      const invitation =
        await Invitation.findById(
          req.params.id
        );

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message:
            "Invitation not found",
        });
      }

      invitation.status =
        "Accepted";

      await invitation.save();

      res.status(200).json({
        success: true,
        message:
          "Invitation accepted",
        invitation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
REJECT INVITATION
==================================
*/
const rejectInvitation =
  async (req, res) => {
    try {
      const invitation =
        await Invitation.findById(
          req.params.id
        );

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message:
            "Invitation not found",
        });
      }

      invitation.status =
        "Rejected";

      await invitation.save();

      res.status(200).json({
        success: true,
        message:
          "Invitation rejected",
        invitation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
DELETE INVITATION
==================================
*/
const deleteInvitation =
  async (req, res) => {
    try {
      const invitation =
        await Invitation.findById(
          req.params.id
        );

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message:
            "Invitation not found",
        });
      }

      await Invitation.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Invitation deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  sendInvitation,
  getInvitations,
  getUserInvitations,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation,
};