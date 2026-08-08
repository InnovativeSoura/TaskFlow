import React, { useMemo, useState } from "react";

import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaCheckCircle,
  FaMoon,
  FaSun,
  FaChevronRight,
  FaShieldAlt,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaTasks,
  FaProjectDiagram,
  FaEnvelope,
  FaDesktop,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

/* ============================================================
   SETTINGS NAVIGATION
============================================================ */

const SETTINGS_ITEMS = [
  {
    id: "account",
    label: "Account",
    description: "Your profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize your workspace",
    icon: FaPalette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage your alerts",
    icon: FaBell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and protection",
    icon: FaLock,
  },
  {
    id: "application",
    label: "Application",
    description: "TaskFlow information",
    icon: FaInfoCircle,
  },
];

/* ============================================================
   DEFAULT SETTINGS
============================================================ */

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  desktopNotifications: false,
};

/* ============================================================
   HELPERS
============================================================ */

const getInitials = (name = "") => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "U";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getUserName = (user) => {
  return (
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.displayName ||
    "TaskFlow User"
  );
};

const getUserEmail = (user) => {
  return user?.email || "No email available";
};

const getUserRole = (user) => {
  return user?.role || "Member";
};

/* ============================================================
   SETTINGS PAGE
============================================================ */

function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] =
    useState("notifications");

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  /* ==========================================================
     USER DATA
  ========================================================== */

  const userName = useMemo(
    () => getUserName(user),
    [user]
  );

  const userEmail = useMemo(
    () => getUserEmail(user),
    [user]
  );

  const userRole = useMemo(
    () => getUserRole(user),
    [user]
  );

  const initials = useMemo(
    () => getInitials(userName),
    [userName]
  );

  /* ==========================================================
     ACTIVE SECTION
  ========================================================== */

  const currentSection = useMemo(() => {
    return (
      SETTINGS_ITEMS.find(
        (item) => item.id === activeSection
      ) || SETTINGS_ITEMS[0]
    );
  }, [activeSection]);

  /* ==========================================================
     SETTING UPDATE
  ========================================================== */

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ==========================================================
     PASSWORD HANDLER
  ========================================================== */

  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordMessage(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "New password and confirmation do not match."
      );
      return;
    }

    /*
      Connect this handler to your backend password
      update endpoint when the API is available.
    */

    setPasswordMessage(
      "Password validation completed successfully."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ==========================================================
     PASSWORD INPUT
  ========================================================== */

  const PasswordInput = ({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
  }) => {
    return (
      <div className="settings-password-field">
        <label htmlFor={id}>
          {label}
        </label>

        <div className="settings-password-input">
          <input
            id={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
          />

          <button
            type="button"
            className="settings-password-toggle"
            onClick={onToggle}
            aria-label={
              visible
                ? `Hide ${label}`
                : `Show ${label}`
            }
          >
            {visible ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </div>
    );
  };

  /* ==========================================================
     ACCOUNT
  ========================================================== */

  const renderAccountSection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              ACCOUNT
            </span>

            <h2>Account information</h2>

            <p>
              View the information associated with
              your TaskFlow account.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaUser />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-profile-card">
          <div className="settings-profile-left">
            <div className="settings-large-avatar">
              {initials}
            </div>

            <div className="settings-profile-details">
              <strong>{userName}</strong>

              <span>{userEmail}</span>

              <div className="settings-profile-status">
                <span />
                Account active
              </div>
            </div>
          </div>

          <span className="settings-role-badge">
            {userRole}
          </span>
        </div>

        <div className="settings-info-grid">
          <div className="settings-info-card">
            <span>FULL NAME</span>
            <strong>{userName}</strong>
          </div>

          <div className="settings-info-card">
            <span>EMAIL ADDRESS</span>
            <strong>{userEmail}</strong>
          </div>

          <div className="settings-info-card">
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>

          <div className="settings-info-card">
            <span>ACCOUNT STATUS</span>

            <strong className="settings-status-active">
              <span className="settings-status-dot" />
              Active
            </strong>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     APPEARANCE
  ========================================================== */

  const renderAppearanceSection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              APPEARANCE
            </span>

            <h2>Workspace appearance</h2>

            <p>
              Customize how TaskFlow looks and feels.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaPalette />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-option-list">
          <div className="settings-option">
            <div className="settings-option-icon purple">
              <FaSun />
            </div>

            <div className="settings-option-content">
              <strong>Light interface</strong>

              <span>
                Keep TaskFlow bright, clean and
                comfortable to use.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                !settings.darkMode
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "darkMode",
                  false
                )
              }
              aria-label="Enable light interface"
            >
              <span />
            </button>
          </div>

          <div className="settings-option">
            <div className="settings-option-icon dark">
              <FaMoon />
            </div>

            <div className="settings-option-content">
              <strong>Dark interface</strong>

              <span>
                Use a darker interface for low-light
                environments.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.darkMode
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "darkMode",
                  true
                )
              }
              aria-label="Enable dark interface"
            >
              <span />
            </button>
          </div>
        </div>

        <div className="settings-theme-preview">
          <div className="theme-preview-header">
            <div className="theme-preview-dots">
              <i />
              <i />
              <i />
            </div>

            <span>
              TaskFlow workspace preview
            </span>
          </div>

          <div className="theme-preview-body">
            <div className="theme-preview-sidebar">
              <div className="theme-preview-logo">
                TF
              </div>

              <div className="theme-preview-line active" />
              <div className="theme-preview-line" />
              <div className="theme-preview-line" />
              <div className="theme-preview-line" />
            </div>

            <div className="theme-preview-content">
              <div className="theme-preview-title" />

              <div className="theme-preview-cards">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-information-banner">
          <FaCog />

          <div>
            <strong>
              Workspace personalization
            </strong>

            <span>
              Your interface preferences are saved
              for this session.
            </span>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     NOTIFICATIONS
  ========================================================== */

  const renderNotificationsSection = () => {
    const notificationItems = [
      {
        key: "taskNotifications",
        title: "Task assignments",
        description:
          "Notify me when a task is assigned to me.",
        icon: FaUser,
        color: "purple",
      },
      {
        key: "taskNotifications",
        title: "Task updates",
        description:
          "Notify me when tasks assigned to me are updated.",
        icon: FaTasks,
        color: "blue",
      },
      {
        key: "projectNotifications",
        title: "Project updates",
        description:
          "Notify me about important project activity.",
        icon: FaProjectDiagram,
        color: "violet",
      },
      {
        key: "emailNotifications",
        title: "Email notifications",
        description:
          "Receive important TaskFlow updates by email.",
        icon: FaEnvelope,
        color: "green",
      },
      {
        key: "desktopNotifications",
        title: "Desktop notifications",
        description:
          "Show notifications directly on your device.",
        icon: FaDesktop,
        color: "orange",
      },
    ];

    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              NOTIFICATIONS
            </span>

            <h2>
              Notification preferences
            </h2>

            <p>
              Decide which events should notify you.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaBell />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-notification-list">
          {notificationItems.map(
            (item, index) => {
              const Icon = item.icon;

              const isActive =
                settings[item.key];

              return (
                <div
                  className="settings-notification-card"
                  key={`${item.title}-${index}`}
                >
                  <div
                    className={`settings-notification-icon ${item.color}`}
                  >
                    <Icon />
                  </div>

                  <div className="settings-notification-content">
                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.description}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`settings-switch ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      updateSetting(
                        item.key,
                        !settings[item.key]
                      )
                    }
                    aria-label={`Toggle ${item.title}`}
                  >
                    <span />
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  };

  /* ==========================================================
     SECURITY
  ========================================================== */

  const renderSecuritySection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              SECURITY
            </span>

            <h2>Password & security</h2>

            <p>
              Keep your TaskFlow account secure.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaLock />
          </div>
        </div>

        <div className="settings-divider" />

        <form
          className="settings-password-form"
          onSubmit={handlePasswordUpdate}
        >
          <PasswordInput
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(
                event.target.value
              )
            }
            visible={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword(
                (current) => !current
              )
            }
            placeholder="Enter current password"
          />

          <PasswordInput
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword(
                (current) => !current
              )
            }
            placeholder="Enter new password"
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            visible={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            placeholder="Confirm new password"
          />

          <div className="settings-password-requirement">
            <FaCheckCircle />

            <span>
              Use at least 6 characters for your
              password.
            </span>
          </div>

          {passwordMessage && (
            <div className="settings-password-message">
              <FaCheckCircle />

              <span>
                {passwordMessage}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="settings-primary-button"
          >
            <FaLock />

            Update Password
          </button>
        </form>

        <div className="settings-security-notice">
          <div className="settings-security-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>
              Your account is protected
            </strong>

            <p>
              Use a strong password and never share
              your login credentials.
            </p>
          </div>

          <FaCheckCircle className="settings-security-check" />
        </div>
      </div>
    );
  };

  /* ==========================================================
     APPLICATION
  ========================================================== */

  const renderApplicationSection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              APPLICATION
            </span>

            <h2>About TaskFlow</h2>

            <p>
              Information about your project
              management workspace.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaInfoCircle />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-app-brand">
          <div className="settings-app-logo">
            TF
          </div>

          <div>
            <strong>TaskFlow</strong>

            <span>
              Project Management Workspace
            </span>

            <small>
              Version 1.0.0
            </small>
          </div>
        </div>

        <div className="settings-info-grid">
          <div className="settings-info-card">
            <span>APPLICATION</span>
            <strong>TaskFlow</strong>
          </div>

          <div className="settings-info-card">
            <span>VERSION</span>
            <strong>1.0.0</strong>
          </div>

          <div className="settings-info-card">
            <span>PLATFORM</span>
            <strong>Web Application</strong>
          </div>

          <div className="settings-info-card">
            <span>STATUS</span>

            <strong className="settings-status-active">
              <span className="settings-status-dot" />
              Operational
            </strong>
          </div>
        </div>

        <div className="settings-about-card">
          <div className="settings-about-icon">
            <FaCheckCircle />
          </div>

          <div>
            <strong>
              Built for productive teams
            </strong>

            <p>
              TaskFlow helps teams organize projects,
              manage tasks and track progress from one
              centralized workspace.
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     CONTENT SWITCHER
  ========================================================== */

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountSection();

      case "appearance":
        return renderAppearanceSection();

      case "notifications":
        return renderNotificationsSection();

      case "security":
        return renderSecuritySection();

      case "application":
        return renderApplicationSection();

      default:
        return renderNotificationsSection();
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="settings-page">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="settings-background"
        aria-hidden="true"
      >
        <div className="settings-bg-grid" />

        <div className="settings-bg-orb settings-bg-orb-1" />

        <div className="settings-bg-orb settings-bg-orb-2" />

        <div className="settings-bg-orb settings-bg-orb-3" />

        <div className="settings-bg-glow settings-bg-glow-1" />

        <div className="settings-bg-glow settings-bg-glow-2" />
      </div>

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="settings-main">

        <Navbar />

        <main className="settings-container">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="settings-page-header">

            <div className="settings-breadcrumb">
              <span>WORKSPACE</span>

              <FaChevronRight />

              <span>SETTINGS</span>
            </div>

            <div className="settings-header-row">
              <div>
                <h1>Settings</h1>

                <p>
                  Manage your account, workspace
                  preferences and security.
                </p>
              </div>

              <div className="settings-header-status">
                <span />

                Workspace protected
              </div>
            </div>

          </header>

          {/* ==================================================
              SETTINGS MAIN CARD
          ================================================== */}

          <section className="settings-panel">

            {/* ================================================
                LEFT NAVIGATION
            ================================================ */}

            <aside className="settings-sidebar">

              <div className="settings-sidebar-label">
                SETTINGS
              </div>

              <nav className="settings-nav">

                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`settings-nav-item ${
                        isActive
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveSection(
                          item.id
                        )
                      }
                    >
                      <span className="settings-nav-icon">
                        <Icon />
                      </span>

                      <span className="settings-nav-text">
                        <strong>
                          {item.label}
                        </strong>

                        <small>
                          {item.description}
                        </small>
                      </span>

                      <FaChevronRight className="settings-nav-arrow" />
                    </button>
                  );
                })}

              </nav>

              {/* ============================================
                  SIDEBAR PROTECTION
              ============================================ */}

              <div className="settings-sidebar-footer">

                <div className="settings-footer-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>
                    Protected workspace
                  </strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>
                </div>

                <FaCheckCircle className="settings-footer-check" />

              </div>

            </aside>

            {/* ================================================
                RIGHT CONTENT
            ================================================ */}

            <section className="settings-content">

              <div className="settings-content-topline">
                <span>
                  {currentSection.label}
                </span>

                <div />
              </div>

              {renderContent()}

            </section>

          </section>

          {/* ==================================================
              LARGE SECURITY FOOTER
          ================================================== */}

          <footer className="settings-bottom-footer">

            <div className="settings-bottom-footer-icon">
              <FaShieldAlt />
            </div>

            <div className="settings-bottom-footer-content">

              <span className="settings-bottom-footer-eyebrow">
                TASKFLOW SECURITY
              </span>

              <strong>
                Your preferences are stored securely
                in TaskFlow.
              </strong>

              <p>
                We respect your privacy and keep your
                workspace information protected.
              </p>

            </div>

            <div className="settings-bottom-footer-visual">

              <div className="settings-footer-glow" />

              <div className="settings-footer-lock">
                <FaLock />
              </div>

              <div className="settings-footer-dots">
                <span />
                <span />
                <span />
              </div>

            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default Settings;