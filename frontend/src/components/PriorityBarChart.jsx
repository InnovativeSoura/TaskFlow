import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PriorityBarChart({
  tasks,
}) {
  const data = [
    {
      priority: "Low",
      count: tasks.filter(
        (t) =>
          t.priority ===
          "Low"
      ).length,
    },
    {
      priority:
        "Medium",
      count: tasks.filter(
        (t) =>
          t.priority ===
          "Medium"
      ).length,
    },
    {
      priority:
        "High",
      count: tasks.filter(
        (t) =>
          t.priority ===
          "High"
      ).length,
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis
          dataKey="priority"
        />
        <YAxis />
        <Tooltip />

        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PriorityBarChart;