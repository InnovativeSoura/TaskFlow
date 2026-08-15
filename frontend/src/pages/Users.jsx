import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaUsers,
  FaUserCheck,
  FaUserShield,
  FaUserFriends,
  FaPlus,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaSortAmountDown,
  FaEllipsisV,
  FaCalendarAlt,
  FaUser,
  FaCircle,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Users.css";

/* =========================================================
   FALLBACK DATA
   ---------------------------------------------------------
   Used only when the users API cannot be reached.
   Replace/retain your existing API logic if your project
   already has a dedicated users context/service.
========================================================= */

const FALLBACK_USERS = [
  {
    _id: "fallback-1",
    id: "fallback-1",
    name: "InnovativeSoura",
    username: "InnovativeSoura",
    email: "patsouradipta302@gmail.com",
    role: "Team Member",
    status: "Active",
    createdAt: "2026-07-25T00:00:00.000Z",
    joinedAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "fallback-2",
    id: "fallback-2",
    name: "Souradipta Patra",
    username: "Souradipta Patra",
    email: "souradipta.patra03@gmail.com",
    role: "Team Member",
    status: "Active",
    createdAt: "2026-07-25T00:00:00.000Z",
    joinedAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "fallback-3",
    id: "fallback-3",
    name: "Souradipta Patra",
    username: "Souradipta Patra",
    email: "soura@gmail.com",
    role: "Admin",
    status: "Active",
    createdAt: "2026-07-24T00:00:00.000Z",
    joinedAt: "2026-07-24T00:00:00.000Z",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "U";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const getDisplayName = (user = {}) => {
  return (
    user.name ||
    user.fullName ||
    user.username ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "Unknown User"
  );
};

const getEmail = (user = {}) => {
  return user.email || user.emailAddress || "No email available";
};

const normalizeRole = (role) => {
  const value = String(role || "Team Member").toLowerCase();

  if (
    value === "admin" ||
    value === "administrator" ||
    value === "superadmin" ||
    value === "super admin"
  ) {
    return "Admin";
  }

  return "Team Member";
};

const normalizeStatus = (status) => {
  const value = String(status || "Active").toLowerCase();

  if (
    value === "inactive" ||
    value === "disabled" ||
    value === "deactivated"
  ) {
    return "Inactive";
  }

  if (value === "pending") {
    return "Pending";
  }

  return "Active";
};

const getDateValue = (user = {}) => {
  return (
    user.joinedAt ||
    user.createdAt ||
    user.dateJoined ||
    user.created_at ||
    user.updatedAt ||
    null
  );
};

const formatJoinedDate = (user = {}) => {
  const value = getDateValue(user);

  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeUser = (user, index) => {
  const name = getDisplayName(user);

  return {
    ...user,
    _id: user?._id || user?.id || `user-${index}`,
    name,
    email: getEmail(user),
    role: normalizeRole(user?.role),
    status: normalizeStatus(user?.status),
    joinedAt: getDateValue(user),
  };
};

const getStoredToken = () => {
  const possibleKeys = [
    "token",
    "authToken",
    "accessToken",
    "jwt",
    "userToken",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
};

const extractUsers = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.users)) {
    return responseData.users;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.members)) {
    return responseData.members;
  }

  if (Array.isArray(responseData?.results)) {
    return responseData.results;
  }

  return [];
};

/* =========================================================
   ANIMATION
========================================================= */

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  accent,
  delay = 0,
}) {
  return (
    <motion.div
      className={`users-stat-card ${accent}`}
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{
        y: -5,
        scale: 1.012,
      }}
    >
      <div className="users-stat-icon">{icon}</div>

      <div className="users-stat-content">
        <span className="users-stat-label">{label}</span>

        <strong className="users-stat-value">{value}</strong>

        <span className="users-stat-description">
          {description}
        </span>
      </div>

      <div className="users-stat-accent-line" />
    </motion.div>
  );
}

/* =========================================================
   MEMBER CARD
========================================================= */

