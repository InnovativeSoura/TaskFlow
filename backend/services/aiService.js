const generateProjectSummary =
  (
    totalTasks,
    completedTasks,
    overdueTasks
  ) => {
    const completion =
      Math.round(
        (completedTasks /
          totalTasks) *
          100
      );

    return `
Project Completion: ${completion}%

Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Overdue Tasks: ${overdueTasks}

Recommendation:
Focus on overdue tasks and pending deliverables.
`;
  };

module.exports = {
  generateProjectSummary,
};