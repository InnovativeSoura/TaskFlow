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
  FaCircle,
  FaCalendarAlt,
  FaEllipsisV,
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

  /* =========================================================
     LOAD USERS
     ========================================================= */

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

  /* =========================================================
     HELPERS
     ========================================================= */

  const getUserName = (user) => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Unknown Member"
    );
  };

  const getUserEmail = (user) => {
    return user?.email || "No email available";
  };

  const getUserRole = (user) => {
    const role = user?.role || "Team Member";

    return role
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getUserStatus = (user) => {
    const status = user?.status || "Active";

    return status
      .toString()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const isAdmin = (user) => {
    const role = (user?.role || "").toLowerCase();

    return (
      role === "admin" ||
      role === "administrator" ||
      role === "owner"
    );
  };

  const isActive = (user) => {
    const status = (user?.status || "Active").toLowerCase();

    return (
      status === "active" ||
      status === "online"
    );
  };

  const formatJoinedDate = (user) => {
    const date =
      user?.createdAt ||
      user?.joinedAt ||
      user?.dateJoined;

    if (!date) return "Workspace Member";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Workspace Member";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* =========================================================
     FILTER OPTIONS
     ========================================================= */

  const roleOptions = useMemo(() => {
    const roles = users
      .map((user) => getUserRole(user))
      .filter(Boolean);

    return [
      "All Roles",
      ...Array.from(new Set(roles)),
    ];
  }, [users]);

  /* =========================================================
     FILTER USERS
     ========================================================= */

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
        email.includes(query) ||
        role.includes(query);

      const matchesRole =
        roleFilter === "All Roles" ||
        role === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        status === statusFilter.toLowerCase();

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

  /* =========================================================
     STATISTICS
     ========================================================= */

  const totalMembers = users.length;

  const activeMembers = users.filter(
    (user) => isActive(user)
  ).length;

  const administrators = users.filter(
    (user) => isAdmin(user)
  ).length;

  const teamMembers = Math.max(
    totalMembers - administrators,
    0
  );

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return <Loader />;
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <MainLayout>
      <div className="users-page">

        {/* =================================================
            PREMIUM HERO
            ================================================= */}

        <section className="users-hero">

          <div className="users-hero-content">

            <div className="users-eyebrow">
              <span className="eyebrow-line"></span>

              <span>
                WORKSPACE
              </span>
            </div>

            <div className="users-title-row">

              <div className="users-title-content">

                <h1>
                  Team Members
                </h1>

                <p>
                  Manage and view everyone in your
                  TaskFlow workspace.
                </p>

              </div>

              <div className="users-hero-decoration">

                <span className="hero-dot dot-one"></span>

                <span className="hero-dot dot-two"></span>

                <span className="hero-dot dot-three"></span>

              </div>

            </div>

          </div>

          <div className="users-hero-glow"></div>

        </section>


        {/* =================================================
            INVITE BAR
            ================================================= */}

        <section className="users-invite-bar">

          <div className="invite-bar-content">

            <div className="invite-icon">
              <FaPlus />
            </div>

            <div>
              <span className="invite-title">
                Grow your workspace
              </span>

              <span className="invite-description">
                Invite teammates and collaborate
                more effectively.
              </span>
            </div>

          </div>

          <button
            type="button"
            className="users-invite-button"
          >
            <FaPlus />

            <span>
              Invite Member
            </span>
          </button>

        </section>


        {/* =================================================
            STATISTICS
            ================================================= */}

        <section className="users-stats">

          <div className="user-stat">

            <div className="user-stat-icon purple">
              <FaUsers />
            </div>

            <div className="user-stat-content">

              <span className="user-stat-label">
                TOTAL MEMBERS
              </span>

              <strong>
                {totalMembers}
              </strong>

              <small>
                Workspace members
              </small>

            </div>

          </div>


          <div className="user-stat">

            <div className="user-stat-icon green">
              <FaUserCheck />
            </div>

            <div className="user-stat-content">

              <span className="user-stat-label">
                ACTIVE MEMBERS
              </span>

              <strong>
                {activeMembers}
              </strong>

              <small>
                Currently active
              </small>

            </div>

          </div>


          <div className="user-stat">

            <div className="user-stat-icon violet">
              <FaUserShield />
            </div>

            <div className="user-stat-content">

              <span className="user-stat-label">
                ADMINISTRATORS
              </span>

              <strong>
                {administrators}
              </strong>

              <small>
                Workspace admins
              </small>

            </div>

          </div>


          <div className="user-stat">

            <div className="user-stat-icon blue">
              <FaUserFriends />
            </div>

            <div className="user-stat-content">

              <span className="user-stat-label">
                TEAM MEMBERS
              </span>

              <strong>
                {teamMembers}
              </strong>

              <small>
                Standard members
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            TEAM SECTION
            ================================================= */}

        <section className="users-team-section">

          <div className="users-section-heading">

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

            <div className="users-result-count">

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


          {/* =================================================
              SEARCH + FILTERS
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

              <FaFilter />

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                aria-label="Filter by role"
              >
                {roleOptions.map((role) => (
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


            <div className="users-filter">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                aria-label="Filter by status"
              >
                <option value="All Status">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <FaChevronDown />

            </div>

          </div>


          {/* =================================================
              EMPTY SEARCH RESULT
              ================================================= */}

          {users.length === 0 ? (

            <EmptyState
              title="No Members Found"
            />

          ) : filteredUsers.length === 0 ? (

            <div className="users-no-results">

              <div className="no-results-icon">
                <FaSearch />
              </div>

              <h3>
                No matching members
              </h3>

              <p>
                Try changing your search or filters.
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

            /* =================================================
               USERS GRID
               ================================================= */

            <div className="users-grid">

              {filteredUsers.map(
                (user, index) => {

                  const name =
                    getUserName(user);

                  const email =
                    getUserEmail(user);

                  const role =
                    getUserRole(user);

                  const status =
                    getUserStatus(user);

                  const active =
                    isActive(user);

                  const admin =
                    isAdmin(user);

                  return (

                    <article
                      className={`user-card ${
                        admin
                          ? "admin-card"
                          : ""
                      }`}
                      key={
                        user?._id ||
                        user?.id ||
                        `${email}-${index}`
                      }
                    >

                      {/* CARD HEADER */}

                      <div className="user-card-header">

                        <span className="member-number">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <button
                          type="button"
                          className="user-card-menu"
                          aria-label={`Options for ${name}`}
                        >
                          <FaEllipsisV />
                        </button>

                      </div>


                      {/* AVATAR */}

                      <div className="user-avatar-wrapper">

                        <div
                          className={`user-avatar ${
                            admin
                              ? "admin-avatar"
                              : ""
                          }`}
                        >

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
                          className={`user-online-dot ${
                            active
                              ? "online"
                              : "offline"
                          }`}
                        />

                      </div>


                      {/* USER IDENTITY */}

                      <div className="user-identity">

                        <h3>
                          {name}
                        </h3>

                        <p>
                          {email}
                        </p>

                      </div>


                      {/* DIVIDER */}

                      <div className="user-card-divider"></div>


                      {/* CARD DETAILS */}

                      <div className="user-card-details">

                        <div className="user-detail-row">

                          <span>
                            ROLE
                          </span>

                          <span
                            className={`user-role ${
                              admin
                                ? "admin-role"
                                : ""
                            }`}
                          >

                            {admin && (
                              <FaShieldAlt />
                            )}

                            {role}

                          </span>

                        </div>


                        <div className="user-detail-row">

                          <span>
                            STATUS
                          </span>

                          <span
                            className={`user-status ${
                              active
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            <FaCircle />

                            {status}

                          </span>

                        </div>


                        <div className="user-detail-row">

                          <span>
                            MEMBER
                          </span>

                          <span className="user-joined">

                            <FaCalendarAlt />

                            {formatJoinedDate(user)}

                          </span>

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          )}


          {/* =================================================
              FOOTER
              ================================================= */}

          {filteredUsers.length > 0 && (

            <div className="users-footer">

              <div className="users-security">

                <span className="security-indicator">
                  <FaCircle />
                </span>

                <span>
                  Secure workspace members
                </span>

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