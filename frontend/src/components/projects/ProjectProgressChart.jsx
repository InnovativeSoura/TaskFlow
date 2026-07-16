import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function ProjectProgressChart({
  projects = [],
}) {
  const data = projects.map((project) => ({
    name:
      project.title?.length > 18
        ? `${project.title.substring(0, 18)}...`
        : project.title,
    progress: project.progress || 0,
    fullName: project.title,
  }));

  if (!data.length) {
    return (
      <div className="chart-empty">
        <h3>No Project Data</h3>

        <p>
          Create projects to visualize
          their progress.
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
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
          />

          <XAxis
            dataKey="name"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              "Progress",
            ]}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload
                ?.fullName || label
            }
          />

          <Bar
            dataKey="progress"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.fullName}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProjectProgressChart;