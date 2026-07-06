import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProjectProgressChart({
  projects,
}) {
  const data =
    projects.map(
      (project) => ({
        name:
          project.title,
        progress:
          project.progress ||
          0,
      })
    );

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis
          dataKey="name"
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="progress"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProjectProgressChart;