import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

import { useProjects } from "../../context/ProjectContext";
import { useTasks } from "../../context/TaskContext";

import { useEffect, useMemo, useState } from "react";

const AnalyticsCards = () => {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const [count, setCount] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    productivity: 0,
    users: 0,
  });

  const stats = useMemo(() => {
    const totalProjects = projects?.length || 0;
    const totalTasks = tasks?.length || 0;

    const completedTasks =
      tasks?.filter(
        (task) =>
          task.status === "Completed" ||
          task.status === "Done"
      ).length || 0;

    const totalUsers = [
      ...new Set(
        tasks
          ?.map((task) =>
            task.assignedTo?._id || task.assignedTo
          )
          .filter(Boolean)
      ),
    ].length;

    const productivity =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      productivity,
      totalUsers,
    };
  }, [projects, tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => ({
        projects:
          prev.projects < stats.totalProjects
            ? prev.projects + 1
            : stats.totalProjects,

        tasks:
          prev.tasks < stats.totalTasks
            ? prev.tasks + 1
            : stats.totalTasks,

        completed:
          prev.completed < stats.completedTasks
            ? prev.completed + 1
            : stats.completedTasks,

        productivity:
          prev.productivity < stats.productivity
            ? prev.productivity + 1
            : stats.productivity,

        users:
          prev.users < stats.totalUsers
            ? prev.users + 1
            : stats.totalUsers,
      }));
    }, 15);

    return () => clearInterval(timer);
  }, [stats]);

  const cards = [
    {
      title: "Projects",
      value: count.projects,
      icon: <FaProjectDiagram />,
      color: "#2563eb",
    },

    {
      title: "Tasks",
      value: count.tasks,
      icon: <FaTasks />,
      color: "#10b981",
    },

    {
      title: "Completed",
      value: count.completed,
      icon: <FaCheckCircle />,
      color: "#f59e0b",
    },

    {
      title: "Team",
      value: count.users,
      icon: <FaUsers />,
      color: "#8b5cf6",
    },

    {
      title: "Productivity",
      value: `${count.productivity}%`,
      icon: <FaChartLine />,
      color: "#ef4444",
    },
  ];

  return (
    <div className="analytics-cards">
      {cards.map((card) => (
        <div
          key={card.title}
          className="analytics-stat-card"
        >
          <div
            className="analytics-icon"
            style={{
              background: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="analytics-info">
            <h2>{card.value}</h2>

            <span>{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;