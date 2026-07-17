import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


const COLORS = [
  "#F59E0B",
  "#6366F1",
  "#10B981",
  "#EF4444",
];


const TaskStatusChart = ({
  tasks = [],
}) => {


  const data = [
    {
      name:"Pending",
      value:
        tasks.filter(
          task =>
          task.status === "Pending"
        ).length,
    },

    {
      name:"In Progress",
      value:
        tasks.filter(
          task =>
          task.status === "In Progress"
        ).length,
    },


    {
      name:"Completed",
      value:
        tasks.filter(
          task =>
          task.status === "Completed"
        ).length,
    },


    {
      name:"Review",
      value:
        tasks.filter(
          task =>
          task.status === "Review"
        ).length,
    },
  ]
  .filter(
    item => item.value > 0
  );


  if(!data.length){

    return (
      <div className="chart-empty">

        <h3>
          No Task Data
        </h3>

        <p>
          Create tasks to view status.
        </p>

      </div>
    );

  }


  return (

    <div className="task-status-chart">

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {
              data.map(
                (entry,index)=>(
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                )
              )
            }

          </Pie>


          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

};


export default TaskStatusChart;