function MemberCard({ user, index, onMenu }) {
  const initials = getInitials(user.name);

  return (
    <motion.article
      className="users-member-card"
      variants={itemVariants}
      whileHover={{
        y: -7,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <div className="users-member-card-glow" />

      <div className="users-member-top">
        <span className="users-member-index">
          {String(index + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          className="users-member-menu"
          onClick={() => onMenu(user)}
          aria-label={`Open menu for ${user.name}`}
        >
          <FaEllipsisV />
        </button>
      </div>

      <div className="users-member-profile">
        <motion.div
          className="users-member-avatar"
          whileHover={{
            scale: 1.08,
            rotate: 2,
          }}
        >
          <span>{initials}</span>
          <i />
        </motion.div>

        <h3 className="users-member-name">
          {user.name}
        </h3>

        <p className="users-member-email">
          {user.email}
        </p>
      </div>

      <div className="users-member-divider" />

      <div className="users-member-details">
        <div className="users-member-detail-row">
          <div className="users-detail-label">
            <FaUser />
            <span>Role</span>
          </div>

          <span
            className={`users-role-badge ${
              user.role === "Admin"
                ? "admin"
                : "member"
            }`}
          >
            {user.role === "Admin" && <FaUserShield />}
            {user.role}
          </span>
        </div>

        <div className="users-member-detail-row">
          <div className="users-detail-label">
            <FaCircle />
            <span>Status</span>
          </div>

          <span
            className={`users-status-badge ${
              user.status.toLowerCase()
            }`}
          >
            <i />
            {user.status}
          </span>
        </div>

        <div className="users-member-detail-row">
          <div className="users-detail-label">
            <FaCalendarAlt />
            <span>Joined</span>
          </div>

          <span className="users-joined-date">
            {formatJoinedDate(user)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");

  const [openFilter, setOpenFilter] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  /* =======================================================
     FETCH USERS
  ======================================================= */

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "";

      const token = getStoredToken();

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await axios.get(
        `${baseUrl}/api/users`,
        {
          headers,
          timeout: 12000,
        }
      );

      const extractedUsers = extractUsers(
        response?.data
      );

      if (extractedUsers.length > 0) {
        setUsers(
          extractedUsers.map(normalizeUser)
        );
        setUsingFallback(false);
      } else {
        setUsers(FALLBACK_USERS);
        setUsingFallback(true);
      }
    } catch (error) {
      console.warn(
        "Users API could not be loaded:",
        error
      );

      setUsers(FALLBACK_USERS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) =>
        user.status.toLowerCase() === "active"
    ).length;

    const administrators = users.filter(
      (user) => user.role === "Admin"
    ).length;

    const teamMembers = users.filter(
      (user) => user.role === "Team Member"
    ).length;

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [users]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All Roles" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });

    result = [...result].sort((a, b) => {
      const dateA = new Date(
        getDateValue(a) || 0
      ).getTime();

      const dateB = new Date(
        getDateValue(b) || 0
      ).getTime();

      if (sortBy === "Newest") {
        return dateB - dateA;
      }

      if (sortBy === "Oldest") {
        return dateA - dateB;
      }

      if (sortBy === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "Name Z-A") {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

    return result;
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
    sortBy,
  ]);

  /* =======================================================
     FILTER HANDLERS
  ======================================================= */

  const handleRoleChange = (role) => {
    setRoleFilter(role);
    setOpenFilter(null);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setOpenFilter(null);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setOpenFilter(null);
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setSortBy("Newest");
  };

  /* =======================================================
     MEMBER MENU
  ======================================================= */

  const handleMemberMenu = (user) => {
    setSelectedUser(user);
  };

  /* =======================================================
     INVITE
  ======================================================= */

  const handleInvite = () => {
    toast.info(
      "Invite Member functionality is ready to connect to your invitation flow."
    );
  };

  /* =======================================================
     CLOSE FILTERS WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenFilter(null);
    };

    if (openFilter) {
      document.addEventListener(
        "click",
        handleDocumentClick
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick
      );
    };
  }, [openFilter]);

  return (
    <div className="users-layout">
      <Sidebar />

      <div className="users-main-shell">
        <Navbar />

        <main className="users-page">
          <div className="users-background">
            <div className="users-bg-grid" />
            <div className="users-bg-orb users-bg-orb-one" />
            <div className="users-bg-orb users-bg-orb-two" />
            <div className="users-bg-glow users-bg-glow-one" />
            <div className="users-bg-glow users-bg-glow-two" />
          </div>

          <motion.div
            className="users-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* =================================================
                HERO
            ================================================= */}

            <motion.section
              className="users-hero"
              variants={itemVariants}
            >
              <div className="users-hero-decoration" />

              <div className="users-hero-content">
                <div className="users-eyebrow">
                  <span className="users-eyebrow-dot">
                    <i />
                  </span>

                  <span>WORKSPACE</span>
                </div>

                <h1 className="users-hero-title">
                  Team{" "}
                  <span>Members</span>
                </h1>

                <p className="users-hero-description">
                  Manage and collaborate with everyone in
                  your TaskFlow workspace.
                </p>

                <button
                  type="button"
                  className="invite-member-btn"
                  onClick={handleInvite}
                >
                  <FaPlus />

                  <span>Invite Member</span>

                  <FaArrowRight />
                </button>
              </div>

              <div className="users-hero-members">
                <div className="users-avatar-stack">
                  {users.slice(0, 4).map(
                    (user, index) => (
                      <div
                        className="users-stack-avatar"
                        key={
                          user._id ||
                          user.id ||
                          index
                        }
                        style={{
                          zIndex: 10 - index,
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                    )
                  )}
                </div>

                <div className="users-hero-member-count">
                  <strong>
                    {stats.total}{" "}
                    {stats.total === 1
                      ? "member"
                      : "members"}
                  </strong>

                  <span>Workspace</span>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="users-stats-grid">
              <StatCard
                icon={<FaUsers />}
                label="Total Members"
                value={stats.total}
                description="Workspace members"
                accent="purple"
              />

              <StatCard
                icon={<FaUserCheck />}
                label="Active Members"
                value={stats.active}
                description="Currently active"
                accent="green"
              />

              <StatCard
                icon={<FaUserShield />}
                label="Administrators"
                value={stats.administrators}
                description="Workspace admins"
                accent="violet"
              />

              <StatCard
                icon={<FaUserFriends />}
                label="Team Members"
                value={stats.teamMembers}
                description="Standard members"
                accent="blue"
              />
            </section>

            {/* =================================================
                MEMBERS HEADER
            ================================================= */}

            <motion.section
              className="users-members-section"
              variants={itemVariants}
            >
              <div className="users-section-header">
                <div>
                  <div className="users-section-eyebrow">
                    WORKSPACE MEMBERS
                  </div>

                  <h2>Your Team</h2>

                  <p>
                    View and manage everyone in your
                    TaskFlow workspace.
                  </p>
                </div>

                <div className="users-result-count">
                  <FaUsers />

                  <span>
                    {filteredUsers.length}{" "}
                    {filteredUsers.length === 1
                      ? "member"
                      : "members"}
                  </span>
                </div>
              </div>

              {/* =================================================
                  TOOLBAR
              ================================================= */}

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
                      className="users-search-clear"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* ROLE */}

                <div
                  className={`users-filter-dropdown ${
                    openFilter === "role"
                      ? "open"
                      : ""
                  }`}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <button
                    type="button"
                    className="users-filter-btn"
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "role"
                          ? null
                          : "role"
                      )
                    }
                  >
                    <FaFilter />

                    <span>{roleFilter}</span>

                    <FaChevronDown />
                  </button>

                  <AnimatePresence>
                    {openFilter === "role" && (
                      <motion.div
                        className="users-filter-menu"
                        initial={{
                          opacity: 0,
                          y: -6,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                        }}
                      >
                        {[
                          "All Roles",
                          "Admin",
                          "Team Member",
                        ].map((role) => (
                          <button
                            type="button"
                            key={role}
                            className={
                              roleFilter === role
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              handleRoleChange(
                                role
                              )
                            }
                          >
                            {role}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* STATUS */}

                <div
                  className={`users-filter-dropdown ${
                    openFilter === "status"
                      ? "open"
                      : ""
                  }`}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <button
                    type="button"
                    className="users-filter-btn"
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "status"
                          ? null
                          : "status"
                      )
                    }
                  >
                    <FaCircle />

                    <span>{statusFilter}</span>

                    <FaChevronDown />
                  </button>

                  <AnimatePresence>
                    {openFilter === "status" && (
                      <motion.div
                        className="users-filter-menu"
                        initial={{
                          opacity: 0,
                          y: -6,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                        }}
                      >
                        {[
                          "All Status",
                          "Active",
                          "Inactive",
                          "Pending",
                        ].map((status) => (
                          <button
                            type="button"
                            key={status}
                            className={
                              statusFilter ===
                              status
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(
                                status
                              )
                            }
                          >
                            {status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SORT */}

                <div
                  className={`users-filter-dropdown ${
                    openFilter === "sort"
                      ? "open"
                      : ""
                  }`}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <button
                    type="button"
                    className="users-filter-btn"
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "sort"
                          ? null
                          : "sort"
                      )
                    }
                  >
                    <FaSortAmountDown />

                    <span>Sort By</span>

                    <FaChevronDown />
                  </button>

                  <AnimatePresence>
                    {openFilter === "sort" && (
                      <motion.div
                        className="users-filter-menu"
                        initial={{
                          opacity: 0,
                          y: -6,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                        }}
                      >
                        {[
                          "Newest",
                          "Oldest",
                          "Name A-Z",
                          "Name Z-A",
                        ].map((sort) => (
                          <button
                            type="button"
                            key={sort}
                            className={
                              sortBy === sort
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              handleSortChange(
                                sort
                              )
                            }
                          >
                            {sort}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {(search ||
                  roleFilter !== "All Roles" ||
                  statusFilter !== "All Status" ||
                  sortBy !== "Newest") && (
                  <button
                    type="button"
                    className="users-clear-filters"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  className="users-refresh-btn"
                  onClick={fetchUsers}
                  disabled={loading}
                  aria-label="Refresh users"
                  title="Refresh users"
                >
                  <FaSyncAlt
                    className={
                      loading
                        ? "users-spin"
                        : ""
                    }
                  />
                </button>
              </div>

              {/* =================================================
                  MEMBER GRID
              ================================================= */}

              {loading ? (
                <div className="users-loading-grid">
                  {[1, 2, 3].map((item) => (
                    <div
                      className="users-loading-card"
                      key={item}
                    >
                      <div className="users-skeleton users-skeleton-small" />
                      <div className="users-skeleton users-skeleton-avatar" />
                      <div className="users-skeleton users-skeleton-name" />
                      <div className="users-skeleton users-skeleton-email" />
                      <div className="users-skeleton users-skeleton-line" />
                      <div className="users-skeleton users-skeleton-line" />
                      <div className="users-skeleton users-skeleton-line" />
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="users-members-grid">
                  {filteredUsers.map(
                    (user, index) => (
                      <MemberCard
                        key={
                          user._id ||
                          user.id ||
                          `${user.email}-${index}`
                        }
                        user={user}
                        index={index}
                        onMenu={
                          handleMemberMenu
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <motion.div
                  className="users-empty-state"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="users-empty-icon">
                    <FaUsers />
                  </div>

                  <h3>No members found</h3>

                  <p>
                    Try changing your search or
                    filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}

              {/* =================================================
                  FOOTER
              ================================================= */}

              {!loading &&
                filteredUsers.length > 0 && (
                  <div className="users-footer">
                    <span>
                      Showing{" "}
                      <strong>
                        1 to {filteredUsers.length}
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {filteredUsers.length}
                      </strong>{" "}
                      members
                    </span>

                    <div className="users-pagination">
                      <button
                        type="button"
                        disabled
                        aria-label="Previous page"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="active"
                      >
                        1
                      </button>

                      <button
                        type="button"
                        disabled
                        aria-label="Next page"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                )}

              {usingFallback && !loading && (
                <div className="users-api-notice">
                  Showing workspace members from the
                  available local fallback because the
                  users API could not be loaded.
                </div>
              )}
            </motion.section>
          </motion.div>
        </main>
      </div>

      {/* =====================================================
          MEMBER MENU MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="users-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelectedUser(null)
            }
          >
            <motion.div
              className="users-member-modal"
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className="users-modal-close"
                onClick={() =>
                  setSelectedUser(null)
                }
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <div className="users-modal-avatar">
                {getInitials(
                  selectedUser.name
                )}
              </div>

              <h3>{selectedUser.name}</h3>

              <p>{selectedUser.email}</p>

              <div className="users-modal-info">
                <span>
                  Role
                  <strong>
                    {selectedUser.role}
                  </strong>
                </span>

                <span>
                  Status
                  <strong>
                    {selectedUser.status}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                className="users-modal-action"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}