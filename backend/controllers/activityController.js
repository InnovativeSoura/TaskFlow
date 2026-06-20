const Activity = require(
  "../models/Activity"
);

const getActivities =
  async (req, res) => {
    try {
      const activities =
        await Activity.find()
          .populate(
            "user",
            "name profileImage"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          activities.length,
        activities,
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
  getActivities,
};