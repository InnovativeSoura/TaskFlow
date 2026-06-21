import { useEffect, useState } from "react";
import axios from "axios";

function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/activities"
    );

    setActivities(res.data.activities);
  };

  return (
    <div>
      <h2>Activity Feed</h2>

      {activities.map((a) => (
        <div key={a._id}>
          <p>
            <b>{a.user?.name}</b> — {a.description}
          </p>
          <small>{new Date(a.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;