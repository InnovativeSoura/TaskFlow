import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserFriends,
  FaPlus,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaEllipsisV,
  FaCalendarAlt,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

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

      const data =
        res.data?.users ||
        res.data?.data ||
        res.data ||
        [];

      setUsers(Array.isArray(data) ? data : []);
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

    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }

    return words[0].substring(0, 2).toUpperCase();
  };

  const normalizeRole = (role) => {
    if (!role) return "Team Member";

    const value = role.toLowerCase();

    if (value === "admin" || value === "administrator") {
      return "Admin";
    }

    if (value === "manager") {
      return "Manager";
    }

    return "Team Member";
  };

  const normalizeStatus = (status) => {
    if (!status) return "Active";

    return status.toLowerCase() === "active"
      ? "Active"
      : "Inactive";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = (user?.email || "").toLowerCase();

      const role = normalizeRole(user?.role);
      const status = normalizeStatus(user?.status);

      const searchMatch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const roleMatch =
        roleFilter === "All Roles" ||
        role === roleFilter;

      const statusMatch =
        statusFilter === "All Status" ||
        status === statusFilter;

      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) => normalizeStatus(user?.status) === "Active"
  ).length;

  const administrators = users.filter(
    (user) => normalizeRole(user?.role) === "Admin"
  ).length;

  const teamMembers = users.filter(
    (user) => normalizeRole(user?.role) === "Team Member"
  ).length;

  const stats = [
    {
      label: "Total Members",
      value: totalMembers,
      description: "Workspace members",
      icon: <FaUsers />,
      type: "purple",
    },
    {
      label: "Active Members",
      value: activeMembers,
      description: "Currently active",
      icon: <FaUserCheck />,
      type: "green",
    },
    {
      label: "Administrators",
      value: administrators,
      description: "Workspace admins",
      icon: <FaUserShield />,
      type: "violet",
    },
    {
      label: "Team Members",
      value: teamMembers,
      description: "Standard members",
      icon: <FaUserFriends />,
      type: "blue",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="users-hero">

          <div className="users-hero-glow users-hero-glow-one" />
          <div className="users-hero-glow users-hero-glow-two" />
          <div className="users-hero-grid" />

          <div className="users-hero-content">

            <div className="users-eyebrow">
              <span className="users-eyebrow-icon">
                <FaUsers />
              </span>

              <span>WORKSPACE</span>
            </div>

            <h1>
              Team <span>Members</span>
            </h1>

            <p>
              Manage and collaborate with everyone
              <br className="users-desktop-break" />
              in your TaskFlow workspace.
            </p>

          </div>

          <button
            type="button"
            className="users-invite-button"
            onClick={() => {
              console.log("Invite member clicked");
            }}
          >
            <span className="users-invite-icon">
              <FaPlus />
            </span>

            <span className="users-invite-content">
              <strong>Invite Member</strong>
              <small>
                Grow your workspace and collaborate more effectively.
              </small>
            </span>

            <span className="users-invite-arrow">
              →
            </span>
          </button>

          <div className="users-hero-members">

            <div className="users-mini-avatars">
              {users.slice(0, 3).map((user, index) => {
                const name = getUserName(user);

                return (
                  <div
                    key={user?._id || index}
                    className={`users-mini-avatar users-mini-avatar-${index}`}
                  >
                    {getInitials(name)}

                    <span className="users-mini-online" />
                  </div>
                );
              })}
            </div>

            <div>
              <strong>
                {users.length > 3
                  ? `${users.length}+ members`
                  : `${users.length} members`}
              </strong>

              <span>working together</span>
            </div>

          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ====================================================== */}
        <section className="users-stats">

          {stats.map((stat) => (
            <div
              className="users-stat-card"
              key={stat.label}
            >
              <div
                className={`users-stat-icon users-stat-${stat.type}`}
              >
                {stat.icon}
              </div>

              <div className="users-stat-content">
                <span className="users-stat-label">
                  {stat.label}
                </span>

                <strong>{stat.value}</strong>

                <small>{stat.description}</small>
              </div>

              <div
                className={`users-stat-line users-stat-line-${stat.type}`}
              />
            </div>
          ))}

        </section>

        {/* =====================================================
            TEAM HEADER
        ====================================================== */}
        <section className="users-team-section">

          <div className="users-section-heading">

            <div>
              <div className="users-section-eyebrow">
                <span />
                WORKSPACE MEMBERS
              </div>

              <h2>Your Team</h2>

              <p>
                View and manage everyone in your TaskFlow workspace.
              </p>
            </div>

            <div className="users-result-count">
              <strong>{filteredUsers.length}</strong>
              <span>
                {filteredUsers.length === 1
                  ? "member"
                  : "members"}
              </span>
            </div>

          </div>

          {/* =================================================
              FILTER BAR
          ================================================== */}
          <div className="users-toolbar">

            <div className="users-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="users-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

            <div className="users-filters">

              <div className="users-select-wrapper">
                <FaFilter />

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                >
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Team Member</option>
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
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <FaChevronDown />
              </div>

            </div>
          </div>

          {/* =================================================
              MEMBER CARDS
          ================================================== */}
          {filteredUsers.length === 0 ? (
            <div className="users-empty-wrapper">
              <EmptyState title="No Members Found" />
            </div>
          ) : (
            <div className="users-grid">

              {filteredUsers.map((user, index) => {
                const name = getUserName(user);
                const role = normalizeRole(user?.role);
                const status = normalizeStatus(user?.status);

                return (
                  <article
                    className="users-member-card"
                    key={user?._id || index}
                  >

                    <div className="users-card-top">
                      <span className="users-card-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        className="users-card-menu"
                        aria-label={`Actions for ${name}`}
                      >
                        <FaEllipsisV />
                      </button>
                    </div>

                    {/* Avatar */}
                    <div className="users-member-avatar-wrapper">

                      <div className="users-member-avatar">
                        {getInitials(name)}
                      </div>

                      <span
                        className={`users-member-status-dot ${
                          status === "Active"
                            ? "is-active"
                            : "is-inactive"
                        }`}
                      />
                    </div>

                    {/* Identity */}
                    <div className="users-member-identity">

                      <h3>{name}</h3>

                      <p>
                        {user?.email || "No email available"}
                      </p>

                    </div>

                    <div className="users-card-divider" />

                    {/* Details */}
                    <div className="users-member-details">

                      <div className="users-detail-row">

                        <span>ROLE</span>

                        <span
                          className={`users-role-badge ${
                            role === "Admin"
                              ? "users-role-admin"
                              : "users-role-member"
                          }`}
                        >
                          {role === "Admin" && (
                            <FaShieldAlt />
                          )}

                          {role}
                        </span>

                      </div>

                      <div className="users-detail-row">

                        <span>STATUS</span>

                        <span
                          className={`users-status-badge ${
                            status === "Active"
                              ? "users-status-active"
                              : "users-status-inactive"
                          }`}
                        >
                          <i />
                          {status}
                        </span>

                      </div>

                      <div className="users-detail-row">

                        <span>JOINED</span>

                        <span className="users-date">
                          <FaCalendarAlt />
                          {formatDate(
                            user?.createdAt ||
                            user?.joinedAt ||
                            user?.dateJoined
                          )}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================== */}
          {filteredUsers.length > 0 && (
            <div className="users-footer">

              <div className="users-secure-status">
                <span>
                  <FaCheckCircle />
                </span>

                <p>
                  Secure workspace members
                </p>
              </div>

              <span className="users-displayed">
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