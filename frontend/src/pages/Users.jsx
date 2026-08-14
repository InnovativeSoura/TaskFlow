// src/pages/Users.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaUserPlus,
  FaSearch,
  FaEllipsisV,
  FaSyncAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaFilter,
  FaTimes,
  FaEnvelope,
  FaPlus,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Users.css";

const API_URL = import.meta.env.VITE_API_URL || "";

/* =========================================================
   HELPERS
   ========================================================= */

const getUserName = (user) => {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    user?.displayName ||
    "Unknown User"
  );
};

const getUserEmail = (user) => {
  return user?.email || user?.emailAddress || "No email available";
};

const getUserRole = (user) => {
  const role = String(
    user?.role ||
      user?.userRole ||
      user?.accountType ||
      "Member"
  ).trim();

  if (!role) return "Member";

  if (role.toLowerCase() === "admin") return "Admin";
  if (role.toLowerCase() === "administrator") return "Admin";
  if (role.toLowerCase() === "manager") return "Manager";

  return "Team Member";
};

const getUserStatus = (user) => {
  const status = String(
    user?.status ||
      user?.accountStatus ||
      (user?.isActive === false ? "Inactive" : "Active")
  ).trim();

  if (status.toLowerCase() === "inactive") {
    return "Inactive";
  }

  return "Active";
};

const getUserId = (user) => {
  return user?._id || user?.id || user?.userId || "";
};

