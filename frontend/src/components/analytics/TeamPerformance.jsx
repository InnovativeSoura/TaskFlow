import { useMemo } from "react";

import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";

const TeamPerformance = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const members = useMemo(() => {
    const performance = {};

    tasks.forEach((task) => {
      const assignedUser =
        task.assignedTo?.name ||
        task.assignedTo?.email ||
        task.assignedTo ||
        "Unassigned";

      if (!performance[assignedUser]) {
        performance[assignedUser] = {
          name: assignedUser,
          total: 0,
          completed: 0,
        };
      }

      performance[assignedUser].total++;

      if (
        task.status === "Completed" ||
        task.status === "Done"
      ) {
        performance[assignedUser].completed++;
      }
    });

    const data = Object.values(performance).map(
      (member) => ({
        ...member,
        productivity:
          member.total > 0
            ? Math.round(
                (member.completed /
                  member.total) *
                  100
              )
            : 0,
      })
    );

    return data.sort(
      (a, b) =>
        b.productivity - a.productivity
    );
  }, [tasks]);

  if (!members.length) {
    return (
      <div className="empty-chart">
        <p>No team data available.</p>
      </div>
    );
  }

  const best = members[0];

  return (
    <div className="team-performance">

      {members.map((member, index) => (
        <div
          key={member.name}
          className={`team-card ${
            index === 0 ? "best-member" : ""
          }`}
        >
          <div className="team-top">

            <div className="team-avatar">
              {member.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="team-info">
              <h4>
                {member.name === "Unassigned"
                  ? member.name
                  : member.name}
              </h4>

              <small>
                {member.completed} /{" "}
                {member.total} Tasks
              </small>
            </div>

            <div className="team-score">
              {member.productivity}%
            </div>

          </div>

          <div className="team-progress">

            <div
              className="team-progress-fill"
              style={{
                width: `${member.productivity}%`,
              }}
            />

          </div>

          {index === 0 && (
            <span className="leader-badge">
              🏆 Top Performer
            </span>
          )}
        </div>
      ))}

      {user && (
        <div className="analytics-user">
          Logged in as
          <strong> {user.name}</strong>
        </div>
      )}

    </div>
  );
};

export default TeamPerformance;