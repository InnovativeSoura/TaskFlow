const Activity = require("../models/Activity");

/*
=====================================
LOG ACTIVITY
=====================================
*/
const logActivity = async ({
  user,
  project = null,
  action,
  description,
  type = "SYSTEM",
}) => {
  try {
    await Activity.create({
      user,
      project,
      action,
      description,
      type,
    });
  } catch (error) {
    console.log("Activity Log Error:", error.message);
  }
};

module.exports = {
  logActivity,
};