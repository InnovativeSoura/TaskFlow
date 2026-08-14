import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import "../styles/Users.css";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "U";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const getStatus = (user) => {
  const status = String(user?.status || "Active").toLowerCase();

  if (
    status === "inactive" ||
    status === "disabled" ||
    status === "suspended"
  ) {
    return "Inactive";
  }

  return "Active";
};

const getRole = (user) => {
  const role = String(user?.role || "Team Member");

  if (role.toLowerCase() === "admin") {
    return "Admin";
  }

  return "Team Member";
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => getStatus(user) === "Active"
    ).length;

    const admins = users.filter(
      (user) => getRole(user) === "Admin"
    ).length;

    const members = users.filter(
      (user) => getRole(user) === "Team Member"
    ).length;

    return {
      total,
      active,
      admins,
      members,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = String(user?.name || "").toLowerCase();
      const email = String(user?.email || "").toLowerCase();

      const role = getRole(user);
      const status = getStatus(user);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="users-page">

        {/* =========================================
            BACKGROUND DECORATION
        ========================================= */}
        <div className="users-page__glow users-page__glow--one" />
        <div className="users-page__glow users-page__glow--two" />

        {/* =========================================
            HEADER
        ========================================= */}
        <section className="users-hero">

          <div className="users-hero__content">

            <div className="users-eyebrow">
              <span className="users-eyebrow__line" />
              <span>WORKSPACE</span>
            </div>

            <h1 className="users-hero__title">
              Team Members
            </h1>

            <p className="users-hero__description">
              Manage and view everyone in your
              TaskFlow workspace.
            </p>

          </div>

          <button
            type="button"
            className="users-invite-btn"
          >
            <span className="users-invite-btn__icon">
              +
            </span>

            <span>Invite Member</span>
          </button>

        </section>

        {/* =========================================
            STATISTICS
        ========================================= */}
        <section className="users-stats">

          <div className="users-stat">

            <div className="users-stat__icon">
              👥
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Total Members
              </span>

              <strong className="users-stat__value">
                {statistics.total}
              </strong>

              <span className="users-stat__hint">
                Workspace members
              </span>
            </div>

          </div>

          <div className="users-stat">

            <div className="users-stat__icon users-stat__icon--green">
              ●
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Active Members
              </span>

              <strong className="users-stat__value">
                {statistics.active}
              </strong>

              <span className="users-stat__hint">
                Currently active
              </span>
            </div>

          </div>

          <div className="users-stat">

            <div className="users-stat__icon users-stat__icon--purple">
              ★
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Administrators
              </span>

              <strong className="users-stat__value">
                {statistics.admins}
              </strong>

              <span className="users-stat__hint">
                Workspace admins
              </span>
            </div>

          </div>

          <div className="users-stat">

            <div className="users-stat__icon users-stat__icon--blue">
              ✓
            </div>

            <div className="users-stat__content">
              <span className="users-stat__label">
                Team Members
              </span>

              <strong className="users-stat__value">
                {statistics.members}
              </strong>

              <span className="users-stat__hint">
                Standard members
              </span>
            </div>

          </div>

        </section>

        {/* =========================================
            MEMBERS SECTION
        ========================================= */}
        <section className="users-section">

          <div className="users-section__header">

            <div>
              <div className="users-section__eyebrow">
                WORKSPACE MEMBERS
              </div>

              <h2 className="users-section__title">
                Your Team
              </h2>

              <p className="users-section__subtitle">
                View and manage everyone in your
                TaskFlow workspace.
              </p>
            </div>

            <div className="users-section__count">
              {filteredUsers.length}
              <span>
                {filteredUsers.length === 1
                  ? " member"
                  : " members"}
              </span>
            </div>

          </div>

          {/* =========================================
              FILTERS
          ========================================= */}
          <div className="users-toolbar">

            <div className="users-search">

              <span className="users-search__icon">
                ⌕
              </span>

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
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

            <select
              className="users-filter"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >
              <option value="All">
                All Roles
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Team Member">
                Team Member
              </option>
            </select>

            <select
              className="users-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
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

          {/* =========================================
              EMPTY SEARCH RESULT
          ========================================= */}
          {users.length === 0 ? (
            <EmptyState title="No Members Found" />
          ) : filteredUsers.length === 0 ? (
            <div className="users-no-results">

              <div className="users-no-results__icon">
                ⌕
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
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>

            </div>
          ) : (
            <div className="users-grid">

              {filteredUsers.map((user, index) => {
                const name =
                  user?.name || "Unknown User";

                const email =
                  user?.email || "No email available";

                const role = getRole(user);
                const status = getStatus(user);

                return (
                  <article
                    className="users-card"
                    key={
                      user?._id ||
                      user?.id ||
                      `${email}-${index}`
                    }
                  >

                    {/* CARD TOP */}
                    <div className="users-card__top">

                      <span className="users-card__number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <button
                        type="button"
                        className="users-card__menu"
                        aria-label={`Options for ${name}`}
                      >
                        ⋮
                      </button>

                    </div>

                    {/* AVATAR */}
                    <div className="users-card__avatar-wrap">

                      <div className="users-card__avatar">

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

                      </div>

                      <span
                        className={`users-card__presence ${
                          status === "Active"
                            ? "users-card__presence--active"
                            : "users-card__presence--inactive"
                        }`}
                      />
                    </div>

                    {/* USER INFO */}
                    <div className="users-card__identity">

                      <h3>
                        {name}
                      </h3>

                      <p>
                        {email}
                      </p>

                    </div>

                    {/* DETAILS */}
                    <div className="users-card__details">

                      <div className="users-card__detail">

                        <span className="users-card__detail-label">
                          ROLE
                        </span>

                        <span
                          className={`users-card__role ${
                            role === "Admin"
                              ? "users-card__role--admin"
                              : ""
                          }`}
                        >
                          {role === "Admin" && "★ "}
                          {role}
                        </span>

                      </div>

                      <div className="users-card__detail">

                        <span className="users-card__detail-label">
                          STATUS
                        </span>

                        <span
                          className={`users-card__status ${
                            status === "Active"
                              ? "users-card__status--active"
                              : "users-card__status--inactive"
                          }`}
                        >
                          <span className="users-card__status-dot" />
                          {status}
                        </span>

                      </div>

                      <div className="users-card__detail">

                        <span className="users-card__detail-label">
                          MEMBER
                        </span>

                        <span className="users-card__member-type">
                          Workspace Member
                        </span>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

          {/* =========================================
              FOOTER
          ========================================= */}
          {filteredUsers.length > 0 && (
            <div className="users-footer">

              <div className="users-footer__secure">
                <span className="users-footer__dot" />
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