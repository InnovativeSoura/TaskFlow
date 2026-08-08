// src/pages/Settings.jsx

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaDesktop,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

/* =========================================================
   SETTINGS PAGE
   ========================================================= */

const Settings = () => {
  const { user } = useAuth();

  /* =======================================================
     ACTIVE SECTION
     ======================================================= */

  const [activeSection, setActiveSection] = useState("account");

  /* =======================================================
     APPEARANCE
     ======================================================= */

  const [darkMode, setDarkMode] = useState(false);

  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    emailNotifications: true,
    desktopNotifications: false,
  });

  /* =======================================================
     PASSWORD
     ======================================================= */

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  /* =======================================================
     USER INFORMATION
     ======================================================= */

  const userName = useMemo(() => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Souradipta Patra"
    );
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email || "soura@gmail.com";
  }, [user]);

  const userRole = useMemo(() => {
    return user?.role || "Admin";
  }, [user]);

  const initials = useMemo(() => {
    const name = userName.trim();

    if (!name) return "SP";

    const parts = name.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [userName]);

  /* =======================================================
     SETTINGS NAVIGATION
     ======================================================= */

  const sections = [
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
      description: "Password and protection",
      icon: FaLock,
    },
    {
      id: "application",
      title: "Application",
      description: "TaskFlow information",
      icon: FaInfoCircle,
    },
  ];

  /* =======================================================
     NOTIFICATION CONFIG
     ======================================================= */

  const notificationOptions = [
    {
      id: "taskAssignments",
      title: "Task assignments",
      description: "Notify me when a task is assigned to me.",
      icon: FaUser,
      color: "purple",
    },
    {
      id: "taskUpdates",
      title: "Task updates",
      description: "Notify me when tasks assigned to me are updated.",
      icon: FaTasks,
      color: "blue",
    },
    {
      id: "projectUpdates",
      title: "Project updates",
      description: "Notify me about important project activity.",
      icon: FaProjectDiagram,
      color: "orange",
    },
    {
      id: "emailNotifications",
      title: "Email notifications",
      description: "Receive important TaskFlow updates by email.",
      icon: FaEnvelope,
      color: "green",
    },
    {
      id: "desktopNotifications",
      title: "Desktop notifications",
      description: "Show notifications directly on your device.",
      icon: FaDesktop,
      color: "yellow",
    },
  ];

  /* =======================================================
     HANDLERS
     ======================================================= */

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleNotificationToggle = (id) => {
    setNotifications((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwords.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!passwords.newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must contain at least 6 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    toast.success("Password updated successfully.");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveAppearance = () => {
    toast.success("Appearance preferences saved.");
  };

  /* =======================================================
     ANIMATION
     ======================================================= */

  const contentAnimation = {
    initial: {
      opacity: 0,
      y: 12,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -8,
    },
    transition: {
      duration: 0.28,
      ease: "easeOut",
    },
  };

  /* =======================================================
     RENDER ACCOUNT
     ======================================================= */

  const renderAccount = () => (
    <motion.div
      key="account"
      {...contentAnimation}
      className="settings-section"
    >
      <div className="settings-section-header">
        <div>
          <span className="settings-section-eyebrow">
            Account
          </span>

          <h2>Account information</h2>

          <p>
            Manage and review the information connected to your
            TaskFlow account.
          </p>
        </div>

        <div className="settings-section-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-profile-card">
        <div className="settings-profile-main">
          <div className="settings-avatar">
            {initials}
          </div>

          <div className="settings-profile-details">
            <h3>{userName}</h3>
            <p>{userEmail}</p>

            <span className="settings-active-status">
              <span />
              Account active
            </span>
          </div>
        </div>

        <span className="settings-role-badge">
          {userRole}
        </span>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <span>Full name</span>
          <strong>{userName}</strong>
        </div>

        <div className="settings-info-card">
          <span>Email address</span>
          <strong>{userEmail}</strong>
        </div>

        <div className="settings-info-card">
          <span>Role</span>
          <strong>{userRole}</strong>
        </div>

        <div className="settings-info-card">
          <span>Account status</span>

          <strong className="settings-status-value">
            <span />
            Active
          </strong>
        </div>
      </div>
    </motion.div>
  );

  /* =======================================================
     RENDER APPEARANCE
     ======================================================= */

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      {...contentAnimation}
      className="settings-section"
    >
      <div className="settings-section-header">
        <div>
          <span className="settings-section-eyebrow">
            Appearance
          </span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how TaskFlow looks and feels across your
            workspace.
          </p>
        </div>

        <div className="settings-section-icon">
          {darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>

      <div className="settings-appearance-card">
        <div className="settings-appearance-preview">
          <div className="appearance-preview-sidebar">
            <div className="appearance-preview-logo">
              TF
            </div>

            <div className="appearance-preview-line active" />
            <div className="appearance-preview-line" />
            <div className="appearance-preview-line" />
            <div className="appearance-preview-line" />
          </div>

          <div className="appearance-preview-content">
            <div className="appearance-preview-top" />

            <div className="appearance-preview-card-row">
              <div />
              <div />
              <div />
            </div>

            <div className="appearance-preview-large" />
          </div>
        </div>

        <div className="settings-appearance-controls">
          <div className="settings-option-title-row">
            <div>
              <h3>Theme preference</h3>
              <p>
                Choose the visual appearance of your workspace.
              </p>
            </div>

            <div className="settings-theme-switch">
              <button
                type="button"
                className={!darkMode ? "active" : ""}
                onClick={() => setDarkMode(false)}
              >
                <FaSun />
                Light
              </button>

              <button
                type="button"
                className={darkMode ? "active" : ""}
                onClick={() => setDarkMode(true)}
              >
                <FaMoon />
                Dark
              </button>
            </div>
          </div>

          <div className="settings-preference-row">
            <div className="settings-preference-icon">
              {darkMode ? <FaMoon /> : <FaSun />}
            </div>

            <div>
              <h3>
                {darkMode ? "Dark mode" : "Light mode"}
              </h3>

              <p>
                {darkMode
                  ? "A darker interface for low-light environments."
                  : "A bright and clean interface for everyday use."}
              </p>
            </div>

            <div className="settings-toggle-wrap">
              <button
                type="button"
                className={`settings-toggle ${
                  darkMode ? "active" : ""
                }`}
                onClick={() => setDarkMode((value) => !value)}
                aria-label="Toggle dark mode"
              >
                <span />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="settings-primary-button"
            onClick={handleSaveAppearance}
          >
            <FaSave />
            Save appearance
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* =======================================================
     RENDER NOTIFICATIONS
     ======================================================= */

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      {...contentAnimation}
      className="settings-section"
    >
      <div className="settings-section-header">
        <div>
          <span className="settings-section-eyebrow">
            Notifications
          </span>

          <h2>Notification preferences</h2>

          <p>
            Decide which events should notify you.
          </p>
        </div>

        <div className="settings-section-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-option-list">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          const enabled = notifications[option.id];

          return (
            <div
              className="settings-notification-row"
              key={option.id}
            >
              <div
                className={`settings-notification-icon ${option.color}`}
              >
                <Icon />
              </div>

              <div className="settings-notification-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  enabled ? "active" : ""
                }`}
                onClick={() =>
                  handleNotificationToggle(option.id)
                }
                aria-label={`Toggle ${option.title}`}
                aria-pressed={enabled}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  /* =======================================================
     RENDER SECURITY
     ======================================================= */

  const renderSecurity = () => (
    <motion.div
      key="security"
      {...contentAnimation}
      className="settings-section"
    >
      <div className="settings-section-header">
        <div>
          <span className="settings-section-eyebrow">
            Security
          </span>

          <h2>Password and security</h2>

          <p>
            Keep your TaskFlow account secure with a strong
            password.
          </p>
        </div>

        <div className="settings-section-icon">
          <FaLock />
        </div>
      </div>

      <form
        className="settings-password-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="settings-password-field">
          <label htmlFor="currentPassword">
            Current password
          </label>

          <div className="settings-password-input">
            <input
              id="currentPassword"
              name="currentPassword"
              type={
                showPasswords.current
                  ? "text"
                  : "password"
              }
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords((previous) => ({
                  ...previous,
                  current: !previous.current,
                }))
              }
              aria-label="Toggle current password visibility"
            >
              {showPasswords.current ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
        </div>

        <div className="settings-password-field">
          <label htmlFor="newPassword">
            New password
          </label>

          <div className="settings-password-input">
            <input
              id="newPassword"
              name="newPassword"
              type={
                showPasswords.new
                  ? "text"
                  : "password"
              }
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords((previous) => ({
                  ...previous,
                  new: !previous.new,
                }))
              }
              aria-label="Toggle new password visibility"
            >
              {showPasswords.new ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
        </div>

        <div className="settings-password-field">
          <label htmlFor="confirmPassword">
            Confirm new password
          </label>

          <div className="settings-password-input">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showPasswords.confirm
                  ? "text"
                  : "password"
              }
              placeholder="Confirm new password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords((previous) => ({
                  ...previous,
                  confirm: !previous.confirm,
                }))
              }
              aria-label="Toggle confirm password visibility"
            >
              {showPasswords.confirm ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
        </div>

        <div className="settings-password-actions">
          <div className="settings-security-hint">
            <FaShieldAlt />

            <div>
              <strong>Security recommendation</strong>
              <span>
                Use at least 6 characters with a mix of
                letters and numbers.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="settings-primary-button"
          >
            <FaLock />
            Update password
          </button>
        </div>
      </form>
    </motion.div>
  );

  /* =======================================================
     RENDER APPLICATION
     ======================================================= */

  const renderApplication = () => (
    <motion.div
      key="application"
      {...contentAnimation}
      className="settings-section"
    >
      <div className="settings-section-header">
        <div>
          <span className="settings-section-eyebrow">
            Application
          </span>

          <h2>About TaskFlow</h2>

          <p>
            Information about your project management
            workspace.
          </p>
        </div>

        <div className="settings-section-icon">
          <FaCog />
        </div>
      </div>

      <div className="settings-application-card">
        <div className="settings-application-logo">
          TF
        </div>

        <div className="settings-application-info">
          <h3>TaskFlow</h3>

          <p>
            A modern project management workspace designed
            to help teams organize projects, manage tasks,
            and stay productive.
          </p>

          <div className="settings-version">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>
        </div>
      </div>

      <div className="settings-application-grid">
        <div className="settings-application-item">
          <FaCheckCircle />
          <div>
            <strong>Workspace protected</strong>
            <span>Your account security is active.</span>
          </div>
        </div>

        <div className="settings-application-item">
          <FaUserCircle />
          <div>
            <strong>Personal workspace</strong>
            <span>Your TaskFlow workspace is ready.</span>
          </div>
        </div>

        <div className="settings-application-item">
          <FaShieldAlt />
          <div>
            <strong>Secure account</strong>
            <span>Your account information is protected.</span>
          </div>
        </div>

        <div className="settings-application-item">
          <FaCog />
          <div>
            <strong>System preferences</strong>
            <span>Your preferences are saved locally.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  /* =======================================================
     ACTIVE CONTENT
     ======================================================= */

  const renderActiveSection = () => {
    switch (activeSection) {
      case "appearance":
        return renderAppearance();

      case "notifications":
        return renderNotifications();

      case "security":
        return renderSecurity();

      case "application":
        return renderApplication();

      case "account":
      default:
        return renderAccount();
    }
  };

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="settings-page">
      {/* Animated background */}
      <div className="settings-background" aria-hidden="true">
        <span className="settings-orb settings-orb-one" />
        <span className="settings-orb settings-orb-two" />
        <span className="settings-orb settings-orb-three" />
        <span className="settings-grid" />
      </div>

      <Sidebar />

      <div className="settings-main">
        <Navbar />

        <main className="settings-workspace">
          {/* PAGE HEADER */}
          <motion.header
            className="settings-page-header"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div>
              <span className="settings-page-eyebrow">
                WORKSPACE / SETTINGS
              </span>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences
                and security.
              </p>
            </div>

            <div className="settings-protected-badge">
              <span />
              Workspace protected
            </div>
          </motion.header>

          {/* SETTINGS CARD */}
          <motion.section
            className="settings-shell"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.05,
              ease: "easeOut",
            }}
          >
            {/* SIDEBAR */}
            <aside className="settings-menu">
              <div className="settings-menu-heading">
                SETTINGS
              </div>

              <nav className="settings-menu-list">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active =
                    activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      className={`settings-menu-item ${
                        active ? "active" : ""
                      }`}
                      onClick={() =>
                        handleSectionChange(section.id)
                      }
                    >
                      <span className="settings-menu-icon">
                        <Icon />
                      </span>

                      <span className="settings-menu-text">
                        <strong>{section.title}</strong>
                        <small>
                          {section.description}
                        </small>
                      </span>

                      <FaChevronRight className="settings-menu-arrow" />
                    </button>
                  );
                })}
              </nav>

              <div className="settings-menu-footer">
                <div className="settings-menu-footer-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>Protected workspace</strong>
                  <span>
                    Your TaskFlow account is secure.
                  </span>
                </div>

                <FaCheckCircle className="settings-menu-footer-check" />
              </div>
            </aside>

            {/* CONTENT */}
            <div className="settings-panel">
              <AnimatePresence mode="wait">
                {renderActiveSection()}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* SECURITY FOOTER */}
          <motion.div
            className="settings-bottom-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.2,
            }}
          >
            <div className="settings-bottom-icon">
              <FaShieldAlt />
            </div>

            <div className="settings-bottom-content">
              <span>TaskFlow security</span>

              <strong>
                Your preferences are stored securely in
                TaskFlow.
              </strong>

              <p>
                We respect your privacy and keep your
                workspace information protected.
              </p>
            </div>

            <div className="settings-bottom-status">
              <FaCheckCircle />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;