import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProjectProgressChart = ({ projects }) => {
  const data = projects.map((project) => ({
    name:
      project.title ||
      project.name ||
      "Project",

    progress:
      project.progress ||
      0,
  }));

  return (
    <div className="chart-card">

      <h3>Project Progress</h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="progress"
            fill="#3b82f6"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ProjectProgressChart;