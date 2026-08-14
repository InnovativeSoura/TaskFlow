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
  FaChevronDown,
  FaEllipsisV,
  FaCheckCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaArrowRight,
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
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getName = (user) => {
    return (
      user?.name ||
      user?.username ||
      user?.email?.split("@")[0] ||
      "Unknown User"
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const getRole = (user) => {
    return user?.role || "Team Member";
  };

  const getStatus = (user) => {
    return user?.status || "Active";
  };

  const getJoinDate = (user) => {
    const date =
      user?.createdAt ||
      user?.joinedAt ||
      user?.dateJoined;

    if (!date) return "Recently joined";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently joined";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = getName(user).toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const role = getRole(user);
      const status = getStatus(user);

      const matchesSearch =
        !search.trim() ||
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" ||
        role.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) =>
      getStatus(user).toLowerCase() === "active"
  ).length;

  const administrators = users.filter(
    (user) =>
      getRole(user).toLowerCase() === "admin" ||
      getRole(user).toLowerCase() === "administrator"
  ).length;

  const teamMembers = Math.max(
    totalMembers - administrators,
    0
  );

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* Ambient Background */}
        <div className="users-bg-orb users-bg-orb-one" />
        <div className="users-bg-orb users-bg-orb-two" />
        <div className="users-bg-grid" />

        {/* HERO */}
        <section className="users-hero">

          <div className="users-hero-content">

            <div className="users-eyebrow">
              <span className="eyebrow-line" />
              <span>WORKSPACE</span>
            </div>

            <h1>
              Team Members
              <span className="title-dot">.</span>
            </h1>

            <p>
              Manage your workspace members, roles,
              permissions and activity from one place.
            </p>

          </div>

          <button
            type="button"
            className="invite-btn"
          >
            <span className="invite-icon">
              <FaUserPlus />
            </span>

            <span>
              <strong>Invite Member</strong>
              <small>Add someone to your workspace</small>
            </span>

            <FaArrowRight className="invite-arrow" />
          </button>

        </section>

        {/* STATISTICS */}
        <section className="users-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              <FaUsers />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                TOTAL MEMBERS
              </span>

              <strong>{totalMembers}</strong>

              <small>
                Workspace members
              </small>
            </div>

          </div>

          <div className="stat-divider" />

          <div className="stat-card">

            <div className="stat-icon green">
              <FaUserCheck />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                ACTIVE MEMBERS
              </span>

              <strong>{activeMembers}</strong>

              <small>
                Currently active
              </small>
            </div>

          </div>

          <div className="stat-divider" />

          <div className="stat-card">

            <div className="stat-icon violet">
              <FaUserShield />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                ADMINISTRATORS
              </span>

              <strong>{administrators}</strong>

              <small>
                Workspace admins
              </small>
            </div>

          </div>

          <div className="stat-divider" />

          <div className="stat-card">

            <div className="stat-icon blue">
              <FaUserFriends />
            </div>

            <div className="stat-content">
              <span className="stat-label">
                TEAM MEMBERS
              </span>

              <strong>{teamMembers}</strong>

              <small>
                Standard members
              </small>
            </div>

          </div>

        </section>

        {/* MEMBERS SECTION */}
        <section className="members-section">

          <div className="members-heading">

            <div>
              <div className="section-eyebrow">
                WORKSPACE MEMBERS
              </div>

              <h2>Your Team</h2>

              <p>
                View and manage everyone in your
                TaskFlow workspace.
              </p>
            </div>

            <div className="member-count">
              <strong>{filteredUsers.length}</strong>
              <span>
                {filteredUsers.length === 1
                  ? "member"
                  : "members"}
              </span>
            </div>

          </div>

          {/* FILTER BAR */}
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

            <div className="filter-control">

              <FaFilter />

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Administrator</option>
                <option>Team Member</option>
              </select>

              <FaChevronDown />

            </div>

            <div className="filter-control">

              <FaCheckCircle />

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

          {/* MEMBERS */}
          {filteredUsers.length === 0 ? (

            <div className="users-empty">
              <EmptyState title="No Members Found" />

              {(search ||
                roleFilter !== "All Roles" ||
                statusFilter !== "All Status") && (
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

          ) : (

            <div className="users-grid">

              {filteredUsers.map((user, index) => {

                const name = getName(user);
                const role = getRole(user);
                const status = getStatus(user);
                const initials = getInitials(name);
                const isAdmin =
                  role.toLowerCase() === "admin" ||
                  role.toLowerCase() ===
                    "administrator";

                return (
                  <article
                    className="user-card"
                    key={user._id || user.id || index}
                  >

                    {/* Card Header */}
                    <div className="user-card-top">

                      <span className="member-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        className="card-menu"
                        aria-label="Member options"
                      >
                        <FaEllipsisV />
                      </button>

                    </div>

                    {/* Avatar */}
                    <div className="avatar-wrapper">

                      <div
                        className={`avatar ${
                          isAdmin
                            ? "avatar-admin"
                            : ""
                        }`}
                      >

                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={name}
                          />
                        ) : (
                          initials
                        )}

                      </div>

                      <span
                        className={`online-indicator ${
                          status.toLowerCase() !==
                          "active"
                            ? "offline"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Identity */}
                    <div className="user-identity">

                      <h3>{name}</h3>

                      <p>
                        {user.email ||
                          "No email available"}
                      </p>

                    </div>

                    {/* Divider */}
                    <div className="card-divider" />

                    {/* Meta */}
                    <div className="user-meta">

                      <div className="meta-row">

                        <span className="meta-label">
                          ROLE
                        </span>

                        <span
                          className={`role-badge ${
                            isAdmin
                              ? "admin"
                              : "member"
                          }`}
                        >
                          {isAdmin && (
                            <FaShieldAlt />
                          )}

                          {role}
                        </span>

                      </div>

                      <div className="meta-row">

                        <span className="meta-label">
                          STATUS
                        </span>

                        <span
                          className={`status-badge ${
                            status.toLowerCase() ===
                            "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <span className="status-dot" />
                          {status}
                        </span>

                      </div>

                      <div className="meta-row">

                        <span className="meta-label">
                          JOINED
                        </span>

                        <span className="joined-date">
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

          {/* Footer */}
          {filteredUsers.length > 0 && (
            <div className="members-footer">

              <div className="secure-label">
                <span />
                Secure workspace members
              </div>

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
    </MainLayout>
  );
};

export default Users;