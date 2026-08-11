import React, { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaChevronRight,
  FaShieldAlt,
  FaCog,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaDesktop,
  FaGlobe,
  FaCode,
  FaServer,
  FaDatabase,
  FaKey,
  FaCircle,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

const SETTINGS_STORAGE_KEY = "taskflow_settings";

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

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "SP";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const getUserName = (user) => {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra"
  );
};

const getUserEmail = (user) => {
  return user?.email || "soura@gmail.com";
};

const getUserRole = (user) => {
  return user?.role || "Administrator";
};

const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!saved) return DEFAULT_SETTINGS;

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

function Settings() {
  const { user } = useAuth();

  const initialName = getUserName(user);
  const initialEmail = getUserEmail(user);
  const initialRole = getUserRole(user);

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(loadSavedSettings);

  const [profile, setProfile] = useState({
    name: initialName,
    email: initialEmail,
  });

  const [savedProfile, setSavedProfile] = useState({
    name: initialName,
    email: initialEmail,
  });

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

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [saveMessage, setSaveMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProfile({
      name: initialName,
      email: initialEmail,
    });

    setSavedProfile({
      name: initialName,
      email: initialEmail,
    });
  }, [initialName, initialEmail]);

  const activeItem = useMemo(() => {
    return (
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0]
    );
  }, [activeSection]);

  const ActiveIcon = activeItem.icon;

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaveMessage("");
  };

  const updateProfile = (key, value) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaveMessage("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSavedProfile(profile);

      /*
       * This saves the Settings UI preferences locally.
       *
       * If your backend already has a profile/settings endpoint,
       * this is the place to connect the API request.
       */

      await new Promise((resolve) => setTimeout(resolve, 450));

      setSaveMessage("All changes saved successfully.");
    } catch {
      setSaveMessage("Unable to save your settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);

    setProfile({
      ...savedProfile,
    });

    setPasswordMessage({
      type: "",
      text: "",
    });

    setSaveMessage("Changes have been reset.");
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPasswordMessage({
      type: "",
      text: "",
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        label: "Enter a password",
        score: 0,
      };
    }

    let score = 0;

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) {
      return {
        label: "Weak",
        score,
      };
    }

    if (score <= 3) {
      return {
        label: "Medium",
        score,
      };
    }

    return {
      label: "Strong",
      score,
    };
  };

  const passwordStrength = getPasswordStrength(passwords.newPassword);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwords;

    if (!currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Enter your current password.",
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

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setPasswordMessage({
      type: "success",
      text: "Password validation completed successfully.",
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const renderAccountSection = () => {
    return (
      <div className="settings-section-content">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">ACCOUNT</span>

            <h2>Account information</h2>

            <p>
              Manage your personal identity and TaskFlow workspace
              information.
            </p>
          </div>

          <div className="settings-header-icon">
            <FaUser />
          </div>
        </div>

        <div className="profile-hero">
          <div className="profile-avatar-large">
            {getInitials(profile.name)}
            <span className="profile-online-dot" />
          </div>

          <div className="profile-main-info">
            <div className="profile-name-row">
              <h3>{profile.name || "Your name"}</h3>

              <span className="role-badge">
                {initialRole}
              </span>
            </div>

            <p>{profile.email || "No email address"}</p>

            <div className="profile-meta">
              <span>
                <FaCircle />
                Active account
              </span>

              <span>
                <FaShieldAlt />
                Protected workspace
              </span>
            </div>
          </div>

          <div className="profile-edit-indicator">
            <FaEdit />
          </div>
        </div>

        <div className="settings-form-grid">
          <div className="settings-field">
            <label htmlFor="settings-name">
              Full name
            </label>

            <div className="input-wrapper">
              <FaUser />

              <input
                id="settings-name"
                type="text"
                value={profile.name}
                onChange={(event) =>
                  updateProfile("name", event.target.value)
                }
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="settings-email">
              Email address
            </label>

            <div className="input-wrapper">
              <FaEnvelope />

              <input
                id="settings-email"
                type="email"
                value={profile.email}
                onChange={(event) =>
                  updateProfile("email", event.target.value)
                }
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <div className="account-info-grid">
          <div className="info-card">
            <div className="info-card-icon">
              <FaShieldAlt />
            </div>

            <div>
              <span>Role</span>
              <strong>{initialRole}</strong>
            </div>
          </div>

          <div className="info-card success-card">
            <div className="info-card-icon">
              <FaCheckCircle />
            </div>

            <div>
              <span>Account status</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        <div className="protected-banner">
          <div className="protected-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Protected workspace</strong>

            <p>
              Your TaskFlow account information is securely
              associated with your workspace.
            </p>
          </div>

          <FaCheckCircle className="protected-check" />
        </div>
      </div>
    );
  };

  const renderAppearanceSection = () => {
    return (
      <div className="settings-section-content">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">APPEARANCE</span>

            <h2>Customize your workspace</h2>

            <p>
              Choose the visual experience that works best for
              your TaskFlow workspace.
            </p>
          </div>

          <div className="settings-header-icon">
            {settings.darkMode ? <FaMoon /> : <FaSun />}
          </div>
        </div>

        <div className="appearance-preview">
          <div
            className={`appearance-preview-window ${
              settings.darkMode ? "preview-dark" : "preview-light"
            }`}
          >
            <div className="preview-topbar">
              <div className="preview-logo">
                TF
              </div>

              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="preview-body">
              <div className="preview-sidebar">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="preview-content">
                <div className="preview-title" />
                <div className="preview-line" />
                <div className="preview-cards">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          <div className="appearance-preview-copy">
            <span className="preview-label">
              CURRENT THEME
            </span>

            <strong>
              {settings.darkMode
                ? "Dark workspace"
                : "Light workspace"}
            </strong>

            <p>
              {settings.darkMode
                ? "A focused dark interface designed for low-light environments."
                : "A clean and bright interface designed for maximum clarity."}
            </p>
          </div>
        </div>

        <div className="theme-options">
          <button
            type="button"
            className={`theme-option ${
              !settings.darkMode ? "active" : ""
            }`}
            onClick={() => updateSetting("darkMode", false)}
          >
            <div className="theme-option-icon">
              <FaSun />
            </div>

            <div>
              <strong>Light mode</strong>
              <span>Bright and clean</span>
            </div>

            {settings.darkMode === false && (
              <FaCheck className="theme-selected" />
            )}
          </button>

          <button
            type="button"
            className={`theme-option ${
              settings.darkMode ? "active" : ""
            }`}
            onClick={() => updateSetting("darkMode", true)}
          >
            <div className="theme-option-icon">
              <FaMoon />
            </div>

            <div>
              <strong>Dark mode</strong>
              <span>Focused and comfortable</span>
            </div>

            {settings.darkMode && (
              <FaCheck className="theme-selected" />
            )}
          </button>
        </div>

        <div className="settings-note">
          <FaPalette />

          <div>
            <strong>Workspace appearance</strong>

            <p>
              Your selected appearance is saved locally so your
              preference remains available when you return.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsSection = () => {
    return (
      <div className="settings-section-content">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">
              NOTIFICATIONS
            </span>

            <h2>Manage your alerts</h2>

            <p>
              Control which TaskFlow notifications you want to
              receive.
            </p>
          </div>

          <div className="settings-header-icon">
            <FaBell />
          </div>
        </div>

        <div className="notification-summary">
          <div className="notification-summary-icon">
            <FaBell />
          </div>

          <div>
            <strong>Notification preferences</strong>

            <p>
              Choose how TaskFlow keeps you informed about
              important workspace activity.
            </p>
          </div>
        </div>

        <div className="notification-list">
          <div className="notification-row">
            <div className="notification-icon">
              <FaEnvelope />
            </div>

            <div className="notification-copy">
              <strong>Email notifications</strong>

              <p>
                Receive important workspace updates by email.
              </p>
            </div>

            <button
              type="button"
              className={`toggle-switch ${
                settings.emailNotifications
                  ? "on"
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

          <div className="notification-row">
            <div className="notification-icon task-icon">
              <FaTasks />
            </div>

            <div className="notification-copy">
              <strong>Task notifications</strong>

              <p>
                Get notified when tasks are created, assigned or
                updated.
              </p>
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

          <div className="notification-row">
            <div className="notification-icon project-icon">
              <FaProjectDiagram />
            </div>

            <div className="notification-copy">
              <strong>Project notifications</strong>

              <p>
                Stay updated when projects change or progress.
              </p>
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

        <div className="notification-status">
          <FaCheckCircle />

          <div>
            <strong>
              {[
                settings.emailNotifications,
                settings.taskNotifications,
                settings.projectNotifications,
              ].filter(Boolean).length}{" "}
              of 3 notification types enabled
            </strong>

            <p>
              Changes are saved when you click Save changes.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSecuritySection = () => {
    return (
      <div className="settings-section-content">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">SECURITY</span>

            <h2>Password & security</h2>

            <p>
              Keep your TaskFlow account protected with a strong
              password.
            </p>
          </div>

          <div className="settings-header-icon">
            <FaLock />
          </div>
        </div>

        <div className="security-status-card">
          <div className="security-status-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Your workspace is protected</strong>

            <p>
              Use a unique password containing a combination of
              letters, numbers and special characters.
            </p>
          </div>

          <span className="security-status-badge">
            <FaCheckCircle />
            Secure
          </span>
        </div>

        <form
          className="password-form"
          onSubmit={handlePasswordSubmit}
        >
          <div className="password-form-title">
            <div>
              <span className="settings-eyebrow">
                CHANGE PASSWORD
              </span>

              <h3>Update your password</h3>
            </div>

            <FaKey />
          </div>

          <div className="settings-field">
            <label htmlFor="current-password">
              Current password
            </label>

            <div className="input-wrapper password-input">
              <FaLock />

              <input
                id="current-password"
                type={
                  showPasswords.current
                    ? "text"
                    : "password"
                }
                value={passwords.currentPassword}
                onChange={(event) =>
                  handlePasswordChange(
                    "currentPassword",
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

          <div className="password-grid">
            <div className="settings-field">
              <label htmlFor="new-password">
                New password
              </label>

              <div className="input-wrapper password-input">
                <FaKey />

                <input
                  id="new-password"
                  type={
                    showPasswords.new
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
                    togglePasswordVisibility("new")
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

              {passwords.newPassword && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <span
                        key={bar}
                        className={
                          bar <= passwordStrength.score
                            ? "filled"
                            : ""
                        }
                      />
                    ))}
                  </div>

                  <span>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="settings-field">
              <label htmlFor="confirm-password">
                Confirm new password
              </label>

              <div className="input-wrapper password-input">
                <FaCheckCircle />

                <input
                  id="confirm-password"
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    handlePasswordChange(
                      "confirmPassword",
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

          {passwordMessage.text && (
            <div
              className={`password-message ${passwordMessage.type}`}
            >
              {passwordMessage.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTimes />
              )}

              {passwordMessage.text}
            </div>
          )}

          <div className="password-actions">
            <button type="submit" className="primary-action">
              <FaKey />
              Validate password change
            </button>
          </div>
        </form>

        <div className="security-tips">
          <div className="security-tip">
            <FaCheckCircle />
            <span>At least 6 characters</span>
          </div>

          <div className="security-tip">
            <FaCheckCircle />
            <span>Use numbers and symbols</span>
          </div>

          <div className="security-tip">
            <FaCheckCircle />
            <span>Avoid reused passwords</span>
          </div>
        </div>
      </div>
    );
  };

  const renderApplicationSection = () => {
    return (
      <div className="settings-section-content">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">
              APPLICATION
            </span>

            <h2>TaskFlow information</h2>

            <p>
              Information about your TaskFlow application and
              current environment.
            </p>
          </div>

          <div className="settings-header-icon">
            <FaCog />
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
              A modern workspace for managing projects, tasks,
              teams and productivity.
            </p>
          </div>

          <div className="application-version">
            <span>VERSION</span>
            <strong>1.0.0</strong>
          </div>
        </div>

        <div className="application-grid">
          <div className="application-card">
            <div className="application-card-icon">
              <FaDesktop />
            </div>

            <div>
              <span>Platform</span>
              <strong>Web Application</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>

          <div className="application-card">
            <div className="application-card-icon">
              <FaGlobe />
            </div>

            <div>
              <span>Environment</span>
              <strong>Production</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>

          <div className="application-card">
            <div className="application-card-icon">
              <FaServer />
            </div>

            <div>
              <span>Backend</span>
              <strong>Node.js / Express</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>

          <div className="application-card">
            <div className="application-card-icon">
              <FaDatabase />
            </div>

            <div>
              <span>Database</span>
              <strong>MongoDB</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>

          <div className="application-card">
            <div className="application-card-icon">
              <FaCode />
            </div>

            <div>
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>

          <div className="application-card">
            <div className="application-card-icon">
              <FaShieldAlt />
            </div>

            <div>
              <span>System status</span>
              <strong>Operational</strong>
            </div>

            <FaCheckCircle className="application-check" />
          </div>
        </div>

        <div className="application-footer-card">
          <div className="application-footer-icon">
            <FaInfoCircle />
          </div>

          <div>
            <strong>About TaskFlow</strong>

            <p>
              TaskFlow is designed to provide a centralized,
              organized and secure environment for modern project
              management.
            </p>
          </div>

          <span className="operational-badge">
            <FaCircle />
            Operational
          </span>
        </div>
      </div>
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
    <div
      className={`settings-page ${
        settings.darkMode ? "settings-dark" : ""
      }`}
    >
      <Sidebar />

      <div className="settings-shell">
        <Navbar />

        <main className="settings-main">
          <div className="settings-background">
            <div className="settings-orb settings-orb-one" />
            <div className="settings-orb settings-orb-two" />
            <div className="settings-orb settings-orb-three" />
            <div className="settings-grid-pattern" />
          </div>

          <div className="settings-container">
            <header className="settings-page-header">
              <div>
                <div className="settings-breadcrumb">
                  <span>WORKSPACE</span>
                  <FaChevronRight />
                  <strong>SETTINGS</strong>
                </div>

                <h1>Settings</h1>

                <p>
                  Manage your account, workspace preferences,
                  notifications and security.
                </p>
              </div>

              <div className="workspace-secure-badge">
                <FaCircle />
                <FaShieldAlt />
                <span>Workspace secure</span>
              </div>
            </header>

            <section className="settings-layout">
              <aside className="settings-navigation">
                <div className="settings-navigation-title">
                  SETTINGS
                </div>

                <div className="settings-navigation-list">
                  {SETTINGS_ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`settings-nav-item ${
                          activeSection === item.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveSection(item.id)
                        }
                      >
                        <span className="settings-nav-icon">
                          <Icon />
                        </span>

                        <span className="settings-nav-copy">
                          <strong>{item.label}</strong>
                          <small>{item.description}</small>
                        </span>

                        <FaChevronRight className="settings-nav-arrow" />
                      </button>
                    );
                  })}
                </div>

                <div className="settings-sidebar-security">
                  <div className="sidebar-security-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Protected workspace</strong>
                    <span>Your TaskFlow account is secure.</span>
                  </div>

                  <FaCheckCircle />
                </div>
              </aside>

              <section className="settings-content">
                <div
                  key={activeSection}
                  className="settings-content-animation"
                >
                  {renderActiveSection()}
                </div>

                <div className="settings-content-footer">
                  <div className="save-status">
                    <span
                      className={
                        saveMessage
                          ? "save-dot active"
                          : "save-dot"
                      }
                    />

                    <div>
                      <strong>
                        {saveMessage ||
                          "All changes are currently saved"}
                      </strong>

                      <span>
                        Your workspace preferences stay
                        organized and protected.
                      </span>
                    </div>
                  </div>

                  <div className="settings-footer-actions">
                    <button
                      type="button"
                      className="reset-button"
                      onClick={handleReset}
                    >
                      <FaUndo />
                      Reset
                    </button>

                    <button
                      type="button"
                      className="save-button"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="save-spinner" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </section>

            <div className="settings-bottom-security">
              <div className="bottom-security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  Your preferences are stored securely
                </strong>

                <span>
                  TaskFlow keeps your workspace settings organized
                  and protected.
                </span>
              </div>

              <div className="bottom-security-status">
                <FaCheckCircle />
                Secure
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;