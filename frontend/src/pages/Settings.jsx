import React, { useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCog,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaDesktop,
  FaGlobe,
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaCircle,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

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

const getInitials = (name = "") => {
  const cleanedName = String(name).trim();

  if (!cleanedName) {
    return "TF";
  }

  const parts = cleanedName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getUserName = (user) => {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    "TaskFlow User"
  );
};

const getUserEmail = (user) => {
  return user?.email || user?.emailAddress || "No email available";
};

const getUserRole = (user) => {
  return user?.role || "Administrator";
};

const Settings = () => {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [theme, setTheme] = useState("system");

  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    emailNotifications: true,
    desktopNotifications: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const userName = useMemo(() => getUserName(user), [user]);
  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const userRole = useMemo(() => getUserRole(user), [user]);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const toggleNotification = (field) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const renderAccountSection = () => {
    return (
      <section className="settings-section-content">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">ACCOUNT</span>

            <h2>Account information</h2>

            <p>
              Manage and review the information connected to your
              TaskFlow account.
            </p>
          </div>

          <div className="section-heading-icon">
            <FaUser />
          </div>
        </div>

        <div className="account-profile-card">
          <div className="account-avatar">
            {initials}
            <span className="avatar-status"></span>
          </div>

          <div className="account-profile-info">
            <h3>{userName}</h3>

            <p>{userEmail}</p>

            <div className="account-active-status">
              <FaCircle />
              <span>Account active</span>
            </div>
          </div>

          <div className="account-role">
            {userRole}
          </div>
        </div>

        <div className="account-details-grid">
          <div className="detail-card">
            <div className="detail-icon purple">
              <FaUser />
            </div>

            <div>
              <span>FULL NAME</span>
              <strong>{userName}</strong>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon blue">
              <FaEnvelope />
            </div>

            <div>
              <span>EMAIL ADDRESS</span>
              <strong>{userEmail}</strong>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon violet">
              <FaShieldAlt />
            </div>

            <div>
              <span>ROLE</span>
              <strong>{userRole}</strong>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>ACCOUNT STATUS</span>

              <strong className="active-text">
                <FaCircle />
                Active
              </strong>
            </div>
          </div>
        </div>

        <div className="security-banner">
          <div className="security-banner-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Your account is protected</strong>

            <p>
              TaskFlow security features are active and your
              workspace is protected.
            </p>
          </div>

          <FaCheckCircle className="security-check" />
        </div>
      </section>
    );
  };

  const renderAppearanceSection = () => {
    return (
      <section className="settings-section-content">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">APPEARANCE</span>

            <h2>Workspace appearance</h2>

            <p>
              Customize how TaskFlow looks across your workspace.
            </p>
          </div>

          <div className="section-heading-icon">
            <FaPalette />
          </div>
        </div>

        <div className="preference-block">
          <div className="preference-title">
            <div>
              <h3>Theme</h3>
              <p>Choose your preferred interface appearance.</p>
            </div>
          </div>

          <div className="theme-grid">
            <button
              type="button"
              className={`theme-option ${
                theme === "light" ? "selected" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="theme-preview light-preview">
                <FaSun />
              </div>

              <div>
                <strong>Light</strong>
                <span>Bright workspace</span>
              </div>

              {theme === "light" && (
                <FaCheckCircle className="theme-check" />
              )}
            </button>

            <button
              type="button"
              className={`theme-option ${
                theme === "dark" ? "selected" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="theme-preview dark-preview">
                <FaMoon />
              </div>

              <div>
                <strong>Dark</strong>
                <span>Low-light workspace</span>
              </div>

              {theme === "dark" && (
                <FaCheckCircle className="theme-check" />
              )}
            </button>

            <button
              type="button"
              className={`theme-option ${
                theme === "system" ? "selected" : ""
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="theme-preview system-preview">
                <FaDesktop />
              </div>

              <div>
                <strong>System</strong>
                <span>Follow device settings</span>
              </div>

              {theme === "system" && (
                <FaCheckCircle className="theme-check" />
              )}
            </button>
          </div>
        </div>

        <div className="appearance-info-card">
          <div className="appearance-info-icon">
            <FaPalette />
          </div>

          <div>
            <strong>Premium workspace experience</strong>
            <p>
              TaskFlow uses a clean glass interface with subtle
              gradients and smooth visual transitions.
            </p>
          </div>
        </div>
      </section>
    );
  };

  const renderNotificationsSection = () => {
    return (
      <section className="settings-section-content">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">NOTIFICATIONS</span>

            <h2>Notification preferences</h2>

            <p>
              Decide which events should notify you.
            </p>
          </div>

          <div className="section-heading-icon">
            <FaBell />
          </div>
        </div>

        <div className="notification-list">
          <div className="notification-item">
            <div className="notification-icon purple">
              <FaUser />
            </div>

            <div className="notification-copy">
              <strong>Task assignments</strong>
              <span>
                Notify me when a task is assigned to me.
              </span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                notifications.taskAssignments ? "active" : ""
              }`}
              onClick={() =>
                toggleNotification("taskAssignments")
              }
              aria-label="Toggle task assignments notifications"
            >
              <span></span>
            </button>
          </div>

          <div className="notification-item">
            <div className="notification-icon blue">
              <FaCog />
            </div>

            <div className="notification-copy">
              <strong>Task updates</strong>
              <span>
                Notify me when tasks assigned to me are updated.
              </span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                notifications.taskUpdates ? "active" : ""
              }`}
              onClick={() => toggleNotification("taskUpdates")}
              aria-label="Toggle task updates notifications"
            >
              <span></span>
            </button>
          </div>

          <div className="notification-item">
            <div className="notification-icon violet">
              <FaGlobe />
            </div>

            <div className="notification-copy">
              <strong>Project updates</strong>
              <span>
                Notify me about important project activity.
              </span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                notifications.projectUpdates ? "active" : ""
              }`}
              onClick={() =>
                toggleNotification("projectUpdates")
              }
              aria-label="Toggle project updates notifications"
            >
              <span></span>
            </button>
          </div>

          <div className="notification-item">
            <div className="notification-icon green">
              <FaEnvelope />
            </div>

            <div className="notification-copy">
              <strong>Email notifications</strong>
              <span>
                Receive important TaskFlow updates by email.
              </span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                notifications.emailNotifications ? "active" : ""
              }`}
              onClick={() =>
                toggleNotification("emailNotifications")
              }
              aria-label="Toggle email notifications"
            >
              <span></span>
            </button>
          </div>

          <div className="notification-item">
            <div className="notification-icon orange">
              <FaDesktop />
            </div>

            <div className="notification-copy">
              <strong>Desktop notifications</strong>
              <span>
                Show notifications directly on your device.
              </span>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                notifications.desktopNotifications ? "active" : ""
              }`}
              onClick={() =>
                toggleNotification("desktopNotifications")
              }
              aria-label="Toggle desktop notifications"
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderSecuritySection = () => {
    return (
      <section className="settings-section-content">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">SECURITY</span>

            <h2>Password & security</h2>

            <p>
              Keep your TaskFlow account protected with a strong
              password.
            </p>
          </div>

          <div className="section-heading-icon">
            <FaLock />
          </div>
        </div>

        <div className="security-form">
          <div className="security-form-header">
            <div className="security-form-icon">
              <FaKey />
            </div>

            <div>
              <h3>Change password</h3>
              <p>
                Use a strong password that you do not use elsewhere.
              </p>
            </div>
          </div>

          <div className="password-grid">
            <div className="password-field">
              <label>Current password</label>

              <div className="password-input-wrapper">
                <input
                  type={
                    showPasswords.current
                      ? "text"
                      : "password"
                  }
                  value={passwords.current}
                  onChange={(event) =>
                    handlePasswordChange(
                      "current",
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("current")
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

            <div className="password-field">
              <label>New password</label>

              <div className="password-input-wrapper">
                <input
                  type={
                    showPasswords.newPassword
                      ? "text"
                      : "password"
                  }
                  value={passwords.newPassword}
                  onChange={(event) =>
                    handlePasswordChange(
                      "newPassword",
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("newPassword")
                  }
                  aria-label="Toggle new password visibility"
                >
                  {showPasswords.newPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <div className="password-field">
              <label>Confirm new password</label>

              <div className="password-input-wrapper">
                <input
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  value={passwords.confirm}
                  onChange={(event) =>
                    handlePasswordChange(
                      "confirm",
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("confirm")
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
          </div>

          <div className="password-security-note">
            <FaShieldAlt />

            <span>
              Your password should contain at least 8 characters
              and include a combination of letters, numbers and
              symbols.
            </span>
          </div>

          <button
            type="button"
            className="primary-action-button"
            onClick={handleSave}
          >
            <FaSave />
            Update password
          </button>
        </div>
      </section>
    );
  };

  const renderApplicationSection = () => {
    return (
      <section className="settings-section-content">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">APPLICATION</span>

            <h2>About TaskFlow</h2>

            <p>
              Information about your TaskFlow workspace.
            </p>
          </div>

          <div className="section-heading-icon">
            <FaInfoCircle />
          </div>
        </div>

        <div className="application-hero">
          <div className="application-logo">
            TF
          </div>

          <div>
            <span>PROJECT MANAGEMENT PLATFORM</span>

            <h3>TaskFlow</h3>

            <p>
              A modern workspace for organizing projects,
              managing tasks and collaborating with your team.
            </p>
          </div>

          <div className="version-badge">
            v1.0.0
          </div>
        </div>

        <div className="application-grid">
          <div className="application-card">
            <FaCog />

            <div>
              <span>PLATFORM</span>
              <strong>TaskFlow Web</strong>
            </div>
          </div>

          <div className="application-card">
            <FaGlobe />

            <div>
              <span>ENVIRONMENT</span>
              <strong>Production</strong>
            </div>
          </div>

          <div className="application-card">
            <FaShieldAlt />

            <div>
              <span>SECURITY</span>
              <strong>Protected</strong>
            </div>
          </div>

          <div className="application-card">
            <FaCheckCircle />

            <div>
              <span>STATUS</span>
              <strong className="active-text">
                <FaCircle />
                Operational
              </strong>
            </div>
          </div>
        </div>

        <div className="application-footer">
          <span>
            © 2026 TaskFlow. Built for productive teams.
          </span>

          <div>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </section>
    );
  };

  const renderActiveSection = () => {
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

  return (
    <div className="settings-page">
      <div className="settings-background">
        <div className="settings-orb settings-orb-one"></div>
        <div className="settings-orb settings-orb-two"></div>
        <div className="settings-orb settings-orb-three"></div>

        <div className="settings-grid-background"></div>

        <div className="settings-glow settings-glow-one"></div>
        <div className="settings-glow settings-glow-two"></div>
      </div>

      <Sidebar />

      <div className="settings-main">
        <Navbar />

        <main className="settings-content">
          <div className="settings-page-header">
            <div>
              <div className="settings-breadcrumb">
                WORKSPACE
                <span>/</span>
                SETTINGS
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and
                security.
              </p>
            </div>

            <div className="workspace-status">
              <span></span>
              Workspace secure
            </div>
          </div>

          <div className="settings-layout">
            <aside className="settings-sidebar">
              <div className="settings-sidebar-title">
                SETTINGS
              </div>

              <div className="settings-navigation">
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
                      <div className="settings-nav-icon">
                        <Icon />
                      </div>

                      <div className="settings-nav-copy">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </div>

                      <FaChevronRight className="settings-nav-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="protected-workspace">
                <div className="protected-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>Protected workspace</strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>
                </div>

                <FaCheckCircle className="protected-check" />
              </div>
            </aside>

            <div className="settings-panel">
              {renderActiveSection()}
            </div>
          </div>

          <div className="settings-save-bar">
            <div>
              <FaShieldAlt />

              <span>
                Your preferences are stored securely in TaskFlow.
              </span>
            </div>

            {saved && (
              <div className="save-confirmation">
                <FaCheckCircle />
                Saved successfully
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;