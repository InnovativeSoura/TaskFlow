import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await axios.get(
      `${API_URL}/api/notifications`
    );

    setNotifications(res.data.notifications);
  };

  const markRead = async (id) => {
    await axios.put(
      `${API_URL}/api/notifications/${id}/read`
    );

    loadNotifications();
  };

  return (
    <div>
      <h2>Notifications</h2>

      {notifications.map((n) => (
        <div key={n._id} style={{ marginBottom: "10px" }}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>

          {!n.isRead && (
            <button onClick={() => markRead(n._id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Notifications;