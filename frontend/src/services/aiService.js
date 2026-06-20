const generateProjectSummary =
  (
    totalTasks,
    completedTasks,
    overdueTasks
  ) => {
    const completionRate =
      Math.round(
        (completedTasks /
          totalTasks) *
          100
      );

    return `
Project Completion: ${completionRate}%

Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Overdue Tasks: ${overdueTasks}

Recommendation:
Focus on overdue tasks first.
`;
  };

module.exports = {
  generateProjectSummary,
};