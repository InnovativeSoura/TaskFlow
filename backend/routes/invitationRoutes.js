const express = require(
  "express"
);

const {
  sendInvitation,
  getInvitations,
  getUserInvitations,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation,
} = require(
  "../controllers/invitationController"
);

const router =
  express.Router();

/*
==========================
SEND INVITATION
==========================
*/
router.post(
  "/send",
  sendInvitation
);

/*
==========================
GET ALL INVITATIONS
==========================
*/
router.get(
  "/",
  getInvitations
);

/*
==========================
GET USER INVITATIONS
==========================
*/
router.get(
  "/user/:email",
  getUserInvitations
);

/*
==========================
ACCEPT INVITATION
==========================
*/
router.put(
  "/accept/:id",
  acceptInvitation
);

/*
==========================
REJECT INVITATION
==========================
*/
router.put(
  "/reject/:id",
  rejectInvitation
);

/*
==========================
DELETE INVITATION
==========================
*/
router.delete(
  "/:id",
  deleteInvitation
);

module.exports = router;