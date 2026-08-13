import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNotifications } from "../context/NotificationContext";

import Loader from "../components/Loader";

import {
  FaBell,
  FaSyncAlt,
  FaCheck,
  FaTrashAlt,
  FaInbox,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaCircle,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import "../styles/Notifications.css";

const Notifications = () => {
  const {
    notifications = [],
    loading,
    fetchNotifications,
    markAsRead,
    deleteOne,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const readCount = useMemo(
    () => notifications.filter((item) => item.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filter === "unread") {
      result = result.filter((item) => !item.isRead);
    }

    if (filter === "read") {
      result = result.filter((item) => item.isRead);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((item) => {
        return (
          item.title?.toLowerCase().includes(query) ||
          item.message?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [notifications, filter, search]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchNotifications();
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "Recently";
    }

    return notificationDate.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="tf-notifications-page">

        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div className="tf-notifications-background">
          <div className="tf-notifications-orb tf-notifications-orb-1" />
          <div className="tf-notifications-orb tf-notifications-orb-2" />
          <div className="tf-notifications-grid" />
          <div className="tf-notifications-glow" />
        </div>

        {/* =====================================================
            MAIN CONTAINER
        ====================================================== */}

        <main className="tf-notifications-container">

          {/* ===================================================
              HEADER
          ==================================================== */}

          <section className="tf-notifications-header">

            <div className="tf-notifications-header-left">

              <div className="tf-notifications-header-icon">
                <FaBell />

                <span />
              </div>

              <div>
                <div className="tf-notifications-kicker">
                  <span>WORKSPACE</span>
                  <strong>/</strong>
                  <span>NOTIFICATIONS</span>
                </div>

                <h1>Notifications</h1>

                <p>
                  Stay updated with the latest activity, tasks and
                  workspace events.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="tf-notifications-refresh"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSyncAlt
                className={
                  refreshing ? "tf-refresh-spinning" : ""
                }
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </section>

          {/* ===================================================
              TOOLBAR
          ==================================================== */}

          <section className="tf-notifications-toolbar">

            <div className="tf-notification-toolbar-left">

              <div className="tf-notification-filters">

                <button
                  type="button"
                  className={`tf-notification-filter ${
                    filter === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  <FaInbox />

                  <span>All</span>

                  <b>{notifications.length}</b>
                </button>

                <button
                  type="button"
                  className={`tf-notification-filter ${
                    filter === "unread" ? "active" : ""
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  <FaBell />

                  <span>Unread</span>

                  <b>{unreadCount}</b>
                </button>

                <button
                  type="button"
                  className={`tf-notification-filter ${
                    filter === "read" ? "active" : ""
                  }`}
                  onClick={() => setFilter("read")}
                >
                  <FaCheckCircle />

                  <span>Read</span>

                  <b>{readCount}</b>
                </button>

              </div>

            </div>

            <div className="tf-notification-toolbar-right">

              <div className="tf-notification-search">
                <FaBell />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                />
              </div>

            </div>

          </section>

          {/* ===================================================
              CONTENT
          ==================================================== */}

          <section className="tf-notifications-content">

            {filteredNotifications.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================== */

              <div className="tf-notifications-empty">

                <span className="tf-empty-particle particle-1" />
                <span className="tf-empty-particle particle-2" />
                <span className="tf-empty-particle particle-3" />
                <span className="tf-empty-particle particle-4" />
                <span className="tf-empty-particle particle-5" />
                <span className="tf-empty-particle particle-6" />

                <div className="tf-empty-illustration">

                  <div className="tf-empty-rings ring-1" />
                  <div className="tf-empty-rings ring-2" />
                  <div className="tf-empty-rings ring-3" />

                  <div className="tf-empty-platform" />

                  <div className="tf-empty-bell">
                    <FaBell />
                  </div>

                  <div className="tf-empty-bell-shadow" />

                  <span className="tf-empty-spark spark-1">
                    ✦
                  </span>

                  <span className="tf-empty-spark spark-2">
                    ✦
                  </span>

                  <span className="tf-empty-spark spark-3">
                    ✧
                  </span>

                  <div className="tf-empty-paper">
                    <FaInbox />
                  </div>

                </div>

                <div className="tf-empty-copy">

                  <span className="tf-empty-eyebrow">
                    {search
                      ? "NO MATCHES FOUND"
                      : filter === "unread"
                      ? "ALL CAUGHT UP"
                      : filter === "read"
                      ? "NO READ NOTIFICATIONS"
                      : "INBOX CLEAR"}
                  </span>

                  <h2>
                    {search
                      ? "No matching notifications"
                      : filter === "unread"
                      ? "You're all caught up"
                      : filter === "read"
                      ? "No read notifications"
                      : "No notifications yet"}
                  </h2>

                  <p>
                    {search
                      ? "Try searching with a different keyword."
                      : filter === "unread"
                      ? "There are no unread notifications waiting for you."
                      : filter === "read"
                      ? "Notifications you have already viewed will appear here."
                      : "When something important happens in your workspace, it will appear here."}
                  </p>

                </div>

              </div>

            ) : (

              /* =================================================
                 NOTIFICATION LIST
              ================================================== */

              <div className="tf-notifications-list">

                {filteredNotifications.map((item) => (

                  <article
                    key={item._id}
                    className={`tf-notification-card ${
                      item.isRead ? "read" : "unread"
                    }`}
                  >

                    <div className="tf-notification-card-icon">
                      {item.isRead ? (
                        <FaCheckCircle />
                      ) : (
                        <FaBell />
                      )}
                    </div>

                    <div className="tf-notification-card-content">

                      <div className="tf-notification-card-top">

                        <strong>
                          {item.title || "Notification"}
                        </strong>

                        {!item.isRead && (
                          <span className="tf-unread-dot" />
                        )}

                      </div>

                      <p>
                        {item.message || "You have a new notification."}
                      </p>

                      <div className="tf-notification-card-meta">

                        <span>
                          <FaClock />
                          {formatDate(item.createdAt)}
                        </span>

                        <span>
                          <FaCircle />
                          {item.isRead ? "Read" : "Unread"}
                        </span>

                      </div>

                    </div>

                    <div className="tf-notification-actions">

                      {!item.isRead && (
                        <button
                          type="button"
                          className="tf-notification-read-btn"
                          onClick={() =>
                            handleMarkRead(item._id)
                          }
                          title="Mark as read"
                        >
                          <FaCheck />
                          <span>Mark Read</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="tf-notification-delete-btn"
                        onClick={() =>
                          deleteOne(item._id)
                        }
                        title="Delete notification"
                      >
                        <FaTrashAlt />
                        <span>Delete</span>
                      </button>

                      <FaArrowRight className="tf-notification-arrow" />

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

          {/* ===================================================
              PREFERENCE CARD
          ==================================================== */}

          <section className="tf-notification-preferences">

            <div className="tf-preference-left">

              <div className="tf-preference-icon">
                <FaBell />
              </div>

              <div className="tf-preference-copy">

                <span>NOTIFICATION CENTER</span>

                <h3>
                  Stay informed without the noise
                </h3>

                <p>
                  Your notifications are automatically organized
                  so important workspace activity stays easy to find.
                </p>

              </div>

            </div>

            <div className="tf-preference-status">
              <FaCheckCircle />
              <span>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </span>
            </div>

          </section>

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <footer className="tf-notifications-footer">

            <div className="tf-notifications-footer-icon">
              <FaShieldAlt />
            </div>

            <div>

              <strong>
                Your notifications are private
              </strong>

              <span>
                TaskFlow keeps your workspace activity secure
                and visible only to authorized users.
              </span>

            </div>

            <div className="tf-notifications-secure">
              <FaShieldAlt />
              Secure
            </div>

          </footer>

        </main>
      </div>
    </MainLayout>
  );
};

export default Notifications;