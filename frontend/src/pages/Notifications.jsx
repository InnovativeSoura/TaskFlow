import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNotifications } from "../context/NotificationContext";

import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import "../styles/Notifications.css";

const Notifications = () => {

  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    deleteOne,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>

      <div className="notifications-page">

        <div className="page-header">

          <h1>Notifications</h1>

          <button
            className="refresh-btn"
            onClick={fetchNotifications}
          >
            Refresh
          </button>

        </div>

        {notifications.length === 0 ? (

          <EmptyState title="No Notifications" />

        ) : (

          <div className="notification-list">

            {notifications.map((item) => (

              <div
                key={item._id}
                className={`notification-card ${
                  item.isRead ? "read" : "unread"
                }`}
              >

                <div className="notification-left">

                  <div className="notification-icon">

                    🔔

                  </div>

                  <div>

                    <h3>{item.title}</h3>

                    <p>{item.message}</p>

                    <small>

                      {new Date(
                        item.createdAt
                      ).toLocaleString()}

                    </small>

                  </div>

                </div>

                <div className="notification-actions">

                  {!item.isRead && (

                    <button
                      className="read-btn"
                      onClick={() =>
                        markAsRead(item._id)
                      }
                    >
                      Mark Read
                    </button>

                  )}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteOne(item._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </MainLayout>
  );
};

export default Notifications;