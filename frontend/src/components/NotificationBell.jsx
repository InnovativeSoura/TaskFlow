import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import "../styles/NotificationBell.css";

const NotificationBell = () => {
  const {
    notifications,
    markAsRead,
    deleteOne,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <div className="notification-wrapper">
      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p>No Notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={
                  notification.isRead
                    ? "notification-item"
                    : "notification-item unread"
                }
              >
                <p>{notification.message}</p>

                <small>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                    >
                      Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteOne(notification._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;