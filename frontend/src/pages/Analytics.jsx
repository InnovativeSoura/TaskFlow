import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/analytics/dashboard"
    );

    setData(res.data.analytics);
  };

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      <div>
        <p>Total Tasks: {data.totalTasks}</p>
        <p>Completed Tasks: {data.completedTasks}</p>
        <p>Pending Tasks: {data.pendingTasks}</p>
        <p>Overdue Tasks: {data.overdueTasks}</p>
        <p>Total Projects: {data.totalProjects}</p>
        <h3>Completion Rate: {data.completionRate}%</h3>
      </div>
    </div>
  );
}

export default Analytics;