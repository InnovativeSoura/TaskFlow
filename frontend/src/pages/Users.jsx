// src/pages/Users.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaEllipsisV,
  FaCalendarAlt,
  FaCircle,
  FaArrowRight,
  FaTimes,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaUserFriends,
  FaCrown,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Users.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const fallbackUsers = [
  {
    _id: "1",
    name: "InnovativeSoura",
    username: "InnovativeSoura",
    email: "souradipta302@gmail.com",
    role: "member",
    status: "active",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Souradipta Patra",
    username: "souradipta.patra03",
    email: "souradipta.patra03@gmail.com",
    role: "member",
    status: "active",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "Souradipta Patra",
    username: "soura",
    email: "soura@gmail.com",
    role: "admin",
    status: "active",
    createdAt: "2026-07-24T00:00:00.000Z",
  },
];

const normalizeUser = (user, index = 0) => {
  const name =
    user?.name ||
    user?.username ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    `Member ${index + 1}`;

  return {
    ...user,
    _id: user?._id || user?.id || `member-${index + 1}`,
    name,
    username: user?.username || name,
    email: user?.email || "No email available",
    role: String(user?.role || "member").toLowerCase(),
    status: String(user?.status || "active").toLowerCase(),
    createdAt: user?.createdAt || user?.joinedAt || new Date().toISOString(),
  };
};

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

