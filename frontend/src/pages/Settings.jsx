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
  FaSignOutAlt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../../styles/Settings.css";

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
    description: "Password and security",
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
    useState("account");

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
     USER INFORMATION
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
     CURRENT SECTION
  ========================================================== */

  const currentSection = useMemo(() => {
    return (
      SETTINGS_ITEMS.find(
        (item) => item.id === activeSection
      ) || SETTINGS_ITEMS[0]
    );
  }, [activeSection]);

  /* ==========================================================
     UPDATE SETTING
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
      The UI validation is intentionally kept here.

      Connect this handler to your backend password
      endpoint when the password API is ready.
    */

    setPasswordMessage(
      "Password validation completed successfully."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ==========================================================
     PASSWORD INPUT COMPONENT
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
        <label htmlFor={id}>{label}</label>

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
              <FaMoon />
            ) : (
              <FaSun />
            )}
          </button>
        </div>
      </div>
    );
  };

  /* ==========================================================
     ACCOUNT SECTION
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
     APPEARANCE SECTION
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
                Keep TaskFlow bright and clean.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                !settings.darkMode ? "active" : ""
              }`}
              onClick={() =>
                updateSetting("darkMode", false)
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
                settings.darkMode ? "active" : ""
              }`}
              onClick={() =>
                updateSetting("darkMode", true)
              }
              aria-label="Enable dark interface"
            >
              <span />
            </button>
          </div>
        </div>

        <div className="settings-preview-card">
          <div className="settings-preview-icon">
            <FaCog />
          </div>

          <div>
            <strong>Workspace personalization</strong>

            <p>
              Your interface preferences are saved
              for this session.
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     NOTIFICATIONS SECTION
  ========================================================== */

  const renderNotificationsSection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">
              NOTIFICATIONS
            </span>

            <h2>Notification preferences</h2>

            <p>
              Choose which TaskFlow events you want
              to be notified about.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaBell />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-option-list">
          <div className="settings-option">
            <div className="settings-option-icon blue">
              <FaBell />
            </div>

            <div className="settings-option-content">
              <strong>Email notifications</strong>

              <span>
                Receive important account and workspace
                updates.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.emailNotifications
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "emailNotifications",
                  !settings.emailNotifications
                )
              }
              aria-label="Toggle email notifications"
            >
              <span />
            </button>
          </div>

          <div className="settings-option">
            <div className="settings-option-icon purple">
              <FaCheckCircle />
            </div>

            <div className="settings-option-content">
              <strong>Task notifications</strong>

              <span>
                Get notified about task assignments,
                updates and completion.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.taskNotifications
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "taskNotifications",
                  !settings.taskNotifications
                )
              }
              aria-label="Toggle task notifications"
            >
              <span />
            </button>
          </div>

          <div className="settings-option">
            <div className="settings-option-icon orange">
              <FaPalette />
            </div>

            <div className="settings-option-content">
              <strong>Project notifications</strong>

              <span>
                Stay updated when projects change.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.projectNotifications
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "projectNotifications",
                  !settings.projectNotifications
                )
              }
              aria-label="Toggle project notifications"
            >
              <span />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     SECURITY SECTION
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
              setCurrentPassword(event.target.value)
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
              setNewPassword(event.target.value)
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
              setConfirmPassword(event.target.value)
            }
            visible={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            placeholder="Confirm new password"
          />

          {passwordMessage && (
            <div className="settings-password-message">
              <FaCheckCircle />

              <span>{passwordMessage}</span>
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
            <strong>Your account is protected</strong>

            <p>
              Use a strong password and never share
              your login credentials.
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* ==========================================================
     APPLICATION SECTION
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
          </div>
        </div>

        <div className="settings-info-grid application-grid">
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
          <FaCheckCircle />

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
      case "appearance":
        return renderAppearanceSection();

      case "notifications":
        return renderNotificationsSection();

      case "security":
        return renderSecuritySection();

      case "application":
        return renderApplicationSection();

      case "account":
      default:
        return renderAccountSection();
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="settings-page">
      {/* =====================================================
          PREMIUM ANIMATED BACKGROUND
      ===================================================== */}

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

        <div className="settings-bg-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="settings-main">
        <Navbar />

        <main className="settings-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="settings-page-header">
            <div>
              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>

                <FaChevronRight />

                <span>SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account and workspace
                preferences.
              </p>
            </div>
          </header>

          {/* =================================================
              SETTINGS PANEL
          ================================================= */}

          <section className="settings-panel">
            {/* ===============================================
                LEFT NAVIGATION
            =============================================== */}

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
                        isActive ? "active" : ""
                      }`}
                      onClick={() =>
                        setActiveSection(item.id)
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

              <div className="settings-sidebar-footer">
                <div className="settings-footer-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>
                    Your account is protected
                  </strong>

                  <span>
                    TaskFlow security is active.
                  </span>
                </div>
              </div>
            </aside>

            {/* ===============================================
                RIGHT CONTENT
            =============================================== */}

            <section className="settings-content">
              {renderContent()}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;