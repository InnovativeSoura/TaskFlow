import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaFilter,
  FaSearch,
  FaShieldAlt,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
  FaUserTie,
  FaCircle,
  FaEllipsisV,
  FaCalendarAlt,
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

  /* ---------------------------------------------
     Helpers
  --------------------------------------------- */

  const getUserName = (user) => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Unknown User"
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  const getRole = (user) => {
    const role = user?.role || "Team Member";

    if (
      String(role).toLowerCase() === "admin" ||
      String(role).toLowerCase() === "administrator"
    ) {
      return "Admin";
    }

    return "Team Member";
  };

  const getStatus = (user) => {
    const status = user?.status;

    if (!status) return "Active";

    const normalized = String(status).toLowerCase();

    if (
      normalized === "active" ||
      normalized === "online" ||
      normalized === "enabled"
    ) {
      return "Active";
    }

    return "Inactive";
  };

  const getJoinedDate = (user) => {
    const date =
      user?.createdAt ||
      user?.joinedAt ||
      user?.dateJoined;

    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ---------------------------------------------
     Dynamic Statistics
  --------------------------------------------- */

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => getStatus(user) === "Active"
    ).length;

    const administrators = users.filter(
      (user) => getRole(user) === "Admin"
    ).length;

    const teamMembers = total - administrators;

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [users]);

  /* ---------------------------------------------
     Filtered Users
  --------------------------------------------- */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = String(user?.email || "").toLowerCase();
      const role = getRole(user);
      const status = getStatus(user);

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const matchesRole =
        roleFilter === "All Roles" ||
        role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  /* ---------------------------------------------
     Avatar Colors
  --------------------------------------------- */

  const avatarClasses = [
    "avatar-purple",
    "avatar-blue",
    "avatar-cyan",
    "avatar-pink",
    "avatar-orange",
    "avatar-indigo",
  ];

  const getAvatarClass = (index) => {
    return avatarClasses[index % avatarClasses.length];
  };

  /* ---------------------------------------------
     Loading
  --------------------------------------------- */

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* =========================================
            PREMIUM HERO
        ========================================= */}

        <section className="users-hero">

          <div className="users-hero-glow users-hero-glow-one" />
          <div className="users-hero-glow users-hero-glow-two" />

          <div className="users-hero-grid" />

          <div className="users-hero-content">

            <div className="users-eyebrow">
              <span className="eyebrow-icon">
                <FaUsers />
              </span>

              <span>WORKSPACE</span>
            </div>

            <h1>
              Team Members
            </h1>

            <p>
              Manage and collaborate with everyone
              <br className="hero-break" />
              in your TaskFlow workspace.
            </p>

            {/* Avatar Stack */}

            <div className="users-hero-members">

              <div className="avatar-stack">

                {users.slice(0, 4).map((user, index) => (
                  <div
                    className={`hero-avatar ${getAvatarClass(
                      index
                    )}`}
                    key={user?._id || index}
                    title={getUserName(user)}
                  >
                    {getInitials(getUserName(user))}

                    {getStatus(user) === "Active" && (
                      <span className="hero-avatar-status" />
                    )}
                  </div>
                ))}

                {users.length > 4 && (
                  <div className="hero-avatar hero-avatar-more">
                    +{users.length - 4}
                  </div>
                )}

              </div>

              <div className="hero-member-copy">
                <strong>
                  {users.length > 0
                    ? `${users.length}+ members`
                    : "Your team"}
                </strong>

                <span>
                  working together
                </span>
              </div>

            </div>

          </div>

          {/* Hero CTA */}

          <button
            type="button"
            className="invite-hero-button"
            onClick={() => {
              console.log("Invite Member clicked");
            }}
          >
            <span className="invite-icon">
              <FaUserPlus />
            </span>

            <span className="invite-text">
              Invite Member
            </span>

            <span className="invite-arrow">
              <FaArrowRight />
            </span>
          </button>

        </section>

        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="users-statistics">

          {/* Total */}

          <div className="stat-card stat-purple">

            <div className="stat-icon">
              <FaUsers />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                TOTAL MEMBERS
              </span>

              <strong>
                {statistics.total}
              </strong>

              <small>
                Workspace members
              </small>
            </div>

            <div className="stat-progress">
              <span
                style={{
                  width:
                    statistics.total > 0
                      ? "72%"
                      : "0%",
                }}
              />
            </div>

          </div>

          {/* Active */}

          <div className="stat-card stat-green">

            <div className="stat-icon">
              <FaUserFriends />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                ACTIVE MEMBERS
              </span>

              <strong>
                {statistics.active}
              </strong>

              <small>
                Currently active
              </small>
            </div>

            <div className="stat-progress">
              <span
                style={{
                  width:
                    statistics.total > 0
                      ? `${Math.max(
                          10,
                          (statistics.active /
                            statistics.total) *
                            100
                        )}%`
                      : "0%",
                }}
              />
            </div>

          </div>

          {/* Administrators */}

          <div className="stat-card stat-pink">

            <div className="stat-icon">
              <FaShieldAlt />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                ADMINISTRATORS
              </span>

              <strong>
                {statistics.administrators}
              </strong>

              <small>
                Workspace admins
              </small>
            </div>

            <div className="stat-progress">
              <span
                style={{
                  width:
                    statistics.total > 0
                      ? `${Math.max(
                          8,
                          (statistics.administrators /
                            statistics.total) *
                            100
                        )}%`
                      : "0%",
                }}
              />
            </div>

          </div>

          {/* Team Members */}

          <div className="stat-card stat-blue">

            <div className="stat-icon">
              <FaUserTie />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                TEAM MEMBERS
              </span>

              <strong>
                {statistics.teamMembers}
              </strong>

              <small>
                Standard members
              </small>
            </div>

            <div className="stat-progress">
              <span
                style={{
                  width:
                    statistics.total > 0
                      ? `${Math.max(
                          10,
                          (statistics.teamMembers /
                            statistics.total) *
                            100
                        )}%`
                      : "0%",
                }}
              />
            </div>

          </div>

        </section>

        {/* =========================================
            MEMBERS SECTION
        ========================================= */}

        <section className="members-section">

          <div className="members-heading">

            <div>
              <div className="section-eyebrow">
                <span />
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

            <div className="members-count">
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

          {/* =======================================
              SEARCH / FILTERS
          ======================================= */}

          <div className="members-toolbar">

            <div className="member-search">

              <FaSearch />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search members..."
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

            </div>

            <div className="filter-wrapper">

              <div className="filter-select">

                <FaFilter />

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                >
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Team Member</option>
                </select>

                <FaChevronDown />

              </div>

              <div className="filter-select">

                <FaCircle />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <FaChevronDown />

              </div>

            </div>

          </div>

          {/* =======================================
              USER GRID
          ======================================= */}

          {filteredUsers.length === 0 ? (
            <div className="users-empty-wrapper">
              <EmptyState
                title="No Members Found"
              />
            </div>
          ) : (
            <div className="premium-users-grid">

              {filteredUsers.map((user, index) => {

                const name = getUserName(user);
                const initials = getInitials(name);
                const role = getRole(user);
                const status = getStatus(user);
                const email = user?.email || "No email available";

                return (
                  <article
                    className={`premium-user-card ${
                      role === "Admin"
                        ? "admin-card"
                        : ""
                    }`}
                    key={user?._id || index}
                  >

                    {/* Card top */}

                    <div className="user-card-top">

                      <span className="member-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <button
                        type="button"
                        className="user-menu-button"
                        aria-label={`Options for ${name}`}
                      >
                        <FaEllipsisV />
                      </button>

                    </div>

                    {/* Avatar */}

                    <div className="member-avatar-wrapper">

                      <div
                        className={`member-avatar ${getAvatarClass(
                          index
                        )}`}
                      >
                        {initials}
                      </div>

                      <span
                        className={`member-online ${
                          status === "Active"
                            ? "online"
                            : "offline"
                        }`}
                      />

                    </div>

                    {/* Identity */}

                    <div className="member-identity">

                      <h3>
                        {name}
                      </h3>

                      <p>
                        {email}
                      </p>

                    </div>

                    {/* Divider */}

                    <div className="member-divider" />

                    {/* Details */}

                    <div className="member-details">

                      <div className="member-detail-row">

                        <span>
                          ROLE
                        </span>

                        <span
                          className={`member-role ${
                            role === "Admin"
                              ? "role-admin"
                              : "role-member"
                          }`}
                        >
                          {role === "Admin" && (
                            <FaShieldAlt />
                          )}

                          {role}
                        </span>

                      </div>

                      <div className="member-detail-row">

                        <span>
                          STATUS
                        </span>

                        <span
                          className={`member-status ${
                            status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          <FaCircle />
                          {status}
                        </span>

                      </div>

                      <div className="member-detail-row">

                        <span>
                          JOINED
                        </span>

                        <span className="member-date">
                          <FaCalendarAlt />
                          {getJoinedDate(user)}
                        </span>

                      </div>

                    </div>

                    {/* Bottom accent */}

                    <div className="card-bottom-glow" />

                  </article>
                );
              })}

            </div>
          )}

          {/* Footer */}

          {filteredUsers.length > 0 && (
            <div className="members-footer">

              <div className="secure-members">

                <span className="secure-dot">
                  <FaCheck />
                </span>

                <span>
                  Secure workspace members
                </span>

              </div>

              <span className="displayed-count">
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
    </MainLayout>
  );
};

export default Users;