import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserFriends,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";

import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

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

  /* ---------------------------------------------
     HELPERS
  --------------------------------------------- */

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase() || "U";
  };

  const getStatus = (user) => {
    return user?.status || "Active";
  };

  const getRole = (user) => {
    return user?.role || "Team Member";
  };

  const getJoinDate = (user) => {
    const date =
      user?.createdAt ||
      user?.joinedAt ||
      user?.dateJoined;

    if (!date) return "Recently joined";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently joined";
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ---------------------------------------------
     STATISTICS
  --------------------------------------------- */

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) =>
      String(getStatus(user)).toLowerCase() === "active"
  ).length;

  const administrators = users.filter(
    (user) =>
      String(getRole(user)).toLowerCase() === "admin" ||
      String(getRole(user)).toLowerCase() === "administrator"
  ).length;

  const teamMembers = Math.max(
    totalMembers - administrators,
    0
  );

  /* ---------------------------------------------
     FILTER OPTIONS
  --------------------------------------------- */

  const roles = useMemo(() => {
    const uniqueRoles = [
      ...new Set(
        users
          .map((user) => getRole(user))
          .filter(Boolean)
      ),
    ];

    return ["All Roles", ...uniqueRoles];
  }, [users]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(
        users
          .map((user) => getStatus(user))
          .filter(Boolean)
      ),
    ];

    return ["All Status", ...uniqueStatuses];
  }, [users]);

  /* ---------------------------------------------
     FILTERED USERS
  --------------------------------------------- */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = String(user?.name || "").toLowerCase();
      const email = String(user?.email || "").toLowerCase();
      const role = String(getRole(user));
      const status = String(getStatus(user));

      const searchMatch =
        !search ||
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const roleMatch =
        roleFilter === "All Roles" ||
        role === roleFilter;

      const statusMatch =
        statusFilter === "All Status" ||
        status === statusFilter;

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* ==========================================
            PREMIUM BACKGROUND
        ========================================== */}

        <div className="users-background">
          <div className="users-bg-orb users-bg-orb-one" />
          <div className="users-bg-orb users-bg-orb-two" />
          <div className="users-bg-grid" />
        </div>

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <section className="users-header">

          <div className="users-header-content">

            <div className="users-eyebrow">
              <span className="users-eyebrow-line" />
              WORKSPACE
            </div>

            <h1 className="users-title">
              Team Members
            </h1>

            <p className="users-description">
              Manage and view everyone in your
              TaskFlow workspace.
            </p>

          </div>

          <button
            className="users-invite-button"
            type="button"
          >
            <span className="users-invite-icon">
              <FaUserPlus />
            </span>

            <span>Invite Member</span>
          </button>

        </section>

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <section className="users-stats">

          <div className="users-stat-card">

            <div className="users-stat-icon purple">
              <FaUsers />
            </div>

            <div className="users-stat-content">
              <span className="users-stat-label">
                Total Members
              </span>

              <strong className="users-stat-value">
                {totalMembers}
              </strong>

              <small>
                Workspace members
              </small>
            </div>

          </div>

          <div className="users-stat-card">

            <div className="users-stat-icon green">
              <FaUserCheck />
            </div>

            <div className="users-stat-content">
              <span className="users-stat-label">
                Active Members
              </span>

              <strong className="users-stat-value">
                {activeMembers}
              </strong>

              <small>
                Currently active
              </small>
            </div>

          </div>

          <div className="users-stat-card">

            <div className="users-stat-icon violet">
              <FaUserShield />
            </div>

            <div className="users-stat-content">
              <span className="users-stat-label">
                Administrators
              </span>

              <strong className="users-stat-value">
                {administrators}
              </strong>

              <small>
                Workspace admins
              </small>
            </div>

          </div>

          <div className="users-stat-card">

            <div className="users-stat-icon blue">
              <FaUserFriends />
            </div>

            <div className="users-stat-content">
              <span className="users-stat-label">
                Team Members
              </span>

              <strong className="users-stat-value">
                {teamMembers}
              </strong>

              <small>
                Standard members
              </small>
            </div>

          </div>

        </section>

        {/* ==========================================
            MEMBERS SECTION
        ========================================== */}

        <section className="users-members-section">

          <div className="users-section-header">

            <div>

              <div className="users-section-eyebrow">
                WORKSPACE MEMBERS
              </div>

              <h2>
                Your Team
              </h2>

              <p>
                View and manage everyone in your
                TaskFlow workspace.
              </p>

            </div>

            <div className="users-member-count">
              <strong>
                {filteredUsers.length}
              </strong>

              <span>
                members
              </span>
            </div>

          </div>

          {/* ========================================
              FILTER BAR
          ======================================== */}

          <div className="users-toolbar">

            <div className="users-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="users-filter-group">

              <div className="users-select-wrapper">

                <FaFilter />

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                >
                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>

                <FaChevronDown />

              </div>

              <div className="users-select-wrapper">

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <FaChevronDown />

              </div>

            </div>

          </div>

          {/* ========================================
              EMPTY STATE
          ======================================== */}

          {users.length === 0 ? (

            <EmptyState title="No Members Found" />

          ) : filteredUsers.length === 0 ? (

            <div className="users-no-results">

              <div className="users-no-results-icon">
                <FaUsers />
              </div>

              <h3>
                No matching members
              </h3>

              <p>
                Try changing your search or
                filter criteria.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All Roles");
                  setStatusFilter("All Status");
                }}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            /* ========================================
               USER GRID
            ======================================== */

            <div className="users-grid">

              {filteredUsers.map((user, index) => {

                const role = getRole(user);
                const status = getStatus(user);

                const isAdmin =
                  String(role).toLowerCase() ===
                    "admin" ||
                  String(role).toLowerCase() ===
                    "administrator";

                const isActive =
                  String(status).toLowerCase() ===
                  "active";

                return (
                  <article
                    className="users-card"
                    key={
                      user._id ||
                      user.id ||
                      `${user.email}-${index}`
                    }
                  >

                    {/* CARD TOP */}

                    <div className="users-card-top">

                      <span className="users-card-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <button
                        className="users-card-menu"
                        type="button"
                        aria-label="Member options"
                      >
                        <FaEllipsisV />
                      </button>

                    </div>

                    {/* AVATAR */}

                    <div className="users-avatar-wrapper">

                      <div
                        className={`users-avatar ${
                          isAdmin
                            ? "admin-avatar"
                            : ""
                        }`}
                      >

                        {user.avatar ? (

                          <img
                            src={user.avatar}
                            alt={user.name || "Member"}
                          />

                        ) : (

                          <span>
                            {getInitials(user.name)}
                          </span>

                        )}

                      </div>

                      <span
                        className={`users-online-dot ${
                          isActive
                            ? "online"
                            : "offline"
                        }`}
                      />
                    </div>

                    {/* IDENTITY */}

                    <div className="users-card-identity">

                      <h3>
                        {user.name ||
                          "Unnamed Member"}
                      </h3>

                      <div className="users-email">
                        <FaEnvelope />
                        <span>
                          {user.email ||
                            "No email available"}
                        </span>
                      </div>

                    </div>

                    {/* DIVIDER */}

                    <div className="users-card-divider" />

                    {/* DETAILS */}

                    <div className="users-card-details">

                      <div className="users-detail-row">

                        <span className="users-detail-label">
                          ROLE
                        </span>

                        <span
                          className={`users-role ${
                            isAdmin
                              ? "admin"
                              : ""
                          }`}
                        >
                          {isAdmin && (
                            <FaUserShield />
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
                            isActive
                              ? "active"
                              : "inactive"
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

          {/* ========================================
              FOOTER
          ======================================== */}

          {filteredUsers.length > 0 && (
            <div className="users-footer">

              <div className="users-security">

                <span>
                  <FaCircle />
                </span>

                Secure workspace members

              </div>

              <div className="users-footer-count">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1
                  ? "member"
                  : "members"}{" "}
                displayed
              </div>

            </div>
          )}

        </section>

      </div>
    </MainLayout>
  );
};

export default Users;