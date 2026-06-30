import "./DashboardCards.css";
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock5,
  AlertCircle,
} from "lucide-react";

function DashboardCards({
  totalProjects = 0,
  totalTasks = 0,
  completedTasks = 0,
  inProgressTasks = 0,
  pendingTasks = 0,
}) {
  const cards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: <FolderKanban size={30} />,
      color: "#2563eb",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: <CheckSquare size={30} />,
      color: "#7c3aed",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: <CheckCircle2 size={30} />,
      color: "#22c55e",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: <Clock5 size={30} />,
      color: "#f59e0b",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: <AlertCircle size={30} />,
      color: "#ef4444",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div className="dashboard-card" key={index}>
          <div
            className="dashboard-card-icon"
            style={{
              background: `${card.color}20`,
              color: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="dashboard-card-content">
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;