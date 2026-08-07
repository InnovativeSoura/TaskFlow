import React, { useMemo, useState } from "react";

import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaEnvelope,
  FaBriefcase,
  FaCheckCircle,
  FaChevronRight,
  FaSun,
  FaMoon,
  FaDesktop,
  FaSave,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Settings.css";

/* =========================================================
   SETTINGS SECTIONS
========================================================= */

const SETTINGS_SECTIONS = [
  {
    id: "account",
    label: "Account",
    description: "Your profile information",
    icon: <FaUser />,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize your workspace",
    icon: <FaPalette />,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage your alerts",
    icon: <FaBell />,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and security",
    icon: <FaLock />,
  },
  {
    id: "application",
    label: "Application",
    description: "TaskFlow information",
    icon: <FaInfoCircle />,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "TF";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

/* =========================================================
   SETTINGS PAGE
========================================================= */

function Settings() {
  const [activeSection, setActiveSection] =
    useState("account");

  const [appearance, setAppearance] = useState({
    theme: "light",
    compactMode: false,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    taskUpdates: true,
    projectUpdates: true,
    reminders: true,
  });

  const [saving, setSaving] = useState(false);

  /*
   * Keep the profile data centralized.
   * Replace these values with your AuthContext values
   * if your existing project already exposes them there.
   */
  const user = {
    name: "Souradipta Patra",
    email: "soura@gmail.com",
    role: "Admin",
    status: "Active",
  };

  const initials = useMemo(
    () => getInitials(user.name),
    [user.name]
  );

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      /*
       * Keep this function ready for your existing
       * settings API/service.
       *
       * Do not add a new API dependency here.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     ACCOUNT
  ======================================================= */

  const renderAccount = () => (
    <div className="settings-content-panel">
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            ACCOUNT
          </span>

          <h2>Account information</h2>

          <p>
            View the information associated with your
            TaskFlow account.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      {/* PROFILE HERO */}

      <div className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-profile-avatar">
            {initials}

            <span className="settings-online-dot" />
          </div>

          <div className="settings-profile-info">
            <h3>{user.name}</h3>

            <span>{user.email}</span>
          </div>
        </div>

        <span className="settings-role-badge">
          {user.role}
        </span>
      </div>

      {/* INFORMATION GRID */}

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{user.name}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon">
            <FaBriefcase />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{user.role}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-status-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>

            <strong className="settings-active-text">
              {user.status}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     APPEARANCE
  ======================================================= */

  const renderAppearance = () => (
    <div className="settings-content-panel">
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            APPEARANCE
          </span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how TaskFlow looks on your device.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="appearance-theme-section">
        <div className="settings-field-heading">
          <h3>Theme</h3>

          <p>
            Choose the appearance that works best for
            you.
          </p>
        </div>

        <div className="theme-options">
          <button
            type="button"
            className={`theme-option ${
              appearance.theme === "light"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setAppearance((current) => ({
                ...current,
                theme: "light",
              }))
            }
          >
            <FaSun />

            <span>Light</span>
          </button>

          <button
            type="button"
            className={`theme-option ${
              appearance.theme === "dark"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setAppearance((current) => ({
                ...current,
                theme: "dark",
              }))
            }
          >
            <FaMoon />

            <span>Dark</span>
          </button>

          <button
            type="button"
            className={`theme-option ${
              appearance.theme === "system"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setAppearance((current) => ({
                ...current,
                theme: "system",
              }))
            }
          >
            <FaDesktop />

            <span>System</span>
          </button>
        </div>
      </div>

      <div className="settings-option-row">
        <div>
          <h3>Compact mode</h3>

          <p>
            Reduce spacing throughout the workspace.
          </p>
        </div>

        <button
          type="button"
          className={`settings-toggle ${
            appearance.compactMode ? "active" : ""
          }`}
          onClick={() =>
            setAppearance((current) => ({
              ...current,
              compactMode: !current.compactMode,
            }))
          }
          aria-label="Toggle compact mode"
        >
          <span />
        </button>
      </div>

      <button
        type="button"
        className="settings-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        <FaSave />

        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const renderNotifications = () => (
    <div className="settings-content-panel">
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            NOTIFICATIONS
          </span>

          <h2>Notification preferences</h2>

          <p>
            Choose which updates you want to receive.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="notification-list">
        <NotificationOption
          title="Email notifications"
          description="Receive important workspace updates by email."
          checked={notifications.email}
          onChange={() =>
            setNotifications((current) => ({
              ...current,
              email: !current.email,
            }))
          }
        />

        <NotificationOption
          title="Task updates"
          description="Get notified when tasks are created or updated."
          checked={notifications.taskUpdates}
          onChange={() =>
            setNotifications((current) => ({
              ...current,
              taskUpdates: !current.taskUpdates,
            }))
          }
        />

        <NotificationOption
          title="Project updates"
          description="Receive updates about your projects."
          checked={notifications.projectUpdates}
          onChange={() =>
            setNotifications((current) => ({
              ...current,
              projectUpdates:
                !current.projectUpdates,
            }))
          }
        />

        <NotificationOption
          title="Task reminders"
          description="Receive reminders for upcoming deadlines."
          checked={notifications.reminders}
          onChange={() =>
            setNotifications((current) => ({
              ...current,
              reminders: !current.reminders,
            }))
          }
        />
      </div>

      <button
        type="button"
        className="settings-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        <FaSave />

        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );

  /* =======================================================
     SECURITY
  ======================================================= */

  const renderSecurity = () => (
    <div className="settings-content-panel">
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            SECURITY
          </span>

          <h2>Password and security</h2>

          <p>
            Keep your TaskFlow account secure.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="security-status-card">
        <div className="security-status-icon">
          <FaShieldAlt />
        </div>

        <div>
          <h3>Your account is protected</h3>

          <p>
            TaskFlow security features are currently
            active.
          </p>
        </div>

        <span className="security-active-badge">
          Secure
        </span>
      </div>

      <div className="password-section">
        <div className="settings-field-heading">
          <h3>Change password</h3>

          <p>
            Update your password regularly to keep your
            account secure.
          </p>
        </div>

        <div className="password-fields">
          <input
            type="password"
            placeholder="Current password"
          />

          <input
            type="password"
            placeholder="New password"
          />

          <input
            type="password"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <button
        type="button"
        className="settings-save-btn"
      >
        <FaLock />

        Update Password
      </button>
    </div>
  );

  /* =======================================================
     APPLICATION
  ======================================================= */

  const renderApplication = () => (
    <div className="settings-content-panel">
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            APPLICATION
          </span>

          <h2>About TaskFlow</h2>

          <p>
            Information about your project management
            workspace.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaInfoCircle />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="application-grid">
        <div className="application-card">
          <span>APPLICATION</span>
          <strong>TaskFlow</strong>
        </div>

        <div className="application-card">
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="application-card">
          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div className="application-card">
          <span>STACK</span>
          <strong>MERN</strong>
        </div>
      </div>
    </div>
  );

  /* =======================================================
     CONTENT SWITCHER
  ======================================================= */

  const renderActiveContent = () => {
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
      {/* ===================================================
          ANIMATED BACKGROUND
      =================================================== */}

      <div
        className="settings-background"
        aria-hidden="true"
      >
        <div className="settings-gradient settings-gradient-one" />

        <div className="settings-gradient settings-gradient-two" />

        <div className="settings-gradient settings-gradient-three" />

        <div className="settings-orb settings-orb-one" />

        <div className="settings-orb settings-orb-two" />

        <div className="settings-orb settings-orb-three" />

        <div className="settings-particles">
          {Array.from({ length: 24 }).map(
            (_, index) => (
              <span
                key={index}
                style={{
                  "--particle-index": index,
                }}
              />
            )
          )}
        </div>

        <div className="settings-wave settings-wave-one" />

        <div className="settings-wave settings-wave-two" />

        <div className="settings-grid" />
      </div>

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar />

      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="settings-main">
        <Navbar />

        <main className="settings-container">
          {/* PAGE HEADER */}

          <header className="settings-page-header">
            <div className="settings-breadcrumb">
              <span>Workspace</span>

              <FaChevronRight />

              <strong>Settings</strong>
            </div>

            <h1>
              Settings
              <span className="settings-title-dot" />
            </h1>

            <p>
              Manage your account and workspace
              preferences.
            </p>
          </header>

          {/* SETTINGS SHELL */}

          <section className="settings-shell">
            {/* LEFT NAVIGATION */}

            <aside className="settings-sidebar">
              <div className="settings-sidebar-title">
                SETTINGS
              </div>

              <nav className="settings-navigation">
                {SETTINGS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={`settings-nav-item ${
                      activeSection === section.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveSection(section.id)
                    }
                  >
                    <span className="settings-nav-icon">
                      {section.icon}
                    </span>

                    <span className="settings-nav-text">
                      <strong>
                        {section.label}
                      </strong>

                      <small>
                        {section.description}
                      </small>
                    </span>

                    {activeSection === section.id && (
                      <FaChevronRight className="settings-nav-arrow" />
                    )}
                  </button>
                ))}
              </nav>

              {/* SECURITY NOTICE */}

              <div className="settings-security-notice">
                <div className="settings-security-icon">
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

            {/* RIGHT CONTENT */}

            <div className="settings-content">
              {renderActiveContent()}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATION OPTION
========================================================= */

function NotificationOption({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="notification-option">
      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`settings-toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;