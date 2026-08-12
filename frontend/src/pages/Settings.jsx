import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaChartBar,
  FaCheck,
  FaChevronRight,
  FaCog,
  FaFolder,
  FaInfoCircle,
  FaKanban,
  FaLock,
  FaMoon,
  FaPalette,
  FaRedo,
  FaSave,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaSun,
  FaTasks,
  FaTimes,
  FaUser,
  FaUsers,
  FaEnvelope,
  FaEdit,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

const SETTINGS_ITEMS = [
  {
    id: "account",
    title: "Account",
    description: "Your profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your workspace",
    icon: FaPalette,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage your alerts",
    icon: FaBell,
  },
  {
    id: "security",
    title: "Security",
    description: "Password and security",
    icon: FaLock,
  },
  {
    id: "application",
    title: "Application",
    description: "TaskFlow information",
    icon: FaInfoCircle,
  },
];

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "TF";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getUserName = (user) =>
  user?.name ||
  user?.username ||
  user?.fullName ||
  "Souradipta Patra";

const getUserEmail = (user) =>
  user?.email ||
  user?.emailAddress ||
  "soura@gmail.com";

const getUserRole = (user) =>
  user?.role ||
  user?.userRole ||
  "Admin";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const [activeSection, setActiveSection] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: userName,
    email: userEmail,
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saveMessage, setSaveMessage] = useState(
    "All changes are currently saved"
  );

  const [passwordMessage, setPasswordMessage] = useState("");

  const activeItem =
    SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
    SETTINGS_ITEMS[0];

  const ActiveIcon = activeItem.icon;

  const handleSettingChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setSaveMessage("You have unsaved changes");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setProfile({
      name: userName,
      email: userEmail,
    });

    setSaveMessage("All changes are currently saved");
    setPasswordMessage("");
  };

  const handleSave = () => {
    setSaveMessage("All changes are currently saved");

    setTimeout(() => {
      setSaveMessage("All changes are currently saved");
    }, 500);
  };

  const openEditProfile = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
    });

    setEditProfileOpen(true);
    setProfileMenuOpen(false);
  };

  const handleProfileSave = (event) => {
    event.preventDefault();

    if (!editForm.name.trim() || !editForm.email.trim()) {
      return;
    }

    setProfile({
      name: editForm.name.trim(),
      email: editForm.email.trim(),
    });

    setEditProfileOpen(false);
    setSaveMessage("Profile changes are ready to save");
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      passwordFields;

    if (!currentPassword) {
      setPasswordMessage("Enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setPasswordMessage("Password validated successfully.");
    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) return;

    const value = searchValue.toLowerCase();

    if (value.includes("project")) {
      navigate("/projects");
    } else if (value.includes("task")) {
      navigate("/tasks");
    } else if (value.includes("team") || value.includes("user")) {
      navigate("/users");
    }
  };

  return (
    <div className="settings-app">
      {/* =========================
          TOP NAVBAR
      ========================== */}
      <header className="settings-navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="navbar-menu-button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <button
            type="button"
            className="navbar-brand"
            onClick={() => navigate("/dashboard")}
          >
            <span className="navbar-brand-icon">
              TF
              <span className="brand-status-dot" />
            </span>

            <span className="navbar-brand-text">
              <strong>TaskFlow</strong>
              <small>Workspace</small>
            </span>
          </button>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FaSearch />

          <input
            type="text"
            placeholder="Search projects, tasks, teams..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <span className="search-shortcut">Ctrl + K</span>
        </form>

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-icon-button theme-button"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                darkMode: !prev.darkMode,
              }))
            }
            aria-label="Toggle theme"
          >
            {settings.darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button
            type="button"
            className="navbar-icon-button notification-button"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <FaBell />
            <span className="notification-count">3</span>
          </button>

          <button
            type="button"
            className="navbar-icon-button"
            onClick={() => setActiveSection("application")}
            aria-label="Application settings"
          >
            <FaCog />
          </button>

          <div className="navbar-profile-wrapper">
            <button
              type="button"
              className="navbar-profile"
              onClick={() =>
                setProfileMenuOpen((prev) => !prev)
              }
            >
              <span className="navbar-avatar">
                {initials}
                <span />
              </span>

              <span className="navbar-profile-info">
                <strong>{profile.name}</strong>
                <small>{userRole}</small>
              </span>

              <FaChevronRight
                className={`profile-chevron ${
                  profileMenuOpen ? "open" : ""
                }`}
              />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <button
                  type="button"
                  onClick={openEditProfile}
                >
                  <FaUser />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("account")}
                >
                  <FaCog />
                  Settings
                </button>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`settings-sidebar ${
          sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
      >
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {initials}
            <span />
          </div>

          {sidebarOpen && (
            <div className="sidebar-profile-details">
              <strong>{profile.name}</strong>
              <small>{userRole}</small>
            </div>
          )}

          {sidebarOpen && (
            <FaChevronRight className="sidebar-profile-arrow" />
          )}
        </div>

        {sidebarOpen && (
          <div className="sidebar-label">WORKSPACE</div>
        )}

        <nav className="sidebar-navigation">
          <NavLink to="/dashboard" className="sidebar-link">
            <FaChartBar />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/projects" className="sidebar-link">
            <FaFolder />
            {sidebarOpen && <span>Projects</span>}
          </NavLink>

          <NavLink to="/tasks" className="sidebar-link">
            <FaTasks />
            {sidebarOpen && <span>Tasks</span>}
          </NavLink>

          <NavLink to="/kanban" className="sidebar-link">
            <FaKanban />
            {sidebarOpen && <span>Kanban</span>}
          </NavLink>

          <NavLink to="/users" className="sidebar-link">
            <FaUsers />
            {sidebarOpen && <span>Users</span>}
          </NavLink>

          <NavLink to="/reports" className="sidebar-link">
            <FaChartBar />
            {sidebarOpen && <span>Reports</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaCog />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>

          <NavLink
            to="/notifications"
            className="sidebar-link"
          >
            <FaBell />
            {sidebarOpen && <span>Notifications</span>}
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          {sidebarOpen && (
            <div className="sidebar-security-card">
              <div className="security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>
                <span>Your TaskFlow account is secure.</span>
              </div>

              <FaCheck className="security-check" />
            </div>
          )}

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main
        className={`settings-main ${
          sidebarOpen ? "main-sidebar-open" : "main-sidebar-closed"
        }`}
      >
        <div className="settings-page">
          {/* Page heading */}
          <div className="settings-heading">
            <div>
              <div className="settings-breadcrumb">
                WORKSPACE
                <FaChevronRight />
                <span>SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences,
                notifications and security.
              </p>
            </div>

            <div className="workspace-secure">
              <FaShieldAlt />
              <span>Workspace secure</span>
            </div>
          </div>

          {/* Settings Card */}
          <section className="settings-card">
            {/* Left settings navigation */}
            <aside className="settings-menu">
              <div className="settings-menu-label">
                SETTINGS
              </div>

              <div className="settings-menu-list">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`settings-menu-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() =>
                        setActiveSection(item.id)
                      }
                    >
                      <span className="settings-menu-icon">
                        <Icon />
                      </span>

                      <span className="settings-menu-content">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>

                      <FaChevronRight />
                    </button>
                  );
                })}
              </div>

              <div className="settings-menu-security">
                <div className="settings-menu-security-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>Protected workspace</strong>
                  <span>Your TaskFlow account is secure.</span>
                </div>

                <FaCheck />
              </div>
            </aside>

            {/* Right content */}
            <section className="settings-content">
              <div className="settings-content-header">
                <div>
                  <span className="section-kicker">
                    {activeItem.title.toUpperCase()}
                  </span>

                  <h2>
                    {activeSection === "account" &&
                      "Account information"}

                    {activeSection === "appearance" &&
                      "Appearance"}

                    {activeSection === "notifications" &&
                      "Notification preferences"}

                    {activeSection === "security" &&
                      "Security & password"}

                    {activeSection === "application" &&
                      "TaskFlow information"}
                  </h2>

                  <p>
                    {activeSection === "account" &&
                      "Manage your personal identity and TaskFlow workspace information."}

                    {activeSection === "appearance" &&
                      "Customize the visual experience of your TaskFlow workspace."}

                    {activeSection === "notifications" &&
                      "Control which notifications TaskFlow sends to you."}

                    {activeSection === "security" &&
                      "Manage your password and account security preferences."}

                    {activeSection === "application" &&
                      "Information about your TaskFlow application and current environment."}
                  </p>
                </div>

                <div className="content-header-icon">
                  <ActiveIcon />
                </div>
              </div>

              {/* ACCOUNT */}
              {activeSection === "account" && (
                <div className="settings-section-body">
                  <div className="profile-card">
                    <div className="profile-card-left">
                      <div className="large-avatar">
                        {getInitials(profile.name)}
                        <span />
                      </div>

                      <div className="profile-card-info">
                        <div className="profile-name-row">
                          <h3>{profile.name}</h3>

                          <span className="role-badge">
                            {userRole}
                          </span>
                        </div>

                        <p>{profile.email}</p>

                        <div className="profile-statuses">
                          <span>
                            <i />
                            Active account
                          </span>

                          <span className="status-separator">
                            |
                          </span>

                          <span>
                            <FaShieldAlt />
                            Protected workspace
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FIXED EDIT PROFILE BUTTON */}
                    <button
                      type="button"
                      className="edit-profile-button"
                      onClick={openEditProfile}
                    >
                      <FaEdit />
                      <span>Edit profile</span>
                    </button>
                  </div>

                  <div className="account-grid">
                    <div className="information-card">
                      <div className="information-icon purple">
                        <FaUser />
                      </div>

                      <div>
                        <span>FULL NAME</span>
                        <strong>{profile.name}</strong>
                      </div>
                    </div>

                    <div className="information-card">
                      <div className="information-icon blue">
                        <FaEnvelope />
                      </div>

                      <div>
                        <span>EMAIL ADDRESS</span>
                        <strong>{profile.email}</strong>
                      </div>
                    </div>

                    <div className="information-card">
                      <div className="information-icon purple">
                        <FaShieldAlt />
                      </div>

                      <div>
                        <span>ROLE</span>
                        <strong>{userRole}</strong>
                      </div>
                    </div>

                    <div className="information-card">
                      <div className="information-icon green">
                        <FaCheck />
                      </div>

                      <div>
                        <span>ACCOUNT STATUS</span>
                        <strong className="active-text">
                          Active
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="protected-workspace">
                    <div className="protected-icon">
                      <FaShieldAlt />
                    </div>

                    <div>
                      <h3>Protected workspace</h3>
                      <p>
                        Your TaskFlow account information is
                        securely associated with your workspace.
                      </p>
                    </div>

                    <FaCheck className="protected-check" />
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {activeSection === "appearance" && (
                <div className="settings-section-body">
                  <div className="preference-card">
                    <div className="preference-card-icon">
                      {settings.darkMode ? (
                        <FaMoon />
                      ) : (
                        <FaSun />
                      )}
                    </div>

                    <div className="preference-card-content">
                      <h3>Interface theme</h3>
                      <p>
                        Choose how TaskFlow looks on your
                        device.
                      </p>

                      <div className="theme-options">
                        <button
                          type="button"
                          className={`theme-option ${
                            !settings.darkMode
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              darkMode: false,
                            }))
                          }
                        >
                          <FaSun />
                          <span>Light</span>
                          {!settings.darkMode && (
                            <FaCheck />
                          )}
                        </button>

                        <button
                          type="button"
                          className={`theme-option ${
                            settings.darkMode
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              darkMode: true,
                            }))
                          }
                        >
                          <FaMoon />
                          <span>Dark</span>
                          {settings.darkMode && (
                            <FaCheck />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="protected-workspace">
                    <div className="protected-icon">
                      <FaPalette />
                    </div>

                    <div>
                      <h3>Personalized workspace</h3>
                      <p>
                        Your visual preferences are stored
                        with your TaskFlow workspace.
                      </p>
                    </div>

                    <FaCheck className="protected-check" />
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <div className="settings-section-body">
                  <div className="toggle-list">
                    <div className="toggle-card">
                      <div className="toggle-icon">
                        <FaEnvelope />
                      </div>

                      <div className="toggle-content">
                        <h3>Email notifications</h3>
                        <p>
                          Receive important TaskFlow updates
                          through email.
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`toggle-switch ${
                          settings.emailNotifications
                            ? "enabled"
                            : ""
                        }`}
                        onClick={() =>
                          handleSettingChange(
                            "emailNotifications"
                          )
                        }
                      >
                        <span />
                      </button>
                    </div>

                    <div className="toggle-card">
                      <div className="toggle-icon">
                        <FaTasks />
                      </div>

                      <div className="toggle-content">
                        <h3>Task notifications</h3>
                        <p>
                          Get notified when tasks are assigned,
                          updated or completed.
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`toggle-switch ${
                          settings.taskNotifications
                            ? "enabled"
                            : ""
                        }`}
                        onClick={() =>
                          handleSettingChange(
                            "taskNotifications"
                          )
                        }
                      >
                        <span />
                      </button>
                    </div>

                    <div className="toggle-card">
                      <div className="toggle-icon">
                        <FaFolder />
                      </div>

                      <div className="toggle-content">
                        <h3>Project notifications</h3>
                        <p>
                          Receive updates about your projects
                          and workspace activity.
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`toggle-switch ${
                          settings.projectNotifications
                            ? "enabled"
                            : ""
                        }`}
                        onClick={() =>
                          handleSettingChange(
                            "projectNotifications"
                          )
                        }
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <div className="settings-section-body">
                  <form
                    className="security-form"
                    onSubmit={handlePasswordChange}
                  >
                    <div className="security-intro">
                      <div className="security-intro-icon">
                        <FaLock />
                      </div>

                      <div>
                        <h3>Change password</h3>
                        <p>
                          Keep your TaskFlow account secure with
                          a strong password.
                        </p>
                      </div>
                    </div>

                    <div className="password-grid">
                      <label>
                        <span>Current password</span>
                        <input
                          type="password"
                          value={
                            passwordFields.currentPassword
                          }
                          onChange={(event) =>
                            setPasswordFields((prev) => ({
                              ...prev,
                              currentPassword:
                                event.target.value,
                            }))
                          }
                          placeholder="Enter current password"
                        />
                      </label>

                      <label>
                        <span>New password</span>
                        <input
                          type="password"
                          value={
                            passwordFields.newPassword
                          }
                          onChange={(event) =>
                            setPasswordFields((prev) => ({
                              ...prev,
                              newPassword:
                                event.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                      </label>

                      <label className="full-width">
                        <span>Confirm new password</span>
                        <input
                          type="password"
                          value={
                            passwordFields.confirmPassword
                          }
                          onChange={(event) =>
                            setPasswordFields((prev) => ({
                              ...prev,
                              confirmPassword:
                                event.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                        />
                      </label>
                    </div>

                    {passwordMessage && (
                      <div className="password-message">
                        <FaInfoCircle />
                        {passwordMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="security-submit"
                    >
                      <FaLock />
                      Update password
                    </button>
                  </form>

                  <div className="protected-workspace">
                    <div className="protected-icon">
                      <FaShieldAlt />
                    </div>

                    <div>
                      <h3>Account protection enabled</h3>
                      <p>
                        Your workspace is protected by TaskFlow
                        security controls.
                      </p>
                    </div>

                    <FaCheck className="protected-check" />
                  </div>
                </div>
              )}

              {/* APPLICATION */}
              {activeSection === "application" && (
                <div className="settings-section-body">
                  <div className="application-brand-card">
                    <div className="application-logo">
                      TF
                    </div>

                    <div className="application-brand-info">
                      <span>PROJECT MANAGEMENT PLATFORM</span>
                      <h3>TaskFlow</h3>
                      <p>
                        A modern workspace for managing
                        projects, tasks, teams and productivity.
                      </p>
                    </div>

                    <div className="application-version">
                      <span>VERSION</span>
                      <strong>1.0.0</strong>
                    </div>
                  </div>

                  <div className="application-grid">
                    <div className="application-info">
                      <span>PLATFORM</span>
                      <strong>Web Application</strong>
                      <FaCheck />
                    </div>

                    <div className="application-info">
                      <span>ENVIRONMENT</span>
                      <strong>Production</strong>
                      <FaCheck />
                    </div>

                    <div className="application-info">
                      <span>BACKEND</span>
                      <strong>Node.js / Express</strong>
                      <FaCheck />
                    </div>

                    <div className="application-info">
                      <span>DATABASE</span>
                      <strong>MongoDB</strong>
                      <FaCheck />
                    </div>

                    <div className="application-info">
                      <span>FRONTEND</span>
                      <strong>React + Vite</strong>
                      <FaCheck />
                    </div>

                    <div className="application-info">
                      <span>SYSTEM STATUS</span>
                      <strong className="active-text">
                        Operational
                      </strong>
                      <FaCheck />
                    </div>
                  </div>

                  <div className="about-taskflow">
                    <div>
                      <FaInfoCircle />
                    </div>

                    <div>
                      <h3>About TaskFlow</h3>
                      <p>
                        TaskFlow is designed to provide a
                        centralized, organized and secure
                        environment for modern project
                        management.
                      </p>
                    </div>

                    <span className="operational-badge">
                      <i />
                      Operational
                    </span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="settings-footer">
                <div className="save-status">
                  <span
                    className={
                      saveMessage.includes("unsaved")
                        ? "unsaved-dot"
                        : ""
                    }
                  />

                  <div>
                    <strong>{saveMessage}</strong>
                    <small>
                      Your workspace preferences stay
                      organized and protected.
                    </small>
                  </div>
                </div>

                <div className="footer-actions">
                  <button
                    type="button"
                    className="reset-button"
                    onClick={handleReset}
                  >
                    <FaRedo />
                    Reset
                  </button>

                  <button
                    type="button"
                    className="save-button"
                    onClick={handleSave}
                  >
                    <FaSave />
                    Save changes
                  </button>
                </div>
              </div>
            </section>
          </section>

          {/* Bottom secure information */}
          <div className="secure-information">
            <div className="secure-information-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>
                Your preferences are stored securely
              </strong>

              <p>
                TaskFlow keeps your workspace settings
                organized and protected.
              </p>
            </div>

            <span>
              <FaLock />
              Secure
            </span>
          </div>
        </div>
      </main>

      {/* =========================
          EDIT PROFILE MODAL
      ========================== */}
      {editProfileOpen && (
        <div
          className="profile-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditProfileOpen(false);
            }
          }}
        >
          <div className="profile-modal">
            <div className="profile-modal-header">
              <div>
                <span>PROFILE</span>
                <h2>Edit profile</h2>
                <p>
                  Update your TaskFlow account information.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setEditProfileOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleProfileSave}>
              <div className="modal-avatar-preview">
                {getInitials(editForm.name || profile.name)}
              </div>

              <label className="modal-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter your name"
                />
              </label>

              <label className="modal-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setEditProfileOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
                  <FaSave />
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;