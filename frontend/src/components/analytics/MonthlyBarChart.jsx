import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
 CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useMemo } from "react";
import { useTasks } from "../../context/TaskContext";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlyBarChart = () => {
  const { tasks } = useTasks();

  const chartData = useMemo(() => {
    const monthly = MONTHS.map((month) => ({
      month,
      Created: 0,
      Completed: 0,
    }));

    tasks.forEach((task) => {
      if (task.createdAt) {
        const month = new Date(task.createdAt).getMonth();
        monthly[month].Created += 1;
      }

      if (
        (task.status === "Completed" ||
          task.status === "Done") &&
        task.updatedAt
      ) {
        const month = new Date(task.updatedAt).getMonth();
        monthly[month].Completed += 1;
      }
    });

    return monthly;
  }, [tasks]);

  return (
    <div
      style={{
        width: "100%",
        height: 350,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>

          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
          />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="Created"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          />

          <Bar
            dataKey="Completed"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
            animationDuration={1200}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;