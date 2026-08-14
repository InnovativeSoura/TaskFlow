import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaEllipsisV,
  FaCalendarAlt,
  FaUserPlus,
  FaCircle,
  FaCrown,
  FaTimes,
} from "react-icons/fa";

import "../styles/User.css";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "U";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const getDisplayName = (user) => {
  return (
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Unknown User"
  );
};

const getRole = (user) => {
  return user?.role || "Team Member";
};

const getStatus = (user) => {
  const status = String(user?.status || "Active").toLowerCase();

  if (
    status === "inactive" ||
    status === "disabled" ||
    status === "offline"
  ) {
    return "Inactive";
  }

  return "Active";
};

const formatJoinDate = (user) => {
  const date =
    user?.createdAt ||
    user?.joinedAt ||
    user?.dateJoined ||
    user?.created_at;

  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      const fetchedUsers =
        res.data?.users ||
        res.data?.data ||
        res.data ||
        [];

      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
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

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => getStatus(user) === "Active"
    ).length;

    const admins = users.filter(
      (user) =>
        String(getRole(user)).toLowerCase() === "admin" ||
        String(getRole(user)).toLowerCase() === "administrator"
    ).length;

    return {
      total,
      active,
      admins,
      invitations: 0,
    };
  }, [users]);

  const availableRoles = useMemo(() => {
    const roles = users
      .map((user) => getRole(user))
      .filter(Boolean)
      .map((role) => String(role));

    return ["All", ...new Set(roles)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const name = getDisplayName(user).toLowerCase();
      const email = String(user?.email || "").toLowerCase();
      const role = getRole(user).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query);

      const matchesRole =
        roleFilter === "All" ||
        role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}
        <div className="users-background" aria-hidden="true">
          <div className="users-grid-overlay" />
          <div className="users-glow users-glow-one" />
          <div className="users-glow users-glow-two" />
          <div className="users-glow users-glow-three" />
        </div>

        <div className="users-container">
          {/* =====================================================
              HERO
          ====================================================== */}
          <section className="users-hero">
            <div className="users-hero-glow" />

            <div className="users-hero-content">
              <div className="users-hero-copy">
                <div className="users-kicker">
                  <span className="users-kicker-line" />
                  <FaUsers />
                  <span>Team Management</span>
                </div>

                <h1>Users</h1>

                <p>
                  Manage your team members, roles, and workspace
                  access from one place.
                </p>
              </div>

              <div className="users-hero-visual">
                <div className="hero-user-orbit orbit-one" />
                <div className="hero-user-orbit orbit-two" />

                <div className="hero-user-icon">
                  <FaUsers />
                </div>
              </div>

              <button
                type="button"
                className="users-invite-btn"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("taskflow:invite-member")
                  )
                }
              >
                <FaUserPlus />
                <span>Invite Member</span>
              </button>
            </div>
          </section>

          {/* =====================================================
              STATISTICS
          ====================================================== */}
          <section className="users-stats">
            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-purple">
                <FaUsers />
              </div>

              <div className="users-stat-content">
                <span>Total Members</span>
                <strong>{statistics.total}</strong>
                <small>Workspace members</small>
              </div>
            </div>

            <div className="users-stat-divider" />

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-green">
                <FaUserCheck />
                <span className="stat-live-dot" />
              </div>

              <div className="users-stat-content">
                <span>Active Members</span>
                <strong>{statistics.active}</strong>
                <small>Currently active</small>
              </div>
            </div>

            <div className="users-stat-divider" />

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-indigo">
                <FaUserShield />
              </div>

              <div className="users-stat-content">
                <span>Admins</span>
                <strong>{statistics.admins}</strong>
                <small>Workspace administrators</small>
              </div>
            </div>

            <div className="users-stat-divider" />

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-orange">
                <FaEnvelope />
              </div>

              <div className="users-stat-content">
                <span>Invitations</span>
                <strong>{statistics.invitations}</strong>
                <small>Pending invitations</small>
              </div>
            </div>
          </section>

          {/* =====================================================
              TEAM HEADER
          ====================================================== */}
          <section className="users-members-section">
            <div className="users-members-header">
              <div className="users-members-title">
                <div className="section-kicker">
                  <span className="section-kicker-line" />
                  <span>Workspace</span>
                </div>

                <h2>Team Members</h2>

                <p>
                  View and manage everyone in your TaskFlow
                  workspace.
                </p>
              </div>

              <div className="users-controls">
                <div className="users-search">
                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="users-filter-wrapper">
                  <button
                    type="button"
                    className={`users-filter-btn ${
                      showFilters ? "active" : ""
                    }`}
                    onClick={() =>
                      setShowFilters((current) => !current)
                    }
                  >
                    <FaFilter />
                    <span>Filter</span>
                    <FaChevronDown />
                  </button>

                  {showFilters && (
                    <div className="users-filter-menu">
                      <div className="filter-menu-label">
                        Filter by role
                      </div>

                      {availableRoles.map((role) => (
                        <button
                          type="button"
                          key={role}
                          className={
                            roleFilter === role
                              ? "selected"
                              : ""
                          }
                          onClick={() => {
                            setRoleFilter(role);
                            setShowFilters(false);
                          }}
                        >
                          <span>{role}</span>

                          {roleFilter === role && (
                            <FaUserCheck />
                          )}
                        </button>
                      ))}

                      {(searchTerm ||
                        roleFilter !== "All") && (
                        <button
                          type="button"
                          className="filter-clear-btn"
                          onClick={() => {
                            clearFilters();
                            setShowFilters(false);
                          }}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                ACTIVE FILTER
            ================================================== */}
            {(searchTerm || roleFilter !== "All") && (
              <div className="users-filter-summary">
                <span>
                  Showing{" "}
                  <strong>{filteredUsers.length}</strong>{" "}
                  of <strong>{users.length}</strong> members
                </span>

                {roleFilter !== "All" && (
                  <button
                    type="button"
                    onClick={() => setRoleFilter("All")}
                  >
                    Role: {roleFilter}
                    <FaTimes />
                  </button>
                )}

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    Search: {searchTerm}
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            {/* =================================================
                USERS GRID
            ================================================== */}
            {filteredUsers.length === 0 ? (
              <div className="users-empty">
                <div className="users-empty-icon">
                  <FaUsers />
                </div>

                <h3>
                  {users.length === 0
                    ? "No Members Found"
                    : "No Matching Members"}
                </h3>

                <p>
                  {users.length === 0
                    ? "Your workspace does not have any members yet."
                    : "Try changing your search or filter criteria."}
                </p>

                {users.length > 0 && (
                  <button
                    type="button"
                    className="users-empty-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="users-grid">
                {filteredUsers.map((user, index) => {
                  const name = getDisplayName(user);
                  const role = getRole(user);
                  const status = getStatus(user);
                  const joinDate = formatJoinDate(user);

                  const isAdmin =
                    String(role).toLowerCase() === "admin" ||
                    String(role).toLowerCase() ===
                      "administrator";

                  return (
                    <article
                      className={`user-card ${
                        isAdmin ? "admin-card" : ""
                      }`}
                      key={user?._id || user?.id || index}
                    >
                      <div className="user-card-top">
                        <span className="user-card-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <button
                          type="button"
                          className="user-card-menu"
                          aria-label={`Options for ${name}`}
                        >
                          <FaEllipsisV />
                        </button>
                      </div>

                      <div className="user-avatar-wrapper">
                        <div
                          className={`avatar ${
                            isAdmin ? "admin-avatar" : ""
                          }`}
                        >
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={name}
                            />
                          ) : (
                            getInitials(name)
                          )}
                        </div>

                        <span
                          className={`avatar-status ${
                            status === "Active"
                              ? "online"
                              : "offline"
                          }`}
                        />
                      </div>

                      <div className="user-card-info">
                        <h3>{name}</h3>

                        <p className="user-email">
                          {user?.email || "No email available"}
                        </p>
                      </div>

                      <div className="user-card-divider" />

                      <div className="user-card-details">
                        <div className="user-role-row">
                          <span className="detail-label">
                            Role
                          </span>

                          <span
                            className={`role ${
                              isAdmin ? "admin-role" : ""
                            }`}
                          >
                            {isAdmin && <FaCrown />}
                            {role}
                          </span>
                        </div>

                        <div className="user-status-row">
                          <span className="detail-label">
                            Status
                          </span>

                          <span
                            className={`user-status ${
                              status === "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <FaCircle />
                            {status}
                          </span>
                        </div>

                        {joinDate && (
                          <div className="user-date-row">
                            <span className="detail-label">
                              Joined
                            </span>

                            <span className="join-date">
                              <FaCalendarAlt />
                              {joinDate}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="user-card-glow" />
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <footer className="users-footer">
            <div className="users-footer-left">
              <span className="footer-status-dot" />
              <span>Secure workspace members</span>
            </div>

            <span>
              {filteredUsers.length} member
              {filteredUsers.length !== 1 ? "s" : ""} displayed
            </span>
          </footer>
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;