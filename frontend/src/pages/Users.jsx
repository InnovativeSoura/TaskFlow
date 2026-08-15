import React, { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaSearch,
  FaFilter,
  FaPlus,
  FaArrowRight,
  FaChevronDown,
  FaEllipsisV,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaCircle,
  FaUserPlus,
} from "react-icons/fa";

// import MainLayout from "../Layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../services/api";

import "../styles/Users.css";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeRole = (role = "") => {
  const value = String(role).toLowerCase();

  if (value.includes("admin")) return "Administrator";
  if (value.includes("manager")) return "Manager";

  return "Team Member";
};

const normalizeStatus = (status = "") => {
  const value = String(status).toLowerCase();

  if (
    value === "active" ||
    value === "online" ||
    value === "available"
  ) {
    return "Active";
  }

  return status ? String(status) : "Active";
};

const getJoinDate = (user) => {
  return (
    user?.joinedAt ||
    user?.joinDate ||
    user?.createdAt ||
    user?.created_at ||
    user?.dateJoined ||
    null
  );
};

const getAvatar = (user) => {
  return (
    user?.avatar ||
    user?.profilePicture ||
    user?.profileImage ||
    user?.photo ||
    null
  );
};

const UserAvatar = ({ user, size = "large" }) => {
  const name = user?.name || user?.username || "User";
  const avatar = getAvatar(user);

  return (
    <div className={`user-avatar user-avatar-${size}`}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}

      <span className="avatar-status" />
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  description,
  type,
}) => {
  return (
    <div className={`user-stat-card stat-${type}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>

        <div className="stat-content">
          <span className="stat-label">{label}</span>
          <strong className="stat-value">{String(value).padStart(2, "0")}</strong>
          <span className="stat-description">{description}</span>
        </div>
      </div>

      <div className="stat-wave">
        <span />
      </div>
    </div>
  );
};

const UserCard = ({ user, index }) => {
  const name = user?.name || user?.username || "Unknown User";
  const email = user?.email || "No email available";
  const role = normalizeRole(user?.role);
  const status = normalizeStatus(user?.status);
  const joined = formatDate(getJoinDate(user));
  const isAdmin = role === "Administrator";
  const isActive = status === "Active";

  return (
    <article className="user-card">
      <div className="user-card-glow" />

      <div className="user-card-header">
        <span className="member-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          className="member-menu"
          aria-label={`More options for ${name}`}
        >
          <FaEllipsisV />
        </button>
      </div>

      <div className="member-profile">
        <UserAvatar user={user} size="large" />

        <h3>{name}</h3>

        <p>{email}</p>
      </div>

      <div className="member-details">
        <div className="member-detail">
          <span className="detail-label">ROLE</span>

          <span
            className={`role-badge ${
              isAdmin ? "role-admin" : "role-member"
            }`}
          >
            {isAdmin ? <FaUserShield /> : <FaUsers />}
            {role}
          </span>
        </div>

        <div className="member-detail">
          <span className="detail-label">STATUS</span>

          <span
            className={`status-badge ${
              isActive ? "status-active" : "status-inactive"
            }`}
          >
            <FaCircle />
            {status}
          </span>
        </div>
      </div>

      <div className="member-joined">
        <span>
          <FaCalendarAlt />
          JOINED
        </span>

        <strong>{joined}</strong>
      </div>
    </article>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users");

        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.users)
          ? response.data.users
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        if (mounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load users:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load workspace members."
          );
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

  const members = useMemo(() => {
    return users.map((user) => ({
      ...user,
      displayName: user?.name || user?.username || "Unknown User",
      displayEmail: user?.email || "No email available",
      displayRole: normalizeRole(user?.role),
      displayStatus: normalizeStatus(user?.status),
    }));
  }, [users]);

  const stats = useMemo(() => {
    const total = members.length;

    const active = members.filter(
      (user) => user.displayStatus === "Active"
    ).length;

    const administrators = members.filter(
      (user) => user.displayRole === "Administrator"
    ).length;

    const teamMembers = members.filter(
      (user) => user.displayRole !== "Administrator"
    ).length;

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [members]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((user) => {
      const matchesSearch =
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        user.displayEmail.toLowerCase().includes(query) ||
        user.displayRole.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        user.displayRole.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        user.displayStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  const heroAvatars = members.slice(0, 4);

  if (loading) {
    return (
      <MainLayout>
        <div className="users-page users-loading">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="users-page">
        <div className="users-background">
          <div className="users-grid-background" />
          <div className="users-orb users-orb-one" />
          <div className="users-orb users-orb-two" />
          <div className="users-glow" />
        </div>

        <main className="users-content">
          {error && (
            <div className="users-error">
              <FaShieldAlt />
              <span>{error}</span>
            </div>
          )}

          {/* HERO */}
          <section className="users-hero">
            <div className="hero-grid" />

            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="eyebrow-icon">
                  <FaUsers />
                </span>
                WORKSPACE
              </div>

              <h1>
                Team <span>Members</span>
              </h1>

              <p>
                Manage and collaborate with everyone in your
                TaskFlow workspace.
              </p>

              <button
                type="button"
                className="invite-button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("taskflow:invite-member")
                  );
                }}
              >
                <span className="invite-icon">
                  <FaPlus />
                </span>

                <span className="invite-text">
                  <strong>Invite Member</strong>
                  <small>Add someone to your workspace</small>
                </span>

                <FaArrowRight className="invite-arrow" />
              </button>
            </div>

            <div className="hero-members">
              <div className="hero-avatar-stack">
                {heroAvatars.map((user, index) => (
                  <UserAvatar
                    key={user?._id || index}
                    user={user}
                    size="small"
                  />
                ))}
              </div>

              <div className="hero-member-count">
                <strong>{members.length} members</strong>
                <span>working together</span>
              </div>
            </div>

            <div className="hero-wave">
              <span />
              <span />
            </div>
          </section>

          {/* STATS */}
          <section className="users-stats">
            <StatCard
              type="total"
              icon={<FaUsers />}
              label="TOTAL MEMBERS"
              value={stats.total}
              description="Workspace members"
            />

            <StatCard
              type="active"
              icon={<FaUserCheck />}
              label="ACTIVE MEMBERS"
              value={stats.active}
              description="Currently active"
            />

            <StatCard
              type="admin"
              icon={<FaUserShield />}
              label="ADMINISTRATORS"
              value={stats.administrators}
              description="Workspace admins"
            />

            <StatCard
              type="team"
              icon={<FaUserFriends />}
              label="TEAM MEMBERS"
              value={stats.teamMembers}
              description="Standard members"
            />
          </section>

          {/* MEMBERS */}
          <section className="users-members">
            <div className="members-heading">
              <div>
                <div className="section-eyebrow">
                  <span />
                  WORKSPACE MEMBERS
                </div>

                <h2>Your Team</h2>

                <p>
                  View and manage everyone in your TaskFlow workspace.
                </p>
              </div>

              <div className="members-count">
                <strong>{filteredUsers.length}</strong>
                <span>members</span>
              </div>
            </div>

            {/* TOOLBAR */}
            <div className="users-toolbar">
              <div className="search-box">
                <FaSearch />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search members..."
                  aria-label="Search members"
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

              <div className="filter-control">
                <FaUsers />

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value)
                  }
                  aria-label="Filter by role"
                >
                  <option value="all">All Roles</option>
                  <option value="administrator">Administrators</option>
                  <option value="manager">Managers</option>
                  <option value="team member">Team Members</option>
                </select>

                <FaChevronDown />
              </div>

              <div className="filter-control">
                <span className="filter-status-dot" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <FaChevronDown />
              </div>

              <button
                type="button"
                className="filter-button"
                aria-label="More filters"
              >
                <FaFilter />
              </button>
            </div>

            {/* GRID */}
            {filteredUsers.length > 0 ? (
              <div className="users-grid">
                {filteredUsers.map((user, index) => (
                  <UserCard
                    key={user?._id || user?.email || index}
                    user={user}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="users-empty">
                <EmptyState
                  title="No members found"
                  message="Try changing your search or filters."
                />
              </div>
            )}

            {/* FOOTER */}
            <div className="members-footer">
              <div className="secure-members">
                <span>
                  <FaShieldAlt />
                </span>
                Secure workspace members
              </div>

              <span className="displayed-count">
                {filteredUsers.length} members displayed
              </span>
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default Users;