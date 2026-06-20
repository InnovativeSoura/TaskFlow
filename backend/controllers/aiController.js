const {
  generateProjectSummary,
} = require(
  "../services/aiService"
);

const generateSummary =
  async (
    req,
    res
  ) => {
    try {
      const {
        totalTasks,
        completedTasks,
        overdueTasks,
      } = req.body;

      const summary =
        generateProjectSummary(
          totalTasks,
          completedTasks,
          overdueTasks
        );

      res.json({
        success: true,
        summary,
      });
    } catch (
      error
    ) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  generateSummary,
};