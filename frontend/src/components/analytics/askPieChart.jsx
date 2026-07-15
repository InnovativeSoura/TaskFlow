import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useMemo } from "react";
import { useTasks } from "../../context/TaskContext";

const COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

const TaskPieChart = () => {
  const { tasks } = useTasks();

  const data = useMemo(() => {
    const todo = tasks.filter(
      (task) =>
        task.status === "Todo" ||
        task.status === "To Do"
    ).length;

    const progress = tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

    const completed = tasks.filter(
      (task) =>
        task.status === "Completed" ||
        task.status === "Done"
    ).length;

    const overdue = tasks.filter(
      (task) => {
        if (!task.dueDate) return false;

        return (
          new Date(task.dueDate) < new Date() &&
          task.status !== "Completed" &&
          task.status !== "Done"
        );
      }
    ).length;

    return [
      {
        name: "Todo",
        value: todo,
      },
      {
        name: "In Progress",
        value: progress,
      },
      {
        name: "Completed",
        value: completed,
      },
      {
        name: "Overdue",
        value: overdue,
      },
    ];
  }, [tasks]);

  return (
    <div
      style={{
        width: "100%",
        height: 360,
      }}
    >
      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            dataKey="value"
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskPieChart;