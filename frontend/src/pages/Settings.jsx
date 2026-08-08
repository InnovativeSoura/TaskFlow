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
  FaDesktop,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaGlobe,
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
    description: "Profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Workspace theme",
    icon: FaPalette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alert preferences",
    icon: FaBell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & protection",
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

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
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

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  /* ==========================================================
     USER DATA
  ========================================================== */

  const userName = useMemo(() => getUserName(user), [user]);
  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const userRole = useMemo(() => getUserRole(user), [user]);
  const initials = useMemo(() => getInitials(userName), [userName]);

  /* ==========================================================
     ACTIVE SECTION
  ========================================================== */

  const currentSection = useMemo(() => {
    return (
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0]
    );
  }, [activeSection]);

  /* ==========================================================
     SETTINGS UPDATE
  ========================================================== */

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ==========================================================
     PASSWORD UPDATE
  ========================================================== */

  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "Your new password must contain at least 6 characters."
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
      endpoint when the password API is ready.
    */

    setPasswordSuccess(true);
    setPasswordMessage("Password validation completed successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ==========================================================
     PASSWORD FIELD
  ========================================================== */

  const PasswordField = ({
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
          <FaLock className="settings-password-leading-icon" />

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
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          >
            {visible ? <FaEyeSlash /> : <FaEye />}
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
            <span className="settings-eyebrow">ACCOUNT</span>

            <h2>Account information</h2>

            <p>
              Manage and review the information connected to your
              TaskFlow account.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaUser />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-profile-card">
          <div className="settings-profile-left">
            <div className="settings-large-avatar">{initials}</div>

            <div className="settings-profile-details">
              <strong>{userName}</strong>
              <span>{userEmail}</span>

              <div className="settings-profile-meta">
                <span className="settings-online-dot" />
                Account active
              </div>
            </div>
          </div>

          <span className="settings-role-badge">{userRole}</span>
        </div>

        <div className="settings-info-grid">
          <div className="settings-info-card">
            <div className="settings-info-card-icon purple">
              <FaUser />
            </div>

            <div>
              <span>FULL NAME</span>
              <strong>{userName}</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon blue">
              <FaEnvelope />
            </div>

            <div>
              <span>EMAIL ADDRESS</span>
              <strong>{userEmail}</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon violet">
              <FaShieldAlt />
            </div>

            <div>
              <span>ROLE</span>
              <strong>{userRole}</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>ACCOUNT STATUS</span>

              <strong className="settings-status-active">
                <span className="settings-status-dot" />
                Active
              </strong>
            </div>
          </div>
        </div>

        <div className="settings-account-banner">
          <div className="settings-banner-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Your account is protected</strong>

            <p>
              Your TaskFlow workspace is currently secured and
              operational.
            </p>
          </div>

          <FaCheckCircle className="settings-banner-check" />
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
            <span className="settings-eyebrow">APPEARANCE</span>

            <h2>Workspace appearance</h2>

            <p>
              Personalize the visual experience of your TaskFlow
              workspace.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaPalette />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-theme-selector">
          <button
            type="button"
            className={`settings-theme-option ${
              !settings.darkMode ? "active" : ""
            }`}
            onClick={() => updateSetting("darkMode", false)}
          >
            <div className="settings-theme-icon light">
              <FaSun />
            </div>

            <div className="settings-theme-copy">
              <strong>Light mode</strong>
              <span>Bright, clean and professional.</span>
            </div>

            <span className="settings-theme-radio">
              <span />
            </span>
          </button>

          <button
            type="button"
            className={`settings-theme-option ${
              settings.darkMode ? "active" : ""
            }`}
            onClick={() => updateSetting("darkMode", true)}
          >
            <div className="settings-theme-icon dark">
              <FaMoon />
            </div>

            <div className="settings-theme-copy">
              <strong>Dark mode</strong>
              <span>Comfortable for low-light environments.</span>
            </div>

            <span className="settings-theme-radio">
              <span />
            </span>
          </button>
        </div>

        <div className="settings-preview-wrapper">
          <div className="settings-preview-header">
            <div>
              <span className="settings-preview-label">
                LIVE PREVIEW
              </span>

              <strong>TaskFlow Workspace</strong>
            </div>

            <div className="settings-preview-status">
              <span />
              Preview
            </div>
          </div>

          <div className="settings-preview-window">
            <div className="settings-preview-sidebar">
              <div className="settings-preview-logo">TF</div>

              <div className="settings-preview-nav active" />
              <div className="settings-preview-nav" />
              <div className="settings-preview-nav" />
              <div className="settings-preview-nav" />
              <div className="settings-preview-nav small" />
            </div>

            <div className="settings-preview-main">
              <div className="settings-preview-topbar">
                <div className="settings-preview-search" />

                <div className="settings-preview-avatar">
                  {initials}
                </div>
              </div>

              <div className="settings-preview-title" />

              <div className="settings-preview-stats">
                <div />
                <div />
                <div />
              </div>

              <div className="settings-preview-content">
                <div className="settings-preview-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="settings-preview-list">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-personalization-card">
          <div className="settings-personalization-icon">
            <FaDesktop />
          </div>

          <div>
            <strong>Workspace personalization</strong>

            <p>
              Your appearance preference is applied to this
              session.
            </p>
          </div>

          <FaCheckCircle />
        </div>
      </div>
    );
  };

  /* ==========================================================
     NOTIFICATIONS
  ========================================================== */

  const renderNotificationsSection = () => {
    return (
      <div className="settings-content-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-eyebrow">NOTIFICATIONS</span>

            <h2>Notification preferences</h2>

            <p>
              Control which TaskFlow events you want to receive
              alerts for.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaBell />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-notification-list">
          <div className="settings-option">
            <div className="settings-option-icon blue">
              <FaEnvelope />
            </div>

            <div className="settings-option-content">
              <strong>Email notifications</strong>

              <span>
                Receive important account and workspace updates.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.emailNotifications ? "active" : ""
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
              <FaTasks />
            </div>

            <div className="settings-option-content">
              <strong>Task notifications</strong>

              <span>
                Get notified about assignments, updates and
                completed tasks.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.taskNotifications ? "active" : ""
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
              <FaProjectDiagram />
            </div>

            <div className="settings-option-content">
              <strong>Project notifications</strong>

              <span>
                Stay updated when projects and workspace activity
                change.
              </span>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                settings.projectNotifications ? "active" : ""
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

        <div className="settings-notification-summary">
          <div className="settings-summary-icon">
            <FaBell />
          </div>

          <div>
            <strong>Notification system active</strong>

            <p>
              You currently have{" "}
              {
                [
                  settings.emailNotifications,
                  settings.taskNotifications,
                  settings.projectNotifications,
                ].filter(Boolean).length
              }{" "}
              of 3 notification categories enabled.
            </p>
          </div>

          <div className="settings-summary-pill">ACTIVE</div>
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
            <span className="settings-eyebrow">SECURITY</span>

            <h2>Password & security</h2>

            <p>
              Keep your TaskFlow account protected with strong
              credentials.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaLock />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-security-header">
          <div className="settings-security-header-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Security overview</strong>

            <span>
              Update your password regularly to keep your account
              protected.
            </span>
          </div>

          <div className="settings-security-status">
            <span />
            Protected
          </div>
        </div>

        <form
          className="settings-password-form"
          onSubmit={handlePasswordUpdate}
        >
          <PasswordField
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            visible={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword((current) => !current)
            }
            placeholder="Enter your current password"
          />

          <PasswordField
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword((current) => !current)
            }
            placeholder="Create a new password"
          />

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            visible={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword((current) => !current)
            }
            placeholder="Confirm your new password"
          />

          <div className="settings-password-hint">
            <FaInfoCircle />

            <span>
              Use at least 6 characters. A combination of letters,
              numbers and symbols is recommended.
            </span>
          </div>

          {passwordMessage && (
            <div
              className={`settings-password-message ${
                passwordSuccess ? "success" : "error"
              }`}
            >
              {passwordSuccess ? (
                <FaCheckCircle />
              ) : (
                <FaInfoCircle />
              )}

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

        <div className="settings-security-cards">
          <div className="settings-security-card">
            <div className="settings-security-card-icon green">
              <FaShieldAlt />
            </div>

            <div>
              <strong>Account protection</strong>
              <span>Security monitoring is active.</span>
            </div>

            <FaCheckCircle />
          </div>

          <div className="settings-security-card">
            <div className="settings-security-card-icon purple">
              <FaLock />
            </div>

            <div>
              <strong>Password security</strong>
              <span>Credentials are securely managed.</span>
            </div>

            <FaCheckCircle />
          </div>
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
            <span className="settings-eyebrow">APPLICATION</span>

            <h2>About TaskFlow</h2>

            <p>
              Product information and workspace platform details.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaInfoCircle />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-app-brand">
          <div className="settings-app-logo">
            <span>TF</span>
          </div>

          <div className="settings-app-brand-copy">
            <div>
              <strong>TaskFlow</strong>

              <span className="settings-version">
                v1.0.0
              </span>
            </div>

            <p>Project Management Workspace</p>
          </div>

          <div className="settings-operational">
            <span />
            Operational
          </div>
        </div>

        <div className="settings-info-grid application-grid">
          <div className="settings-info-card">
            <div className="settings-info-card-icon purple">
              <FaGlobe />
            </div>

            <div>
              <span>APPLICATION</span>
              <strong>TaskFlow</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon blue">
              <FaCog />
            </div>

            <div>
              <span>VERSION</span>
              <strong>1.0.0</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon violet">
              <FaDesktop />
            </div>

            <div>
              <span>PLATFORM</span>
              <strong>Web Application</strong>
            </div>
          </div>

          <div className="settings-info-card">
            <div className="settings-info-card-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>STATUS</span>

              <strong className="settings-status-active">
                <span className="settings-status-dot" />
                Operational
              </strong>
            </div>
          </div>
        </div>

        <div className="settings-about-card">
          <div className="settings-about-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span className="settings-eyebrow">
              BUILT FOR PRODUCTIVITY
            </span>

            <strong>
              Everything your team needs in one workspace.
            </strong>

            <p>
              TaskFlow helps teams organize projects, manage tasks,
              collaborate efficiently and track progress from one
              centralized workspace.
            </p>
          </div>
        </div>

        <div className="settings-app-footer">
          <span>TaskFlow</span>
          <span>•</span>
          <span>Project Management Workspace</span>
          <span>•</span>
          <span>Version 1.0.0</span>
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
      {/* ======================================================
          PREMIUM BACKGROUND
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
            <div className="settings-header-left">
              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>
                <FaChevronRight />
                <span>SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and
                security.
              </p>
            </div>

            <div className="settings-header-badge">
              <span />
              Workspace secure
            </div>
          </header>

          {/* ==================================================
              SETTINGS PANEL
          ================================================== */}

          <section className="settings-panel">
            {/* =================================================
                LEFT SETTINGS NAV
            ================================================= */}

            <aside className="settings-sidebar">
              <div className="settings-sidebar-top">
                <span className="settings-sidebar-label">
                  SETTINGS
                </span>

                <span className="settings-sidebar-count">
                  {SETTINGS_ITEMS.length}
                </span>
              </div>

              <nav className="settings-nav">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`settings-nav-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="settings-nav-icon">
                        <Icon />
                      </span>

                      <span className="settings-nav-text">
                        <strong>{item.label}</strong>

                        <small>{item.description}</small>
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

                <div className="settings-footer-copy">
                  <strong>Protected workspace</strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>
                </div>

                <FaCheckCircle className="settings-footer-check" />
              </div>
            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <section className="settings-content">
              <div className="settings-content-topline">
                <div>
                  <span>SETTINGS</span>
                  <FaChevronRight />
                  <strong>{currentSection.label}</strong>
                </div>

                <div className="settings-content-status">
                  <span />
                  Active
                </div>
              </div>

              {renderContent()}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;