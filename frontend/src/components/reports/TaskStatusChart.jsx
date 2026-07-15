import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#22c55e",
    "#ef4444",
];

const TaskStatusChart = ({ tasks }) => {

    const completed = tasks.filter(
        t => t.status === "Completed"
    ).length;

    const pending = tasks.length - completed;

    const data = [

        {
            name: "Completed",
            value: completed,
        },

        {
            name: "Pending",
            value: pending,
        },

    ];

    return (

        <div className="chart-card">

            <h3>Task Status</h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={100}
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

};

export default TaskStatusChart;