const getInitials = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) return "U";

  const words = cleanName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const formatJoinedDate = (user) => {
  const date =
    user?.createdAt ||
    user?.joinedAt ||
    user?.dateJoined ||
    user?.created_at;

  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);

  /* =======================================================
     FETCH USERS
     ======================================================= */

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(`${API_URL}/api/users`);

      const responseData = response?.data;

      const fetchedUsers =
        responseData?.users ||
        responseData?.data ||
        responseData ||
        [];

      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load workspace members."
      );

      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =======================================================
     STATISTICS
     ======================================================= */

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => getUserStatus(user) === "Active"
    ).length;

    const administrators = users.filter(
      (user) => getUserRole(user) === "Admin"
    ).length;

    const teamMembers = users.filter(
      (user) => getUserRole(user) !== "Admin"
    ).length;

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [users]);

  /* =======================================================
     FILTER OPTIONS
     ======================================================= */

  const availableRoles = useMemo(() => {
    const roles = new Set();

    users.forEach((user) => {
      roles.add(getUserRole(user));
    });

    return Array.from(roles).sort();
  }, [users]);

  /* =======================================================
     FILTERED USERS
     ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = getUserEmail(user).toLowerCase();
      const role = getUserRole(user);
      const status = getUserStatus(user);

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const matchesRole =
        roleFilter === "All" ||
        role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  /* =======================================================
     HERO AVATARS
     ======================================================= */

  const heroUsers = useMemo(() => {
    return users.slice(0, 4);
  }, [users]);

  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    roleFilter !== "All" ||
    statusFilter !== "All";

  /* =======================================================
     MENU
     ======================================================= */

  const toggleMenu = (userId) => {
    setOpenMenu((current) =>
      current === userId ? null : userId
    );
  };

  /* =======================================================
     INVITE
     ======================================================= */

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  /* =======================================================
     LOADING STATE
     ======================================================= */

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="app-content">
          <Navbar />

          <main className="users-page">
            <div className="users-main">
              <div className="users-loading">
                <div className="users-loading-spinner">
                  <FaSyncAlt />
                </div>

                <h3>Loading your team</h3>

                <p>
                  Fetching workspace members...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN RENDER
     ======================================================= */

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <Navbar />

        <main className="users-page">
          <div className="users-main">

            {/* =================================================
                HERO
               ================================================= */}

            <section className="users-hero">

              <div className="users-hero-content">

                <div className="users-eyebrow">
                  Workspace
                </div>

                <h1>
                  Team Members
                </h1>

                <p>
                  Manage and collaborate with everyone
                  in your TaskFlow workspace.
                </p>

                <button
                  type="button"
                  className="invite-member-btn"
                  onClick={handleInviteClick}
                >
                  <span className="invite-icon">
                    <FaUserPlus />
                  </span>

                  <span>
                    Invite Member
                  </span>

                  <span className="invite-arrow">
                    →
                  </span>
                </button>

              </div>

              {/* HERO MEMBER PREVIEW */}

              {heroUsers.length > 0 && (
                <div className="users-hero-members">

                  <div className="users-avatar-stack">

                    {heroUsers.map((user, index) => (
                      <div
                        className="avatar"
                        key={
                          getUserId(user) ||
                          `${getUserName(user)}-${index}`
                        }
                        title={getUserName(user)}
                      >
                        {getInitials(
                          getUserName(user)
                        )}
                      </div>
                    ))}

                  </div>

                  <div className="users-member-count">
                    <strong>
                      {users.length}{" "}
                      {users.length === 1
                        ? "member"
                        : "members"}
                    </strong>

                    <span>
                      working together
                    </span>
                  </div>

                </div>
              )}

            </section>

            {/* =================================================
                ERROR
               ================================================= */}

            {error && (
              <div className="users-error">
                <div>
                  <strong>
                    Unable to load members
                  </strong>

                  <span>
                    {error}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => fetchUsers()}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =================================================
                STATISTICS
               ================================================= */}

            <section className="users-stats-grid">

              {/* TOTAL */}

              <article className="users-stat-card">

                <div className="users-stat-icon">
                  <FaUsers />
                </div>

                <div className="users-stat-label">
                  Total Members
                </div>

                <div className="users-stat-value">
                  {statistics.total}
                </div>

                <div className="users-stat-description">
                  Workspace members
                </div>

              </article>

              {/* ACTIVE */}

              <article className="users-stat-card">

                <div
                  className="users-stat-icon"
                  style={{
                    color: "#29e998",
                    background:
                      "rgba(41, 233, 152, 0.08)",
                  }}
                >
                  <FaUserCheck />
                </div>

                <div className="users-stat-label">
                  Active Members
                </div>

                <div className="users-stat-value">
                  {statistics.active}
                </div>

                <div className="users-stat-description">
                  Currently active
                </div>

              </article>

              {/* ADMINS */}

              <article className="users-stat-card">

                <div
                  className="users-stat-icon"
                  style={{
                    color: "#b58aff",
                    background:
                      "rgba(181, 138, 255, 0.09)",
                  }}
                >
                  <FaUserShield />
                </div>

                <div className="users-stat-label">
                  Administrators
                </div>

                <div className="users-stat-value">
                  {statistics.administrators}
                </div>

                <div className="users-stat-description">
                  Workspace admins
                </div>

              </article>

              {/* TEAM */}

              <article className="users-stat-card">

                <div
                  className="users-stat-icon"
                  style={{
                    color: "#55a8ff",
                    background:
                      "rgba(85, 168, 255, 0.09)",
                  }}
                >
                  <FaUserFriends />
                </div>

                <div className="users-stat-label">
                  Team Members
                </div>

                <div className="users-stat-value">
                  {statistics.teamMembers}
                </div>

                <div className="users-stat-description">
                  Standard members
                </div>

              </article>

            </section>

            {/* =================================================
                TEAM HEADER
               ================================================= */}

            <section className="users-team-section">

              <div className="users-team-header">

                <div>

                  <div className="users-section-eyebrow">
                    Workspace Members
                  </div>

                  <h2>
                    Your Team
                  </h2>

                  <p>
                    View and manage everyone in your
                    TaskFlow workspace.
                  </p>

                </div>

                <div className="users-count-pill">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1
                    ? "member"
                    : "members"}
                </div>

              </div>

              {/* =================================================
                  TOOLBAR
                 ================================================= */}

              <div className="users-toolbar">

                <div className="users-search">

                  <FaSearch />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search members..."
                    aria-label="Search members"
                  />

                </div>

                <div className="users-filter">

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value)
                    }
                    aria-label="Filter by role"
                  >
                    <option value="All">
                      All Roles
                    </option>

                    {availableRoles.map((role) => (
                      <option
                        value={role}
                        key={role}
                      >
                        {role}
                      </option>
                    ))}

                  </select>

                </div>

                <div className="users-filter">

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    aria-label="Filter by status"
                  >
                    <option value="All">
                      All Status
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                <button
                  type="button"
                  className="users-refresh-btn"
                  onClick={() => fetchUsers(true)}
                  disabled={refreshing}
                  title="Refresh members"
                >
                  <FaSyncAlt
                    className={
                      refreshing
                        ? "is-spinning"
                        : ""
                    }
                  />
                </button>

              </div>

              {/* =================================================
                  ACTIVE FILTERS
                 ================================================= */}

              {hasActiveFilters && (
                <div className="users-active-filters">

                  <span>
                    <FaFilter />
                    Filters applied
                  </span>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear
                    <FaTimes />
                  </button>

                </div>
              )}

              {/* =================================================
                  MEMBERS
                 ================================================= */}

              {filteredUsers.length > 0 ? (
                <div className="users-members-grid">

                  {filteredUsers.map(
                    (user, index) => {
                      const userId =
                        getUserId(user) ||
                        `${index}`;

                      const name =
                        getUserName(user);

                      const email =
                        getUserEmail(user);

                      const role =
                        getUserRole(user);

                      const status =
                        getUserStatus(user);

                      const initials =
                        getInitials(name);

                      const isAdmin =
                        role === "Admin";

                      return (
                        <article
                          className="user-member-card"
                          key={userId}
                        >

                          {/* CARD TOP */}

                          <div className="user-card-top">

                            <span className="user-card-number">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <button
                              type="button"
                              className="user-card-menu"
                              onClick={() =>
                                toggleMenu(userId)
                              }
                              aria-label={`Options for ${name}`}
                            >
                              <FaEllipsisV />
                            </button>

                            {openMenu === userId && (
                              <div className="user-card-dropdown">

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenu(null)
                                  }
                                >
                                  View Member
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenu(null)
                                  }
                                >
                                  Send Email
                                </button>

                              </div>
                            )}

                          </div>

                          {/* AVATAR */}

                          <div className="user-avatar-wrapper">

                            <div className="user-avatar">

                              {initials}

                              <span
                                className="user-avatar-status"
                                style={{
                                  background:
                                    status ===
                                    "Active"
                                      ? "#20df8a"
                                      : "#64748b",
                                }}
                              />

                            </div>

                          </div>

                          {/* MEMBER INFO */}

                          <div className="user-member-info">

                            <div className="user-member-name">
                              {name}
                            </div>

                            <div className="user-member-email">
                              {email}
                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="user-member-details">

                            <div className="user-detail">

                              <span className="user-detail-label">
                                Role
                              </span>

                              <span
                                className={`user-role-badge ${
                                  isAdmin
                                    ? "admin"
                                    : ""
                                }`}
                              >
                                {isAdmin && (
                                  <FaUserShield />
                                )}

                                {!isAdmin && (
                                  <FaUsers />
                                )}

                                {role}
                              </span>

                            </div>

                            <div className="user-detail">

                              <span className="user-detail-label">
                                Status
                              </span>

                              <span className="user-status-badge">

                                <FaCheckCircle />

                                {status}

                              </span>

                            </div>

                            <div className="user-detail">

                              <span className="user-detail-label">
                                Joined
                              </span>

                              <span className="user-detail-value">

                                <FaCalendarAlt
                                  style={{
                                    marginRight:
                                      "5px",
                                  }}
                                />

                                {formatJoinedDate(
                                  user
                                )}

                              </span>

                            </div>

                            <div className="user-detail">

                              <span className="user-detail-label">
                                Contact
                              </span>

                              <span className="user-detail-value">

                                <FaEnvelope
                                  style={{
                                    marginRight:
                                      "5px",
                                  }}
                                />

                                Email

                              </span>

                            </div>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>
              ) : (
                <div className="users-empty-state">

                  <FaUsers
                    style={{
                      fontSize: "28px",
                      color: "#7760e8",
                    }}
                  />

                  <h3>
                    No members found
                  </h3>

                  <p>
                    {hasActiveFilters
                      ? "Try adjusting your search or filters."
                      : "Your workspace does not have any members yet."}
                  </p>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="invite-member-btn"
                      onClick={clearFilters}
                    >
                      <FaTimes />
                      Clear Filters
                    </button>
                  )}

                </div>
              )}

              {/* =================================================
                  FOOTER
                 ================================================= */}

              {filteredUsers.length > 0 && (
                <div className="users-footer">

                  <span className="users-secure-label">
                    <span className="users-secure-dot" />
                    Secure workspace members
                  </span>

                  <span>
                    {filteredUsers.length}{" "}
                    {filteredUsers.length === 1
                      ? "member"
                      : "members"}{" "}
                    displayed
                  </span>

                </div>
              )}

            </section>

          </div>
        </main>

      </div>

      {/* =====================================================
          INVITE MODAL
         ===================================================== */}

      {showInviteModal && (
        <div
          className="users-modal-overlay"
          onClick={closeInviteModal}
        >

          <div
            className="users-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="users-modal-close"
              onClick={closeInviteModal}
              aria-label="Close invite modal"
            >
              <FaTimes />
            </button>

            <div className="users-modal-icon">
              <FaUserPlus />
            </div>

            <div className="users-modal-eyebrow">
              Workspace
            </div>

            <h2>
              Invite a Member
            </h2>

            <p>
              Grow your workspace by inviting
              teammates to collaborate with you
              in TaskFlow.
            </p>

            <div className="users-modal-input-wrapper">

              <FaEnvelope />

              <input
                type="email"
                placeholder="teammate@example.com"
                autoFocus
              />

            </div>

            <button
              type="button"
              className="users-modal-primary"
              onClick={closeInviteModal}
            >
              <FaPlus />
              Send Invitation
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;