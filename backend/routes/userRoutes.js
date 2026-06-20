const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require(
  "../controllers/userController"
);

const router = express.Router();

router.get("/:id", getProfile);

router.put("/:id", updateProfile);

router.put(
  "/change-password/:id",
  changePassword
);

module.exports = router;