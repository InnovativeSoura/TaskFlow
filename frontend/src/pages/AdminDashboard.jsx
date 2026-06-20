import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function AdminDashboard() {
  const [stats,
    setStats] =
    useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats =
    async () => {
      const res =
        await axios.get(
          "http://localhost:5000/api/admin/stats"
        );

      setStats(
        res.data
      );
    };

  return (
    <div>
      <h1>
        Admin Dashboard
      </h1>

      <div>
        <h3>
          Users:
          {
            stats.users
          }
        </h3>

        <h3>
          Projects:
          {
            stats.projects
          }
        </h3>

        <h3>
          Tasks:
          {
            stats.tasks
          }
        </h3>
      </div>
    </div>
  );
}

export default AdminDashboard;