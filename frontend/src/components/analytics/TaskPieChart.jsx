import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const TaskPieChart = ({
  data = [],
}) => {

  const defaultData = [
    {
      name: "Completed",
      value: 0,
    },
    {
      name: "Pending",
      value: 0,
    },
    {
      name: "In Progress",
      value: 0,
    },
  ];


  const chartData =
    data.length
      ? data
      : defaultData;


  return (
    <div className="task-pie-chart">

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {chartData.map(
              (_, index) => (
                <Cell
                  key={index}
                />
              )
            )}

          </Pie>


          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};


export default TaskPieChart;