import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      setUsers(
        res.data.users ||
          res.data.data ||
          res.data ||
          []
      );
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase() || "U";
  };

  const getRoleClass = (role = "") => {
    return role.toLowerCase() === "admin"
      ? "user-role admin-role"
      : "user-role";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* PAGE HEADER */}
        <div className="users-header">

          <div className="users-header-content">

            <div className="users-eyebrow">
              <span className="eyebrow-line" />
              WORKSPACE
            </div>

            <h1 className="users-title">
              Team Members
            </h1>

            <p className="users-subtitle">
              Manage and view everyone in your TaskFlow workspace.
            </p>

          </div>

          <button
            type="button"
            className="invite-member-btn"
          >
            <span className="invite-icon">+</span>
            Invite Member
          </button>

        </div>

        {/* MEMBER COUNT */}
        {users.length > 0 && (
          <div className="users-summary">
            <div className="summary-icon">
              👥
            </div>

            <div className="summary-content">
              <span className="summary-label">
                Workspace Members
              </span>

              <strong className="summary-value">
                {users.length}
              </strong>
            </div>
          </div>
        )}

        {/* USERS */}
        {users.length === 0 ? (
          <div className="users-empty">
            <EmptyState title="No Members Found" />
          </div>
        ) : (
          <div className="users-grid">

            {users.map((user, index) => {

              const isActive =
                user.status?.toLowerCase() === "active";

              return (
                <article
                  className="user-card"
                  key={user._id || user.id || index}
                >

                  {/* CARD TOP */}
                  <div className="user-card-top">

                    <span className="member-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      className="user-menu-btn"
                      aria-label="User options"
                    >
                      ⋮
                    </button>

                  </div>

                  {/* AVATAR */}
                  <div className="user-avatar-wrapper">

                    <div className="user-avatar">

                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || "User"}
                        />
                      ) : (
                        <span>
                          {getInitials(user.name)}
                        </span>
                      )}

                    </div>

                    <span
                      className={`online-indicator ${
                        isActive ? "online" : "offline"
                      }`}
                    />
                  </div>

                  {/* USER INFO */}
                  <div className="user-info">

                    <h2 className="user-name">
                      {user.name || "Unknown User"}
                    </h2>

                    <p className="user-email">
                      {user.email || "No email available"}
                    </p>

                  </div>

                  {/* DETAILS */}
                  <div className="user-details">

                    <div className="user-detail-row">

                      <span className="detail-label">
                        ROLE
                      </span>

                      <span className={getRoleClass(user.role)}>
                        {user.role || "Team Member"}
                      </span>

                    </div>

                    <div className="user-detail-row">

                      <span className="detail-label">
                        STATUS
                      </span>

                      <span
                        className={`user-status ${
                          isActive ? "status-active" : "status-inactive"
                        }`}
                      >
                        <span className="status-dot" />
                        {user.status || "Inactive"}
                      </span>

                    </div>

                    <div className="user-detail-row">

                      <span className="detail-label">
                        MEMBER
                      </span>

                      <span className="member-type">
                        Workspace Member
                      </span>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* FOOTER */}
        {users.length > 0 && (
          <div className="users-footer">

            <div className="secure-members">
              <span className="secure-dot" />
              Secure workspace members
            </div>

            <span className="members-count">
              {users.length}{" "}
              {users.length === 1 ? "member" : "members"} displayed
            </span>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Users;