const formatRole = (role) => {
  if (!role) return "Member";

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatStatus = (status) => {
  if (!status) return "Active";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const isActiveUser = (status) => {
  return ["active", "online", "available"].includes(
    String(status || "").toLowerCase()
  );
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const [openMenu, setOpenMenu] = useState(null);
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      setLoading(true);

      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          `${API_URL}/api/users`,
          config
        );

        const payload = response?.data;

        let receivedUsers = [];

        if (Array.isArray(payload)) {
          receivedUsers = payload;
        } else if (Array.isArray(payload?.users)) {
          receivedUsers = payload.users;
        } else if (Array.isArray(payload?.data)) {
          receivedUsers = payload.data;
        }

        if (mounted && receivedUsers.length) {
          setUsers(receivedUsers.map(normalizeUser));
        } else if (mounted) {
          setUsers(fallbackUsers.map(normalizeUser));
        }
      } catch (error) {
        console.warn(
          "Users API could not be loaded. Using local fallback data.",
          error
        );

        if (mounted) {
          setUsers(fallbackUsers.map(normalizeUser));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = users.length;

    const active = users.filter((user) =>
      isActiveUser(user.status)
    ).length;

    const administrators = users.filter((user) =>
      ["admin", "administrator"].includes(
        String(user.role).toLowerCase()
      )
    ).length;

    const teamMembers = users.filter(
      (user) =>
        !["admin", "administrator"].includes(
          String(user.role).toLowerCase()
        )
    ).length;

    return {
      total,
      active,
      administrators,
      teamMembers,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        String(user.role).toLowerCase() === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        String(user.status).toLowerCase() === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleInvite = (event) => {
    event.preventDefault();

    if (!inviteEmail.trim()) {
      setInviteMessage("Please enter an email address.");
      return;
    }

    setInviteMessage(
      `Invitation prepared for ${inviteEmail.trim()}.`
    );

    setInviteEmail("");
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("member");
    setInviteMessage("");
  };

  return (
    <div className="users-page">
      <Sidebar />

      <div className="users-shell">
        <Navbar />

        <main className="users-main">
          {/* =========================================
              PREMIUM HERO
          ========================================= */}
          <motion.section
            className="users-hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="users-hero-glow users-hero-glow-one" />
            <div className="users-hero-glow users-hero-glow-two" />

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
                Manage and collaborate with everyone in your
                TaskFlow workspace.
              </p>

              {/* SHORT PREMIUM INVITE BUTTON */}
              <button
                type="button"
                className="invite-button"
                onClick={() => setShowInviteModal(true)}
              >
                <span className="invite-button-icon">
                  <FaUserPlus />
                </span>

                <span className="invite-button-content">
                  <strong>Invite Member</strong>
                  <small>Add someone to your workspace</small>
                </span>

                <FaArrowRight className="invite-button-arrow" />
              </button>
            </div>

            <div className="hero-team-preview">
              <div className="hero-avatar-stack">
                {users.slice(0, 3).map((user, index) => (
                  <div
                    className="hero-avatar"
                    key={user._id}
                    style={{
                      zIndex: 10 - index,
                    }}
                  >
                    {getInitials(user.name)}
                    <span />
                  </div>
                ))}

                {users.length === 0 && (
                  <>
                    <div className="hero-avatar">SP<span /></div>
                    <div className="hero-avatar">IN<span /></div>
                    <div className="hero-avatar">TF<span /></div>
                  </>
                )}
              </div>

              <div className="hero-team-copy">
                <strong>{stats.total || 0} members</strong>
                <span>working together</span>
              </div>
            </div>
          </motion.section>

          {/* =========================================
              STATISTICS
          ========================================= */}
          <section className="users-stats">
            <StatCard
              icon={<FaUsers />}
              label="TOTAL MEMBERS"
              value={stats.total}
              description="Workspace members"
              accent="purple"
              delay={0}
            />

            <StatCard
              icon={<FaUserCheck />}
              label="ACTIVE MEMBERS"
              value={stats.active}
              description="Currently active"
              accent="green"
              delay={0.05}
            />

            <StatCard
              icon={<FaUserShield />}
              label="ADMINISTRATORS"
              value={stats.administrators}
              description="Workspace admins"
              accent="violet"
              delay={0.1}
            />

            <StatCard
              icon={<FaUserFriends />}
              label="TEAM MEMBERS"
              value={stats.teamMembers}
              description="Standard members"
              accent="blue"
              delay={0.15}
            />
          </section>

          {/* =========================================
              TEAM SECTION
          ========================================= */}
          <section className="team-section">
            <div className="team-section-heading">
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

            {/* FILTER BAR */}
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
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="clear-search"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <div className="filter-wrapper">
                  <button
                    type="button"
                    className={`filter-button ${
                      roleFilter !== "all" ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowRoleFilter((value) => !value);
                      setShowStatusFilter(false);
                    }}
                  >
                    <FaFilter />
                    <span>
                      {roleFilter === "all"
                        ? "All Roles"
                        : formatRole(roleFilter)}
                    </span>
                    <FaChevronDown />
                  </button>

                  <AnimatePresence>
                    {showRoleFilter && (
                      <FilterDropdown
                        values={[
                          ["all", "All Roles"],
                          ["admin", "Administrators"],
                          ["member", "Team Members"],
                        ]}
                        selected={roleFilter}
                        onSelect={(value) => {
                          setRoleFilter(value);
                          setShowRoleFilter(false);
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="filter-wrapper">
                  <button
                    type="button"
                    className={`filter-button ${
                      statusFilter !== "all" ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowStatusFilter((value) => !value);
                      setShowRoleFilter(false);
                    }}
                  >
                    <FaCircle />
                    <span>
                      {statusFilter === "all"
                        ? "All Status"
                        : formatStatus(statusFilter)}
                    </span>
                    <FaChevronDown />
                  </button>

                  <AnimatePresence>
                    {showStatusFilter && (
                      <FilterDropdown
                        values={[
                          ["all", "All Status"],
                          ["active", "Active"],
                          ["inactive", "Inactive"],
                        ]}
                        selected={statusFilter}
                        onSelect={(value) => {
                          setStatusFilter(value);
                          setShowStatusFilter(false);
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* =========================================
                MEMBERS GRID
            ========================================= */}
            <div className="members-grid">
              {loading ? (
                <>
                  {[1, 2, 3].map((item) => (
                    <SkeletonCard key={item} />
                  ))}
                </>
              ) : filteredUsers.length ? (
                filteredUsers.map((user, index) => (
                  <MemberCard
                    key={user._id || index}
                    user={user}
                    index={index}
                    menuOpen={openMenu === user._id}
                    onMenu={() =>
                      setOpenMenu(
                        openMenu === user._id
                          ? null
                          : user._id
                      )
                    }
                    onCloseMenu={() => setOpenMenu(null)}
                  />
                ))
              ) : (
                <EmptyState
                  search={search}
                  onClear={() => {
                    setSearch("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                />
              )}
            </div>

            {!loading && filteredUsers.length > 0 && (
              <div className="team-footer">
                <span>
                  <FaCheckCircle />
                  Secure workspace members
                </span>

                <span>
                  {filteredUsers.length} member
                  {filteredUsers.length !== 1 ? "s" : ""} displayed
                </span>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* =========================================
          INVITE MODAL
      ========================================= */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            className="invite-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeInviteModal();
              }
            }}
          >
            <motion.div
              className="invite-modal"
              initial={{
                opacity: 0,
                y: 24,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 24,
                scale: 0.96,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <div className="invite-modal-glow" />

              <button
                type="button"
                className="modal-close"
                onClick={closeInviteModal}
              >
                <FaTimes />
              </button>

              <div className="modal-icon">
                <FaUserPlus />
              </div>

              <div className="modal-heading">
                <span>TEAM MANAGEMENT</span>
                <h3>Invite a Member</h3>
                <p>
                  Add a new collaborator to your TaskFlow
                  workspace.
                </p>
              </div>

              <form onSubmit={handleInvite}>
                <label>
                  Email address
                  <div className="modal-input">
                    <FaEnvelope />

                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(event) =>
                        setInviteEmail(event.target.value)
                      }
                      placeholder="member@example.com"
                      autoFocus
                    />
                  </div>
                </label>

                <label>
                  Workspace role
                  <div className="modal-input">
                    <FaCrown />

                    <select
                      value={inviteRole}
                      onChange={(event) =>
                        setInviteRole(event.target.value)
                      }
                    >
                      <option value="member">
                        Team Member
                      </option>

                      <option value="admin">
                        Administrator
                      </option>
                    </select>
                  </div>
                </label>

                {inviteMessage && (
                  <div className="invite-message">
                    <FaCheckCircle />
                    {inviteMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="modal-submit"
                >
                  <FaUserPlus />
                  Send Invitation
                  <FaArrowRight />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
  description,
  accent,
  delay,
}) {
  return (
    <motion.div
      className={`stat-card stat-${accent}`}
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
    >
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span className="stat-label">{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>

      <div className="stat-line" />
    </motion.div>
  );
}

/* =====================================================
   FILTER DROPDOWN
===================================================== */

function FilterDropdown({
  values,
  selected,
  onSelect,
}) {
  return (
    <motion.div
      className="filter-dropdown"
      initial={{
        opacity: 0,
        y: -5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -5,
      }}
    >
      {values.map(([value, label]) => (
        <button
          type="button"
          key={value}
          className={selected === value ? "selected" : ""}
          onClick={() => onSelect(value)}
        >
          <span>{label}</span>

          {selected === value && (
            <FaCheckCircle />
          )}
        </button>
      ))}
    </motion.div>
  );
}

/* =====================================================
   MEMBER CARD
===================================================== */

function MemberCard({
  user,
  index,
  menuOpen,
  onMenu,
  onCloseMenu,
}) {
  const active = isActiveUser(user.status);

  const admin = ["admin", "administrator"].includes(
    String(user.role).toLowerCase()
  );

  return (
    <motion.article
      className={`member-card ${
        admin ? "member-card-admin" : ""
      }`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -5,
      }}
    >
      <div className="member-card-glow" />

      <div className="member-card-top">
        <span className="member-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="member-menu-wrapper">
          <button
            type="button"
            className="member-menu"
            onClick={onMenu}
            aria-label="Member options"
          >
            <FaEllipsisV />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="member-menu-dropdown"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: -4,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: -4,
                }}
              >
                <button
                  type="button"
                  onClick={onCloseMenu}
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={onCloseMenu}
                >
                  Message Member
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="member-profile">
        <div className="member-avatar">
          {getInitials(user.name)}

          <span
            className={
              active
                ? "member-online"
                : "member-offline"
            }
          />
        </div>

        <h3>{user.name}</h3>

        <p className="member-email">
          {user.email}
        </p>
      </div>

      <div className="member-divider" />

      <div className="member-details">
        <div className="detail-row">
          <span>ROLE</span>

          <div
            className={`role-badge ${
              admin ? "role-admin" : "role-member"
            }`}
          >
            {admin ? <FaUserShield /> : <FaUsers />}

            {formatRole(user.role)}
          </div>
        </div>

        <div className="detail-row">
          <span>STATUS</span>

          <div
            className={`status-badge ${
              active
                ? "status-active"
                : "status-inactive"
            }`}
          >
            <FaCircle />
            {formatStatus(user.status)}
          </div>
        </div>

        <div className="detail-row">
          <span>JOINED</span>

          <div className="joined-date">
            <FaCalendarAlt />
            {formatDate(user.createdAt)}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function SkeletonCard() {
  return (
    <div className="member-card skeleton-card">
      <div className="skeleton-top" />

      <div className="skeleton-avatar" />

      <div className="skeleton-line skeleton-name" />

      <div className="skeleton-line skeleton-email" />

      <div className="skeleton-divider" />

      <div className="skeleton-detail">
        <span />
        <span />
      </div>

      <div className="skeleton-detail">
        <span />
        <span />
      </div>

      <div className="skeleton-detail">
        <span />
        <span />
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({ search, onClear }) {
  return (
    <motion.div
      className="empty-state"
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <div className="empty-icon">
        <FaUsers />
      </div>

      <h3>No members found</h3>

      <p>
        {search
          ? `No team members match "${search}".`
          : "There are no members matching the selected filters."}
      </p>

      <button
        type="button"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </motion.div>
  );
}

export default Users;