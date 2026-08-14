import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaCircle,
  FaCalendarAlt,
  FaEllipsisV,
  FaShieldAlt,
  FaCheckCircle,
  FaUser,
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
        res.data?.users ||
          res.data?.data ||
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

  const getName = (user) => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Unknown User"
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`
        .toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  const getRole = (user) => {
    const role = user?.role || "Team Member";

    if (role.toLowerCase() === "admin") {
      return "Admin";
    }

    return "Team Member";
  };

  const getStatus = (user) => {
    const status = user?.status || "Active";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const getJoinedDate = (user) => {
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

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue);

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

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) => getStatus(user) === "Active"
  ).length;

  const administrators = users.filter(
    (user) => getRole(user) === "Admin"
  ).length;

  const teamMembers = totalMembers - administrators;

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* =========================
            BACKGROUND
        ========================== */}
        <div className="users-page__glow users-page__glow--one" />
        <div className="users-page__glow users-page__glow--two" />

        {/* =========================
            HERO
        ========================== */}
        <section className="users-hero">

          <div className="users-hero__content">

            <div className="users-eyebrow">
              <span className="users-eyebrow__line" />
              WORKSPACE
            </div>

            <h1 className="users-hero__title">
              Team Members
            </h1>

            <p className="users-hero__description">
              Manage and collaborate with everyone
              in your TaskFlow workspace.
            </p>

          </div>

          <button
            type="button"
            className="users-invite-button"
          >
            <span className="users-invite-button__icon">
              <FaUserPlus />
            </span>

            <span>Invite Member</span>

            <span className="users-invite-button__arrow">
              →
            </span>
          </button>

        </section>

        {/* =========================
            STATS
        ========================== */}
        <section className="users-stats">

          <div className="users-stat">
            <div className="users-stat__icon users-stat__icon--purple">
              <FaUsers />
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Total Members
              </span>

              <strong className="users-stat__value">
                {totalMembers}
              </strong>

              <span className="users-stat__hint">
                Workspace members
              </span>
            </div>
          </div>

          <div className="users-stat">
            <div className="users-stat__icon users-stat__icon--green">
              <FaUserCheck />
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Active Members
              </span>

              <strong className="users-stat__value">
                {activeMembers}
              </strong>

              <span className="users-stat__hint">
                Currently active
              </span>
            </div>
          </div>

          <div className="users-stat">
            <div className="users-stat__icon users-stat__icon--violet">
              <FaUserShield />
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Administrators
              </span>

              <strong className="users-stat__value">
                {administrators}
              </strong>

              <span className="users-stat__hint">
                Workspace admins
              </span>
            </div>
          </div>

          <div className="users-stat">
            <div className="users-stat__icon users-stat__icon--blue">
              <FaUserFriends />
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Team Members
              </span>

              <strong className="users-stat__value">
                {teamMembers}
              </strong>

              <span className="users-stat__hint">
                Standard members
              </span>
            </div>
          </div>

        </section>

        {/* =========================
            MEMBERS HEADER
        ========================== */}
        <section className="users-members">

          <div className="users-members__header">

            <div>
              <div className="users-eyebrow users-eyebrow--small">
                <span className="users-eyebrow__line" />
                WORKSPACE MEMBERS
              </div>

              <h2 className="users-members__title">
                Your Team
              </h2>

              <p className="users-members__description">
                View and manage everyone in your
                TaskFlow workspace.
              </p>
            </div>

            <div className="users-members__count">
              <strong>{filteredUsers.length}</strong>
              <span>members</span>
            </div>

          </div>

          {/* =========================
              FILTER BAR
          ========================== */}
          <div className="users-toolbar">

            <div className="users-search">

              <FaSearch className="users-search__icon" />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="users-search__clear"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

            </div>

            <div className="users-filter">

              <FaFilter className="users-filter__icon" />

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

              <FaChevronDown className="users-filter__arrow" />

            </div>

            <div className="users-filter">

              <FaCircle className="users-filter__status-icon" />

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

              <FaChevronDown className="users-filter__arrow" />

            </div>

          </div>

          {/* =========================
              USER GRID
          ========================== */}
          {filteredUsers.length === 0 ? (
            <div className="users-empty">
              <EmptyState title="No Members Found" />
            </div>
          ) : (
            <div className="users-grid">

              {filteredUsers.map((user, index) => {

                const name = getName(user);
                const role = getRole(user);
                const status = getStatus(user);

                return (
                  <article
                    className="user-card"
                    key={user?._id || user?.id || index}
                  >

                    {/* Card top */}
                    <div className="user-card__top">

                      <span className="user-card__number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        className="user-card__menu"
                        aria-label="Member options"
                      >
                        <FaEllipsisV />
                      </button>

                    </div>

                    {/* Avatar */}
                    <div className="user-card__profile">

                      <div className="user-avatar">

                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={name}
                          />
                        ) : (
                          <span>
                            {getInitials(name)}
                          </span>
                        )}

                        <span
                          className={`user-avatar__status ${
                            status === "Active"
                              ? "is-active"
                              : "is-inactive"
                          }`}
                        />

                      </div>

                      <h3 className="user-card__name">
                        {name}
                      </h3>

                      <p className="user-card__email">
                        {user?.email || "No email available"}
                      </p>

                    </div>

                    {/* Divider */}
                    <div className="user-card__divider" />

                    {/* Information */}
                    <div className="user-card__details">

                      <div className="user-card__detail">

                        <span className="user-card__detail-label">
                          ROLE
                        </span>

                        <span
                          className={`user-role ${
                            role === "Admin"
                              ? "user-role--admin"
                              : "user-role--member"
                          }`}
                        >
                          {role === "Admin" && (
                            <FaShieldAlt />
                          )}

                          {role}
                        </span>

                      </div>

                      <div className="user-card__detail">

                        <span className="user-card__detail-label">
                          STATUS
                        </span>

                        <span
                          className={`user-status ${
                            status === "Active"
                              ? "user-status--active"
                              : "user-status--inactive"
                          }`}
                        >
                          <FaCircle />
                          {status}
                        </span>

                      </div>

                      <div className="user-card__detail">

                        <span className="user-card__detail-label">
                          JOINED
                        </span>

                        <span className="user-card__joined">
                          <FaCalendarAlt />
                          {getJoinedDate(user)}
                        </span>

                      </div>

                    </div>

                    {/* Bottom accent */}
                    <div
                      className={`user-card__accent ${
                        role === "Admin"
                          ? "user-card__accent--admin"
                          : ""
                      }`}
                    />

                  </article>
                );
              })}

            </div>
          )}

          {/* =========================
              FOOTER
          ========================== */}
          {filteredUsers.length > 0 && (
            <div className="users-footer">

              <div className="users-footer__secure">
                <span>
                  <FaCheckCircle />
                </span>

                <p>
                  Secure workspace members
                </p>
              </div>

              <span className="users-footer__count">
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