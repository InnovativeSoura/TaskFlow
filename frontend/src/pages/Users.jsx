import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEllipsisV,
  FaCheckCircle,
  FaCircle,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Users.css";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDate = (date) => {
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
  const role = user?.role || user?.userRole || "member";

  return String(role).toLowerCase() === "admin"
    ? "Admin"
    : "Team Member";
};

const getUserStatus = (user) => {
  const status = String(user?.status || "active").toLowerCase();

  return status === "inactive" || status === "disabled"
    ? "Inactive"
    : "Active";
};

/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ user, size = "large" }) => {
  const name = getUserName(user);
  const initials = getInitials(name);

  return (
    <div className={`user-avatar user-avatar-${size}`}>
      <span>{initials}</span>

      <span
        className={`avatar-status ${
          getUserStatus(user) === "Active" ? "online" : "offline"
        }`}
      />
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  label,
  value,
  description,
  type = "purple",
}) => {
  return (
    <motion.div
      className="users-stat-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`stat-icon stat-icon-${type}`}>{icon}</div>

      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-description">{description}</span>
      </div>

      <div className={`stat-progress stat-progress-${type}`} />
    </motion.div>
  );
};

/* =========================================================
   MEMBER CARD
========================================================= */

const MemberCard = ({ user, index }) => {
  const name = getUserName(user);
  const email = getUserEmail(user);
  const role = getUserRole(user);
  const status = getUserStatus(user);

  return (
    <motion.article
      className="member-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      {/* Card top */}
      <div className="member-card-top">
        <span className="member-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          className="member-menu-btn"
          aria-label={`Options for ${name}`}
        >
          <FaEllipsisV />
        </button>
      </div>

      {/* Profile */}
      <div className="member-profile">
        <Avatar user={user} size="large" />

        <h3>{name}</h3>

        <p className="member-email">
          <FaEnvelope />
          {email}
        </p>
      </div>

      <div className="member-divider" />

      {/* Details */}
      <div className="member-details">
        <div className="member-detail-row">
          <span className="detail-label">ROLE</span>

          <span
            className={`role-badge ${
              role === "Admin" ? "role-admin" : "role-member"
            }`}
          >
            {role === "Admin" ? <FaUserShield /> : <FaUsers />}
            {role}
          </span>
        </div>

        <div className="member-detail-row">
          <span className="detail-label">STATUS</span>

          <span
            className={`status-badge ${
              status === "Active" ? "status-active" : "status-inactive"
            }`}
          >
            <FaCircle />
            {status}
          </span>
        </div>

        <div className="member-detail-row">
          <span className="detail-label">JOINED</span>

          <span className="joined-date">
            <FaCalendarAlt />
            {formatDate(user?.createdAt || user?.joinedAt)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* =========================================================
   USERS PAGE
========================================================= */

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showInvite, setShowInvite] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     FETCH USERS
  ======================================================= */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/users`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = response?.data;

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data?.users)) {
          setUsers(data.users);
        } else if (Array.isArray(data?.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);

        /*
         * Keep the UI alive even if the endpoint is temporarily
         * unavailable. This avoids destroying the page layout.
         */
        setUsers([]);
        setError("Unable to load workspace members.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* =======================================================
     FILTERED USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = getUserEmail(user).toLowerCase();
      const role = getUserRole(user).toLowerCase();
      const status = getUserStatus(user).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) => getUserStatus(user) === "Active"
  ).length;

  const administrators = users.filter(
    (user) => getUserRole(user) === "Admin"
  ).length;

  const teamMembers = users.filter(
    (user) => getUserRole(user) === "Team Member"
  ).length;

  /* =======================================================
     INVITE
  ======================================================= */

  const handleInvite = async (event) => {
    event.preventDefault();

    if (!inviteEmail.trim()) return;

    try {
      setInviteLoading(true);

      /*
       * This endpoint is intentionally isolated here so the
       * existing Users page does not depend on an invitation
       * endpoint being available.
       */
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/users/invite`,
        {
          email: inviteEmail.trim(),
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
      setShowInvite(false);
    } catch (err) {
      console.error("Invite failed:", err);
    } finally {
      setInviteLoading(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="users-page-shell">
      <Sidebar />

      <div className="users-content">
        <Navbar />

        <main className="users-main">
          {/* ===============================================
              HERO
          =============================================== */}

          <section className="users-hero">
            <div className="hero-grid" />
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="eyebrow-line" />
                <FaUsers />
                <span>WORKSPACE</span>
              </div>

              <h1>
                Team <span>Members</span>
              </h1>

              <p>
                Manage and collaborate with everyone in your
                TaskFlow workspace.
              </p>

              {/* COMPACT INVITE BUTTON */}
              <button
                type="button"
                className="invite-member-btn"
                onClick={() => setShowInvite(true)}
              >
                <span className="invite-icon">
                  <FaUserPlus />
                </span>

                <span className="invite-text">
                  <strong>Invite Member</strong>
                  <small>Add someone to your workspace</small>
                </span>

                <span className="invite-arrow">→</span>
              </button>
            </div>

            {/* Mini member preview */}
            <div className="hero-members">
              <div className="hero-avatar-stack">
                {users.slice(0, 3).map((user, index) => (
                  <Avatar
                    key={user?._id || user?.id || index}
                    user={user}
                    size="small"
                  />
                ))}
              </div>

              <div className="hero-members-copy">
                <strong>{totalMembers} members</strong>
                <span>working together</span>
              </div>
            </div>
          </section>

          {/* ===============================================
              STATS
          =============================================== */}

          <section className="users-stats">
            <StatCard
              icon={<FaUsers />}
              label="TOTAL MEMBERS"
              value={totalMembers}
              description="Workspace members"
              type="purple"
            />

            <StatCard
              icon={<FaUserCheck />}
              label="ACTIVE MEMBERS"
              value={activeMembers}
              description="Currently active"
              type="green"
            />

            <StatCard
              icon={<FaUserShield />}
              label="ADMINISTRATORS"
              value={administrators}
              description="Workspace admins"
              type="violet"
            />

            <StatCard
              icon={<FaUserFriends />}
              label="TEAM MEMBERS"
              value={teamMembers}
              description="Standard members"
              type="blue"
            />
          </section>

          {/* ===============================================
              TEAM SECTION
          =============================================== */}

          <section className="team-section">
            <div className="section-heading">
              <div>
                <div className="section-eyebrow">
                  <span />
                  WORKSPACE MEMBERS
                </div>

                <h2>Your Team</h2>

                <p>
                  View and manage everyone in your TaskFlow
                  workspace.
                </p>
              </div>

              <div className="member-count">
                <strong>{filteredUsers.length}</strong>
                <span>members</span>
              </div>
            </div>

            {/* Filters */}
            <div className="users-toolbar">
              <div className="search-box">
                <FaSearch />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search members..."
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <div className="filter-select">
                  <FaFilter />

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value)
                    }
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Administrators</option>
                    <option value="team member">Team Members</option>
                  </select>
                </div>

                <div className="filter-select">
                  <FaCircle />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="users-error">
                <span />
                {error}
              </div>
            )}

            {/* Cards */}
            {loading ? (
              <div className="members-loading">
                {[1, 2, 3].map((item) => (
                  <div
                    className="member-skeleton"
                    key={item}
                  >
                    <div className="skeleton-top" />
                    <div className="skeleton-avatar" />
                    <div className="skeleton-line skeleton-name" />
                    <div className="skeleton-line" />
                    <div className="skeleton-details" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="members-grid">
                {filteredUsers.map((user, index) => (
                  <MemberCard
                    key={user?._id || user?.id || index}
                    user={user}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-members">
                <div className="empty-icon">
                  <FaUsers />
                </div>

                <h3>No members found</h3>

                <p>
                  Try changing your search or filter settings.
                </p>
              </div>
            )}

            <div className="members-footer">
              <div className="secure-status">
                <span />
                Secure workspace members
              </div>

              <span>
                {filteredUsers.length} members displayed
              </span>
            </div>
          </section>
        </main>
      </div>

      {/* ===============================================
          INVITE MODAL
      =============================================== */}

      {showInvite && (
        <div
          className="invite-modal-overlay"
          onMouseDown={() => setShowInvite(false)}
        >
          <motion.div
            className="invite-modal"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowInvite(false)}
            >
              <FaTimes />
            </button>

            <div className="modal-icon">
              <FaUserPlus />
            </div>

            <div className="modal-heading">
              <span>WORKSPACE</span>
              <h2>Invite a Member</h2>
              <p>
                Add a teammate to your TaskFlow workspace.
              </p>
            </div>

            <form onSubmit={handleInvite}>
              <label htmlFor="invite-email">
                Email address
              </label>

              <div className="invite-input">
                <FaEnvelope />

                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(event) =>
                    setInviteEmail(event.target.value)
                  }
                  placeholder="teammate@example.com"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="modal-invite-btn"
                disabled={inviteLoading}
              >
                {inviteLoading
                  ? "Sending..."
                  : "Send Invitation"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Users;