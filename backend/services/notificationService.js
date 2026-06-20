const Notification = require("../models/Notification");

/*
=====================================
CREATE NOTIFICATION
=====================================
*/
const createNotification = async ({
  user,
  title,
  message,
  type = "INFO",
}) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
    });
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};

module.exports = {
  createNotification,
};