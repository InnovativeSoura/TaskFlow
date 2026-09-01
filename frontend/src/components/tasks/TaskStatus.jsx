import { motion } from "framer-motion";
import "../../styles/TaskStatus.css";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { FaChartPie, FaArrowUp } from "react-icons/fa";

const COLORS = {
  Pending: "#6366F1",
  "In Progress": "#F59E0B",
  Review: "#06B6D4",
  Completed: "#10B981",
};

const TaskStatus = ({ tasks = [] }) => {
  const pending = tasks.filter((task) => task.status === "Pending").length;

  const progress = tasks.filter((task) => task.status === "In Progress").length;

  const review = tasks.filter((task) => task.status === "Review").length;

  const completed = tasks.filter((task) => task.status === "Completed").length;

  const total = tasks.length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const chartData = [
    {
      name: "Pending",
      value: pending,
      color: COLORS.Pending,
    },

    {
      name: "In Progress",
      value: progress,
      color: COLORS["In Progress"],
    },

    {
      name: "Review",
      value: review,
      color: COLORS.Review,
    },

    {
      name: "Completed",
      value: completed,
      color: COLORS.Completed,
    },
  ].filter((item) => item.value > 0);

  if (total === 0) {
    return (
      <motion.div
        className="task-status-card empty"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div className="chart-empty-icon">
          <FaChartPie />
        </div>

        <h3>No Task Analytics</h3>

        <p>
          Create your first task to see status distribution and productivity
          insights.
        </p>
      </motion.div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const item = payload[0];

    const percent = Math.round((item.value / total) * 100);

    return (
      <div className="task-chart-tooltip">
        <strong>{item.name}</strong>

        <span>
          {item.value} Task
          {item.value !== 1 && "s"}
        </span>

        <small>{percent}% of total</small>
      </div>
    );
  };

  return (
    <motion.section
      className="task-status-card"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="task-status-header">
        <div>
          <span className="section-badge">
            <FaChartPie />
            Task Analytics
          </span>

          <h2>Task Status Overview</h2>

          <p>Monitor task distribution across your workspace.</p>
        </div>

        <div className="completion-box">
          <span>
            <FaArrowUp />
            Productivity
          </span>

          <strong>{completionRate}%</strong>
        </div>
      </div>

      <div className="task-status-content">
        {/* Chart */}

        <div className="task-status-chart">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={112}
                paddingAngle={4}
                stroke="rgba(255,255,255,.08)"
                strokeWidth={2}
                animationDuration={900}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: 20,
                  color: "#cbd5e1",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="task-status-summary">
          {chartData.map((item) => (
            <motion.div
              key={item.name}
              className="status-summary-card"
              whileHover={{
                y: -4,
              }}
            >
              <div
                className="status-dot"
                style={{
                  background: item.color,
                }}
              />

              <div className="status-info">
                <h4>{item.name}</h4>

                <p>
                  {item.value} Task
                  {item.value !== 1 && "s"}
                </p>
              </div>

              <strong>{Math.round((item.value / total) * 100)}%</strong>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="task-status-footer">
        <span>
          Total Tasks
          <strong>{total}</strong>
        </span>

        <span>
          Completion Rate
          <strong>{completionRate}%</strong>
        </span>
      </div>
    </motion.section>
  );
};

export default TaskStatus;
