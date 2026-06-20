import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatusPieChart({ tasks }) {
  const data = [
    {
      name: "Todo",
      value: tasks.filter(
        (t) => t.status === "Todo"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (t) => t.status === "In Progress"
      ).length,
    },
    {
      name: "Review",
      value: tasks.filter(
        (t) => t.status === "Review"
      ).length,
    },
    {
      name: "Completed",
      value: tasks.filter(
        (t) => t.status === "Completed"
      ).length,
    },
  ];

  const COLORS = [
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#10b981",
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={120}
          label
        >
          {data.map(
            (_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default StatusPieChart;