import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


const DashboardOverviewChart = ({
  projects = [],
}) => {

  const data = projects.map((project) => ({
    name:
      project.title?.substring(0, 12) ||
      "Project",

    progress:
      project.progress || 0,
  }));


  if (!data.length) {
    return (
      <div className="chart-empty">
        <h3>No Project Data</h3>

        <p>
          Create projects to view progress.
        </p>
      </div>
    );
  }


  return (
    <div className="dashboard-chart">

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <AreaChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
          />

          <XAxis
            dataKey="name"
          />

          <YAxis
            domain={[0,100]}
            tickFormatter={
              value => `${value}%`
            }
          />


          <Tooltip
            formatter={
              value => [
                `${value}%`,
                "Progress"
              ]
            }
          />


          <Area
            type="monotone"
            dataKey="progress"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.25}
          />


        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
};


export default DashboardOverviewChart;