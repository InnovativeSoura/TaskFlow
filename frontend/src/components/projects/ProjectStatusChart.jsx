import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function ProjectStatusChart({
  projects = [],
}) {
  const statusCount = {};

  projects.forEach((project) => {
    const status =
      project.status || "Planning";

    statusCount[status] =
      (statusCount[status] || 0) + 1;
  });

  const data = Object.keys(statusCount).map(
    (status) => ({
      name: status,
      value: statusCount[status],
    })
  );

  if (!data.length) {
    return (
      <div className="chart-empty">
        <h3>No Project Data</h3>

        <p>
          Create projects to see the
          status distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="project-chart">
      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            innerRadius={60}
            paddingAngle={4}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
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
}

export default ProjectStatusChart;