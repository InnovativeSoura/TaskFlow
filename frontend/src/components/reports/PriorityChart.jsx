import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444", // High
  "#f59e0b", // Medium
  "#22c55e", // Low
];

const PriorityChart = ({ tasks }) => {
  const high = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const data = [
    {
      name: "High",
      value: high,
    },
    {
      name: "Medium",
      value: medium,
    },
    {
      name: "Low",
      value: low,
    },
  ];

  return (
    <div className="chart-card">

      <h3>Task Priority</h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={55}
            paddingAngle={3}
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
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

export default PriorityChart;