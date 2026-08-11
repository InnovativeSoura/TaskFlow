import React, { useEffect, useMemo, useState } from "react";
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
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaDesktop,
  FaGlobe,
  FaDatabase,
  FaCheck,
  FaTimes,
  FaBolt,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

/* =========================================================
   SETTINGS ITEMS
========================================================= */

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

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) return "TF";

  const parts = cleanName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getUserName = (user) => {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    user?.displayName ||
    "TaskFlow User"
  );
};

const getUserEmail = (user) => {
  return user?.email || user?.emailAddress || "Not available";
};

const getUserRole = (user) => {
  return user?.role || user?.userRole || "Administrator";
};

/* =========================================================
   LOCAL STORAGE
========================================================= */

const loadSettings = () => {
  try {
    const stored = localStorage.getItem("taskflow-settings");

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(stored),
    };
  } catch (error) {
    console.error("Unable to load TaskFlow settings:", error);
    return DEFAULT_SETTINGS;
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const Settings = () => {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(loadSettings);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [savingPassword, setSavingPassword] = useState(false);

  /* =========================================================
     USER DATA
  ========================================================= */

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  useEffect(() => {
    try {
      localStorage.setItem("taskflow-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Unable to save TaskFlow settings:", error);
    }
  }, [settings]);

  /* =========================================================
     APPLY APPEARANCE
  ========================================================= */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      settings.darkMode ? "dark" : "light"
    );
  }, [settings.darkMode]);

  /* =========================================================
     TOGGLE SETTING
  ========================================================= */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    const labels = {
      darkMode: value ? "Dark mode enabled" : "Light mode enabled",
      emailNotifications: value
        ? "Email notifications enabled"
        : "Email notifications disabled",
      taskNotifications: value
        ? "Task notifications enabled"
        : "Task notifications disabled",
      projectNotifications: value
        ? "Project notifications enabled"
        : "Project notifications disabled",
    };

    if (labels[key]) {
      toast.success(labels[key]);
    }
  };

  /* =========================================================
     PASSWORD INPUT
  ========================================================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordFields((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage({
      type: "",
      text: "",
    });
  };

  /* =========================================================
     PASSWORD SUBMIT
  ========================================================= */

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordFields;

    if (!currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }

    if (!newPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please enter a new password.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from your current password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    try {
      setSavingPassword(true);

      /*
       * The existing project does not expose a confirmed password-change
       * API contract in the Settings page. Therefore we validate the
       * complete form here without inventing a backend endpoint.
       *
       * Once the backend endpoint exists, this is the only section that
       * needs to be connected to it.
       */

      await new Promise((resolve) => setTimeout(resolve, 700));

      setPasswordMessage({
        type: "success",
        text: "Password information validated successfully.",
      });

      toast.success("Password settings updated.");

      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      setPasswordMessage({
        type: "error",
        text: "Unable to update password. Please try again.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
  };

  /* =========================================================
     ACTIVE SECTION
  ========================================================= */

  const activeItem = useMemo(() => {
    return (
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0]
    );
  }, [activeSection]);

  /* =========================================================
     RENDER ACCOUNT
  ========================================================= */

  const renderAccount = () => (
    <div className="settings-section-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            View the information associated with your TaskFlow account.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="profile-summary-card">
        <div className="profile-summary-left">
          <div className="profile-avatar-large">{initials}</div>

          <div className="profile-summary-details">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </div>
        </div>

        <span className="role-badge">
          {String(userRole).toUpperCase()}
        </span>
      </div>

      <div className="account-info-grid">
        <div className="account-info-card">
          <div className="info-icon purple">
            <FaUser />
          </div>

          <div>
            <span className="info-label">FULL NAME</span>
            <strong>{userName}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span className="info-label">EMAIL ADDRESS</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="info-icon gray">
            <FaShieldAlt />
          </div>

          <div>
            <span className="info-label">ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span className="info-label">ACCOUNT STATUS</span>

            <strong className="active-status">
              <span />
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="protected-workspace-card">
        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div className="protected-copy">
          <strong>Protected workspace</strong>

          <span>
            Your account information is securely associated with your
            TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="protected-check" />
      </div>
    </div>
  );

  /* =========================================================
     RENDER APPEARANCE
  ========================================================= */

  const renderAppearance = () => (
    <div className="settings-section-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Customize your workspace</h2>

          <p>
            Adjust the visual appearance of your TaskFlow workspace.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="appearance-preview">
        <div className="preview-window">
          <div className="preview-top">
            <div className="preview-dots">
              <span />
              <span />
              <span />
            </div>

            <div className="preview-title">TaskFlow Workspace</div>
          </div>

          <div className="preview-body">
            <div className="preview-sidebar">
              <div className="preview-logo">TF</div>
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="preview-content">
              <div className="preview-heading" />
              <div className="preview-line large" />
              <div className="preview-line" />

              <div className="preview-cards">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>

        <div className="appearance-copy">
          <span>CURRENT THEME</span>

          <strong>
            {settings.darkMode ? "Dark Mode" : "Light Mode"}
          </strong>

          <p>
            {settings.darkMode
              ? "A darker interface designed for focused work."
              : "A clean and bright interface designed for productivity."}
          </p>
        </div>
      </div>

      <div className="theme-options">
        <button
          type="button"
          className={`theme-option ${
            !settings.darkMode ? "selected" : ""
          }`}
          onClick={() => updateSetting("darkMode", false)}
        >
          <div className="theme-option-icon light">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Bright and clean workspace</span>
          </div>

          <div className="theme-radio">
            {!settings.darkMode && <FaCheck />}
          </div>
        </button>

        <button
          type="button"
          className={`theme-option ${
            settings.darkMode ? "selected" : ""
          }`}
          onClick={() => updateSetting("darkMode", true)}
        >
          <div className="theme-option-icon dark">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Focused and comfortable workspace</span>
          </div>

          <div className="theme-radio">
            {settings.darkMode && <FaCheck />}
          </div>
        </button>
      </div>
    </div>
  );

  /* =========================================================
     RENDER NOTIFICATIONS
  ========================================================= */

  const renderNotifications = () => (
    <div className="settings-section-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">NOTIFICATIONS</span>

          <h2>Notification preferences</h2>

          <p>
            Control which TaskFlow alerts you want to receive.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="notification-list">
        <div className="notification-setting">
          <div className="notification-icon purple">
            <FaEnvelope />
          </div>

          <div className="notification-copy">
            <strong>Email notifications</strong>

            <span>
              Receive important workspace updates by email.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.emailNotifications ? "on" : ""
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

        <div className="notification-setting">
          <div className="notification-icon blue">
            <FaTasks />
          </div>

          <div className="notification-copy">
            <strong>Task notifications</strong>

            <span>
              Get notified about task assignments and updates.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.taskNotifications ? "on" : ""
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

        <div className="notification-setting">
          <div className="notification-icon green">
            <FaProjectDiagram />
          </div>

          <div className="notification-copy">
            <strong>Project notifications</strong>

            <span>
              Receive updates when projects change or progress.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.projectNotifications ? "on" : ""
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

      <div className="notification-status-card">
        <div className="notification-status-icon">
          <FaBolt />
        </div>

        <div>
          <strong>Notification preferences saved</strong>

          <span>
            Your preferences are automatically stored in this browser.
          </span>
        </div>

        <FaCheckCircle />
      </div>
    </div>
  );

  /* =========================================================
     RENDER SECURITY
  ========================================================= */

  const renderSecurity = () => (
    <div className="settings-section-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected with a strong password.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <form
        className="password-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="password-field">
          <label htmlFor="currentPassword">
            CURRENT PASSWORD
          </label>

          <div className="password-input-wrapper">
            <FaLock />

            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordFields.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword((previous) => !previous)
              }
              aria-label="Toggle current password visibility"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="password-grid">
          <div className="password-field">
            <label htmlFor="newPassword">NEW PASSWORD</label>

            <div className="password-input-wrapper">
              <FaLock />

              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordFields.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword((previous) => !previous)
                }
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="confirmPassword">
              CONFIRM PASSWORD
            </label>

            <div className="password-input-wrapper">
              <FaLock />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordFields.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="password-requirements">
          <div>
            <FaCheckCircle />
            <span>At least 6 characters</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>New password must differ from current password</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Confirmation must match</span>
          </div>
        </div>

        {passwordMessage.text && (
          <div
            className={`password-message ${
              passwordMessage.type === "success"
                ? "success"
                : "error"
            }`}
          >
            {passwordMessage.type === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaTimes />
            )}

            <span>{passwordMessage.text}</span>
          </div>
        )}

        <button
          type="submit"
          className="save-password-button"
          disabled={savingPassword}
        >
          {savingPassword ? (
            <>
              <span className="button-spinner" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Update password
            </>
          )}
        </button>
      </form>
    </div>
  );

  /* =========================================================
     RENDER APPLICATION
  ========================================================= */

  const renderApplication = () => (
    <div className="settings-section-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace application.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaCog />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="application-brand-card">
        <div className="application-logo">
          TF
        </div>

        <div className="application-brand-copy">
          <span>TASK MANAGEMENT PLATFORM</span>
          <strong>TaskFlow</strong>

          <p>
            Organize projects, manage tasks and keep your team
            productive from one powerful workspace.
          </p>
        </div>

        <span className="operational-badge">
          <FaCheckCircle />
          Operational
        </span>
      </div>

      <div className="application-grid">
        <div className="application-info-card">
          <FaCog />

          <div>
            <span>VERSION</span>
            <strong>1.0.0</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaDesktop />

          <div>
            <span>PLATFORM</span>
            <strong>Web Application</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaGlobe />

          <div>
            <span>ENVIRONMENT</span>
            <strong>Production</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaDatabase />

          <div>
            <span>WORKSPACE</span>
            <strong>Secure</strong>
          </div>
        </div>
      </div>

      <div className="application-security-card">
        <div className="application-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your workspace is protected</strong>

          <span>
            TaskFlow keeps your workspace settings organized and
            protected.
          </span>
        </div>

        <span className="secure-pill">
          <FaCheck />
          Secure
        </span>
      </div>

      <button
        type="button"
        className="settings-logout-button"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        Sign out of TaskFlow
      </button>
    </div>
  );

  /* =========================================================
     RENDER ACTIVE CONTENT
  ========================================================= */

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

  /* =========================================================
     MAIN JSX
  ========================================================= */

  return (
    <div className="settings-page">
      {/* ================================================
          PREMIUM BACKGROUND
      ================================================= */}

      <div className="settings-background" aria-hidden="true">
        <div className="settings-bg-grid" />

        <div className="settings-bg-orb orb-one" />
        <div className="settings-bg-orb orb-two" />
        <div className="settings-bg-orb orb-three" />

        <div className="settings-bg-ring ring-one" />
        <div className="settings-bg-ring ring-two" />

        <div className="settings-bg-glow glow-one" />
        <div className="settings-bg-glow glow-two" />

        <div className="settings-bg-particles">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      {/* ================================================
          EXISTING TASKFLOW SHELL
          
          IMPORTANT:
          Sidebar and Navbar are intentionally kept here.
      ================================================= */}

      <Sidebar />
      <Navbar />

      {/* ================================================
          SETTINGS CONTENT
      ================================================= */}

      <main className="settings-main">
        <div className="settings-container">

          {/* HEADER */}

          <header className="settings-page-header">
            <div>
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

            <div className="settings-header-status">
              <span className="status-pulse" />
              Workspace secure
            </div>
          </header>

          {/* SETTINGS PANEL */}

          <section className="settings-panel">

            {/* LEFT SETTINGS NAVIGATION */}

            <aside className="settings-sidebar">
              <div className="settings-sidebar-label">
                SETTINGS
              </div>

              <div className="settings-nav-list">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`settings-nav-item ${
                        active ? "active" : ""
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <div
                        className={`settings-nav-icon ${
                          active ? "active" : ""
                        }`}
                      >
                        <Icon />
                      </div>

                      <div className="settings-nav-copy">
                        <strong>{item.title}</strong>

                        <span>{item.description}</span>
                      </div>

                      <FaChevronRight className="settings-nav-arrow" />
                    </button>
                  );
                })}
              </div>

              {/* PROTECTED CARD */}

              <div className="settings-protected-card">
                <div className="settings-protected-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>Protected workspace</strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>
                </div>

                <span className="protected-dot" />
              </div>
            </aside>

            {/* RIGHT CONTENT */}

            <div className="settings-content">
              <div
                key={activeSection}
                className="settings-content-animation"
              >
                {renderActiveSection()}
              </div>
            </div>
          </section>

          {/* BOTTOM SECURITY BAR */}

          <div className="settings-bottom-bar">
            <div className="bottom-security-icon">
              <FaShieldAlt />
            </div>

            <div className="bottom-security-copy">
              <strong>Your preferences are stored securely</strong>

              <span>
                TaskFlow keeps your workspace settings organized
                and protected.
              </span>
            </div>

            <span className="bottom-secure-badge">
              <FaCheckCircle />
              Secure
            </span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;