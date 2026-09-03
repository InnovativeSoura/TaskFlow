const express = require("express");

const {
  sendInvitation,
  getInvitations,
  getUserInvitations,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation,
} = require("../controllers/invitationController");

const router = express.Router();

router.post("/send", sendInvitation);

router.get("/", getInvitations);

router.get("/user/:email", getUserInvitations);

router.put("/accept/:id", acceptInvitation);

router.put("/reject/:id", rejectInvitation);

router.delete("/:id", deleteInvitation);

module.exports = router;
