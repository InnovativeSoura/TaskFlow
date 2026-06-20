const Activity = require(
  "../models/Activity"
);

const logActivity = async ({
  user,
  action,
  entityType,
  entityId,
  details,
}) => {
  try {
    await Activity.create({
      user,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.log(
      "Activity Log Error:",
      error.message
    );
  }
};

module.exports = logActivity;