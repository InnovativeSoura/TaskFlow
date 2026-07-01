import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Notifications.css";

function Notifications() {

  const API_URL = import.meta.env.VITE_API_URL;

  //-------------------------------------
  // STATES
  //-------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [notifications, setNotifications] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  //-------------------------------------
  // FETCH NOTIFICATIONS
  //-------------------------------------

  const fetchNotifications = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/notifications`
      );

      setNotifications(
        res.data || []
      );

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  useEffect(() => {

    fetchNotifications();

  }, []);

  //-------------------------------------
  // MARK AS READ
  //-------------------------------------

  const markAsRead = async (id) => {

    try {

      await axios.patch(
        `${API_URL}/api/notifications/${id}`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );

    } catch (err) {

      console.error(err);

    }

  };

  //-------------------------------------
  // DELETE NOTIFICATION
  //-------------------------------------

  const deleteNotification = async (id) => {

    try {

      await axios.delete(
        `${API_URL}/api/notifications/${id}`
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (err) {

      console.error(err);

    }

  };

  //-------------------------------------
  // FILTER
  //-------------------------------------

  const filteredNotifications =
    notifications.filter((item) => {

      const searchMatch =
        item.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const filterMatch =
        filter === "All"
          ? true
          : filter === "Read"
          ? item.read
          : !item.read;

      return (
        searchMatch &&
        filterMatch
      );

    });

  //-------------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>
          Loading Notifications...
        </h2>

      </div>

    );

  }

  //-------------------------------------

  return (

    <div className="notification-page">

      <Sidebar />

      <div className="notification-main">

        <Navbar />

        <div className="notification-container">

          <div className="notification-header">

            <div>

              <h1>
                Notifications
              </h1>

              <p>

                Stay updated with
                project activities.

              </p>

            </div>

            <button
              className="refresh-btn"
              onClick={fetchNotifications}
            >

              Refresh

            </button>

          </div>

          <div className="notification-toolbar">

            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >

              <option>All</option>

              <option>Unread</option>

              <option>Read</option>

            </select>

          </div>
                    {/* ======================================
                NOTIFICATION SUMMARY
          ====================================== */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <h2>
                {notifications.length}
              </h2>

              <p>
                Total Notifications
              </p>

            </div>

            <div className="stat-card green">

              <h2>

                {
                  notifications.filter(
                    (item) => item.read
                  ).length
                }

              </h2>

              <p>
                Read
              </p>

            </div>

            <div className="stat-card orange">

              <h2>

                {
                  notifications.filter(
                    (item) => !item.read
                  ).length
                }

              </h2>

              <p>
                Unread
              </p>

            </div>

          </div>

          {/* ======================================
                NOTIFICATION LIST
          ====================================== */}

          <div className="notification-card">

            <div className="card-header">

              <h2>
                Notification History
              </h2>

            </div>

            {

              filteredNotifications.length === 0 ? (

                <div className="empty">

                  No notifications found.

                </div>

              ) : (

                filteredNotifications.map((item) => (

                  <div
                    key={item._id}
                    className={`notification-item ${
                      item.read
                        ? "read"
                        : "unread"
                    }`}
                  >

                    <div className="notification-content">

                      <h3>

                        {item.title}

                      </h3>

                      <p>

                        {item.message}

                      </p>

                      <small>

                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleString()
                          : "N/A"}

                      </small>

                    </div>

                    <div className="notification-right">

                      <span
                        className={`badge ${
                          item.read
                            ? "completed"
                            : "pending"
                        }`}
                      >

                        {item.read
                          ? "Read"
                          : "Unread"}

                      </span>

                      <div className="notification-actions">

                        {

                          !item.read && (

                            <button
                              className="read-btn"
                              onClick={() =>
                                markAsRead(
                                  item._id
                                )
                              }
                            >

                              Mark Read

                            </button>

                          )

                        }

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteNotification(
                              item._id
                            )
                          }
                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )

            }

          </div>
                    {/* ======================================
                  FOOTER ACTIONS
          ====================================== */}

          <div className="notification-footer">

            <button
              className="mark-all-btn"
              onClick={async () => {

                try {

                  await axios.patch(
                    `${API_URL}/api/notifications/read-all`
                  );

                  setNotifications((prev) =>
                    prev.map((item) => ({
                      ...item,
                      read: true,
                    }))
                  );

                } catch (err) {

                  console.error(err);

                }

              }}
            >

              Mark All as Read

            </button>

            <div className="notification-summary">

              <span>

                Total :
                {" "}
                {notifications.length}

              </span>

              <span>

                Read :
                {" "}
                {
                  notifications.filter(
                    (item) => item.read
                  ).length
                }

              </span>

              <span>

                Unread :
                {" "}
                {
                  notifications.filter(
                    (item) => !item.read
                  ).length
                }

              </span>

            </div>

          </div>

        </div>
        {/* notification-container */}

      </div>
      {/* notification-main */}

    </div>
    //notification-page

  );

}

export default Notifications;