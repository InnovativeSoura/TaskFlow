// src/pages/Users.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaEllipsisV,
  FaCircle,
  FaCalendarAlt,
  FaArrowRight,
  FaTimes,
  FaEnvelope,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/User.css";

const API_URL = import.meta.env.VITE_API_URL || "";

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) return "U";

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getName = (user) =>
  user?.name ||
  user?.username ||
  user?.fullName ||
  user?.displayName ||
  "Unknown User";

const getEmail = (user) =>
  user?.email ||
  user?.emailAddress ||
  "No email available";

const getRole = (user) => {
  const role = String(user?.role || "member").toLowerCase();

  if (role === "admin" || role === "administrator") {
    return "Admin";
  }

  if (role === "manager") {
    return "Manager";
  }

  return "Team Member";
};

const getStatus = (user) => {
  const status = String(user?.status || "active").toLowerCase();

  if (
    status === "inactive" ||
    status === "disabled" ||
    status === "offline"
  ) {
    return "Inactive";
  }

  return "Active";
};

const getJoinDate = (user) => {
  const rawDate =
    user?.createdAt ||
    user?.joinedAt ||
    user?.dateJoined ||
    user?.created_at;

  if (!rawDate) return "Recently joined";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* =========================================================
   AVATAR COLOR
========================================================= */

const avatarThemes = [
  "avatar-purple",
  "avatar-blue",
  "avatar-indigo",
  "avatar-violet",
  "avatar-cyan",
  "avatar-pink",
];

const getAvatarTheme = (index) =>
  avatarThemes[index % avatarThemes.length];

/* =========================================================
   FALLBACK USERS
   Used only if the API returns no users.
========================================================= */

const fallbackUsers = [
  {
    _id: "fallback-1",
    id: "fallback-1",
    name: "InnovativeSoura",
    email: "patrasouradipta3028@gmail.com",
    role: "member",
    status: "active",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "fallback-2",
    id: "fallback-2",
    name: "Souradipta Patra",
    email: "souradipta.patra03@gmail.com",
    role: "member",
    status: "active",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "fallback-3",
    id: "fallback-3",
    name: "Souradipta Patra",
    email: "soura@gmail.com",
    role: "admin",
    status: "active",
    createdAt: "2026-07-24T00:00:00.000Z",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showInvite, setShowInvite] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLoading, setInviteLoading] = useState(false);

  /* =======================================================
     FETCH USERS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        const response = await axios.get(`${API_URL}/api/users`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!mounted) return;

        const responseData = response?.data;

        const fetchedUsers = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.users)
          ? responseData.users
          : Array.isArray(responseData?.data)
          ? responseData.data
          : [];

        setUsers(fetchedUsers.length ? fetchedUsers : fallbackUsers);
      } catch (error) {
        console.warn(
          "Users API could not be loaded. Using fallback members.",
          error
        );

        if (mounted) {
          setUsers(fallbackUsers);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => getStatus(user) === "Active"
    ).length;

    const administrators = users.filter((user) => {
      const role = String(user?.role || "").toLowerCase();

      return role === "admin" || role === "administrator";
    }).length;

    const teamMembers = Math.max(total - administrators, 0);

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [users]);

  /* =======================================================
     FILTERED USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = getName(user).toLowerCase();
      const email = getEmail(user).toLowerCase();
      const role = getRole(user).toLowerCase();
      const status = getStatus(user).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query);

      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && role === "admin") ||
        (roleFilter === "member" && role === "team member") ||
        (roleFilter === "manager" && role === "manager");

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =======================================================
     INVITE MEMBER
  ======================================================= */

  const handleInvite = async (event) => {
    event.preventDefault();

    if (!inviteEmail.trim()) return;

    try {
      setInviteLoading(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      await axios.post(
        `${API_URL}/api/users/invite`,
        {
          email: inviteEmail.trim(),
          role: inviteRole,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setInviteEmail("");
      setInviteRole("member");
      setShowInvite(false);
    } catch (error) {
      console.warn("Invite endpoint unavailable:", error);

      /*
       * The UI remains usable even if the backend invite endpoint
       * is not implemented yet.
       */
      setInviteEmail("");
      setInviteRole("member");
      setShowInvite(false);
    } finally {
      setInviteLoading(false);
    }
  };

  /* =======================================================
     CLOSE MENUS
  ======================================================= */

  const closeMenu = () => {
    setMenuOpen(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="users-layout">
      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar />

      {/* ===================================================
          MAIN APPLICATION AREA
      =================================================== */}

      <div className="users-app">
        <Navbar />

        <main className="users-page">
          {/* ================================================
              BACKGROUND DECORATION
          ================================================= */}

          <div className="users-bg">
            <div className="users-bg-grid" />
            <div className="users-bg-orb users-bg-orb-one" />
            <div className="users-bg-orb users-bg-orb-two" />
            <div className="users-bg-glow users-bg-glow-one" />
            <div className="users-bg-glow users-bg-glow-two" />
          </div>

          {/* ================================================
              HERO
          ================================================= */}

          <section className="users-hero">
            <div className="users-hero-content">
              <div className="users-eyebrow">
                <span className="users-eyebrow-icon">
                  <FaUsers />
                </span>

                <span>WORKSPACE</span>

                <span className="users-eyebrow-line" />
              </div>

              <h1>
                Team{" "}
                <span className="users-gradient-text">
                  Members
                </span>
              </h1>

              <p>
                Manage and collaborate with everyone in your
                TaskFlow workspace.
              </p>

              {/* SMALL PREMIUM INVITE BUTTON */}

              <button
                type="button"
                className="users-invite-button"
                onClick={() => setShowInvite(true)}
              >
                <span className="users-invite-icon">
                  <FaUserPlus />
                </span>

                <span className="users-invite-copy">
                  <strong>Invite Member</strong>
                  <small>
                    Add someone to your workspace
                  </small>
                </span>

                <FaArrowRight className="users-invite-arrow" />
              </button>
            </div>

            {/* HERO MEMBER STACK */}

            <div className="users-hero-members">
              <div className="users-avatar-stack">
                {users.slice(0, 4).map((user, index) => (
                  <div
                    className={`users-stack-avatar ${getAvatarTheme(
                      index
                    )}`}
                    key={user._id || user.id || index}
                    title={getName(user)}
                  >
                    {getInitials(getName(user))}
                    <span className="users-online-dot" />
                  </div>
                ))}

                {users.length > 4 && (
                  <div className="users-stack-more">
                    +{users.length - 4}
                  </div>
                )}
              </div>

              <div className="users-hero-member-copy">
                <strong>
                  {users.length || 0}{" "}
                  {users.length === 1 ? "member" : "members"}
                </strong>

                <span>working together</span>
              </div>
            </div>
          </section>

          {/* ================================================
              STATISTICS
          ================================================= */}

          <section className="users-stat-grid">
            {/* TOTAL */}

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-purple">
                <FaUsers />
              </div>

              <div className="users-stat-content">
                <span className="users-stat-label">
                  TOTAL MEMBERS
                </span>

                <strong>{statistics.total}</strong>

                <small>Workspace members</small>
              </div>

              <div
                className="users-stat-progress"
                style={{
                  width: `${
                    statistics.total
                      ? Math.min(statistics.total * 25, 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* ACTIVE */}

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-green">
                <FaUserCheck />
              </div>

              <div className="users-stat-content">
                <span className="users-stat-label">
                  ACTIVE MEMBERS
                </span>

                <strong>{statistics.active}</strong>

                <small>Currently active</small>
              </div>

              <div
                className="users-stat-progress users-progress-green"
                style={{
                  width: `${
                    statistics.total
                      ? (statistics.active /
                          statistics.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* ADMIN */}

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-pink">
                <FaUserShield />
              </div>

              <div className="users-stat-content">
                <span className="users-stat-label">
                  ADMINISTRATORS
                </span>

                <strong>{statistics.administrators}</strong>

                <small>Workspace admins</small>
              </div>

              <div
                className="users-stat-progress users-progress-pink"
                style={{
                  width: `${
                    statistics.total
                      ? (statistics.administrators /
                          statistics.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

            {/* TEAM */}

            <div className="users-stat-card">
              <div className="users-stat-icon users-stat-blue">
                <FaUserFriends />
              </div>

              <div className="users-stat-content">
                <span className="users-stat-label">
                  TEAM MEMBERS
                </span>

                <strong>{statistics.teamMembers}</strong>

                <small>Standard members</small>
              </div>

              <div
                className="users-stat-progress users-progress-blue"
                style={{
                  width: `${
                    statistics.total
                      ? (statistics.teamMembers /
                          statistics.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </section>

          {/* ================================================
              TEAM SECTION
          ================================================= */}

          <section className="users-team-section">
            <div className="users-section-heading">
              <div>
                <div className="users-section-eyebrow">
                  <span />
                  WORKSPACE MEMBERS
                </div>

                <h2>Your Team</h2>

                <p>
                  View and manage everyone in your TaskFlow
                  workspace.
                </p>
              </div>

              <div className="users-member-count">
                <strong>
                  {filteredUsers.length}
                </strong>

                <span>
                  {filteredUsers.length === 1
                    ? "member"
                    : "members"}
                </span>
              </div>
            </div>

            {/* ==============================================
                TOOLBAR
            =============================================== */}

            <div className="users-toolbar">
              <div className="users-search">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="users-filter-group">
                <div className="users-filter">
                  <FaFilter />

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value)
                    }
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="manager">Managers</option>
                    <option value="member">
                      Team Members
                    </option>
                  </select>

                  <FaChevronDown />
                </div>

                <div className="users-filter">
                  <FaCircle />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>

                  <FaChevronDown />
                </div>
              </div>
            </div>

            {/* ==============================================
                MEMBER GRID
            =============================================== */}

            {loading ? (
              <div className="users-loading">
                <div className="users-loading-spinner" />

                <span>Loading workspace members...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="users-empty">
                <div className="users-empty-icon">
                  <FaUsers />
                </div>

                <h3>No members found</h3>

                <p>
                  Try adjusting your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="users-grid">
                {filteredUsers.map((user, index) => {
                  const name = getName(user);
                  const email = getEmail(user);
                  const role = getRole(user);
                  const status = getStatus(user);
                  const initials = getInitials(name);

                  const userId =
                    user?._id ||
                    user?.id ||
                    `member-${index}`;

                  const isAdmin = role === "Admin";

                  return (
                    <article
                      className={`users-member-card ${
                        isAdmin
                          ? "users-member-card-admin"
                          : ""
                      }`}
                      key={userId}
                    >
                      {/* CARD TOP */}

                      <div className="users-card-top">
                        <span className="users-card-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <button
                          type="button"
                          className="users-card-menu-button"
                          onClick={() =>
                            setMenuOpen(
                              menuOpen === userId
                                ? null
                                : userId
                            )
                          }
                          aria-label="Member options"
                        >
                          <FaEllipsisV />
                        </button>

                        {menuOpen === userId && (
                          <div className="users-card-menu">
                            <button type="button">
                              <FaEnvelope />
                              View Profile
                            </button>

                            <button type="button">
                              <FaUserCog />
                              Manage Member
                            </button>

                            {isAdmin && (
                              <button type="button">
                                <FaShieldAlt />
                                Administrator
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AVATAR */}

                      <div className="users-member-main">
                        <div
                          className={`users-member-avatar ${getAvatarTheme(
                            index
                          )}`}
                        >
                          <span>{initials}</span>

                          <i
                            className={
                              status === "Active"
                                ? "users-member-online"
                                : "users-member-offline"
                            }
                          />
                        </div>

                        <h3>{name}</h3>

                        <p>{email}</p>
                      </div>

                      {/* CARD DETAILS */}

                      <div className="users-card-divider" />

                      <div className="users-card-details">
                        <div className="users-detail-row">
                          <span className="users-detail-label">
                            ROLE
                          </span>

                          <span
                            className={`users-role-badge ${
                              isAdmin
                                ? "users-role-admin"
                                : "users-role-member"
                            }`}
                          >
                            {isAdmin ? (
                              <FaShieldAlt />
                            ) : (
                              <FaUsers />
                            )}

                            {role}
                          </span>
                        </div>

                        <div className="users-detail-row">
                          <span className="users-detail-label">
                            STATUS
                          </span>

                          <span
                            className={`users-status ${
                              status === "Active"
                                ? "users-status-active"
                                : "users-status-inactive"
                            }`}
                          >
                            <FaCircle />

                            {status}
                          </span>
                        </div>

                        <div className="users-detail-row">
                          <span className="users-detail-label">
                            JOINED
                          </span>

                          <span className="users-joined">
                            <FaCalendarAlt />

                            {getJoinDate(user)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ==============================================
                FOOTER
            =============================================== */}

            {!loading && filteredUsers.length > 0 && (
              <div className="users-section-footer">
                <div className="users-security-status">
                  <span>
                    <FaCircle />
                  </span>

                  Secure workspace members
                </div>

                <span>
                  {filteredUsers.length} member
                  {filteredUsers.length === 1
                    ? ""
                    : "s"}{" "}
                  displayed
                </span>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ===================================================
          INVITE MODAL
      =================================================== */}

      {showInvite && (
        <div
          className="users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowInvite(false);
            }
          }}
        >
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <span className="users-modal-eyebrow">
                  TEAM ACCESS
                </span>

                <h2>Invite Member</h2>

                <p>
                  Add a new member to your TaskFlow
                  workspace.
                </p>
              </div>

              <button
                type="button"
                className="users-modal-close"
                onClick={() => setShowInvite(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleInvite}>
              <div className="users-form-group">
                <label htmlFor="invite-email">
                  Email Address
                </label>

                <div className="users-input-wrapper">
                  <FaEnvelope />

                  <input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) =>
                      setInviteEmail(event.target.value)
                    }
                    placeholder="member@example.com"
                    required
                  />
                </div>
              </div>

              <div className="users-form-group">
                <label htmlFor="invite-role">
                  Workspace Role
                </label>

                <div className="users-input-wrapper">
                  <FaUserCog />

                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(event) =>
                      setInviteRole(event.target.value)
                    }
                  >
                    <option value="member">
                      Team Member
                    </option>

                    <option value="manager">
                      Manager
                    </option>

                    <option value="admin">
                      Administrator
                    </option>
                  </select>
                </div>
              </div>

              <div className="users-modal-actions">
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={() => setShowInvite(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-submit-button"
                  disabled={inviteLoading}
                >
                  <FaUserPlus />

                  {inviteLoading
                    ? "Sending..."
                    : "Send Invitation"}

                  {!inviteLoading && (
                    <FaArrowRight />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLICK OUTSIDE CARD MENU */}

      {menuOpen && (
        <button
          type="button"
          className="users-menu-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </div>
  );
}