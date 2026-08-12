// src/pages/Settings.jsx

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
  FaSave,
  FaUndo,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaDesktop,
  FaServer,
  FaDatabase,
  FaCode,
  FaGlobe,
  FaCheck,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "./Settings.css";

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
  compactMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  desktopNotifications: true,
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "TF";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
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
  "Administrator";

const loadSettings = () => {
  try {
    const saved = localStorage.getItem("taskflow_settings");

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const Settings = () => {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(loadSettings);

  const [profile, setProfile] = useState({
    name: getUserName(user),
    email: getUserEmail(user),
  });

  const [passwordFields, setPasswordFields] = useState({
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

  const [hasChanges, setHasChanges] = useState(false);

  const [profileEditing, setProfileEditing] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setProfile({
      name: getUserName(user),
      email: getUserEmail(user),
    });
  }, [user]);

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  const activeItem = useMemo(
    () =>
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0],
    [activeSection]
  );

  const ActiveIcon = activeItem.icon;

  useEffect(() => {
    document.documentElement.classList.toggle(
      "taskflow-settings-dark",
      settings.darkMode
    );

    localStorage.setItem(
      "taskflow_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setHasChanges(true);
    setSaveMessage("");
  };

  const saveSettings = () => {
    localStorage.setItem(
      "taskflow_settings",
      JSON.stringify(settings)
    );

    setHasChanges(false);
    setSaveMessage("All changes saved successfully.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(
      "taskflow_settings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    setHasChanges(false);
    setSaveMessage("Settings restored to default.");
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileSaved(false);
  };

  const saveProfile = () => {
    if (!profile.name.trim()) {
      setSaveMessage("Please enter your full name.");
      return;
    }

    /*
     * The profile is saved locally for now.
     * Replace this with your existing users API when
     * the profile update endpoint is connected.
     */
    localStorage.setItem(
      "taskflow_profile",
      JSON.stringify(profile)
    );

    setProfileEditing(false);
    setProfileSaved(true);

    setTimeout(() => {
      setProfileSaved(false);
    }, 3000);
  };

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

  const handlePasswordSubmit = (event) => {
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

    /*
     * Frontend validation is complete.
     * Connect this handler to your backend password endpoint
     * when the password API is available.
     */

    setPasswordMessage({
      type: "success",
      text: "Password validation successful. Connect your password API to complete the update.",
    });

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const renderAccount = () => (
    <div className="settings-section-content">
      <div className="settings-profile-hero">
        <div className="settings-avatar-large">
          {initials}
          <span className="settings-avatar-online" />
        </div>

        <div className="settings-profile-info">
          <div className="settings-profile-name-row">
            <h3>{userName}</h3>
            <span className="settings-role-badge">
              {userRole}
            </span>
          </div>

          <p>{userEmail}</p>

          <div className="settings-profile-meta">
            <span>
              <FaCheckCircle />
              Active account
            </span>

            <span>
              <FaShieldAlt />
              Protected workspace
            </span>
          </div>
        </div>

        <button
          type="button"
          className="settings-outline-button"
          onClick={() => setProfileEditing((value) => !value)}
        >
          <FaCog />
          {profileEditing ? "Cancel" : "Edit profile"}
        </button>
      </div>

      {profileEditing && (
        <div className="settings-edit-profile">
          <div className="settings-field">
            <label htmlFor="profile-name">
              Full name
            </label>

            <div className="settings-input-wrapper">
              <FaUser />

              <input
                id="profile-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="profile-email">
              Email address
            </label>

            <div className="settings-input-wrapper">
              <FaEnvelope />

              <input
                id="profile-email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            type="button"
            className="settings-primary-button"
            onClick={saveProfile}
          >
            <FaSave />
            Save profile
          </button>
        </div>
      )}

      {profileSaved && (
        <div className="settings-success-banner">
          <FaCheckCircle />
          Profile information saved successfully.
        </div>
      )}

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaUser />
          </div>

          <div>
            <span>Full name</span>
            <strong>{profile.name}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>Email address</span>
            <strong>{profile.email}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon violet">
            <FaShieldAlt />
          </div>

          <div>
            <span>Role</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>Account status</span>
            <strong className="status-active">
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="settings-protected-card">
        <div className="settings-protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>
          <p>
            Your TaskFlow account information is securely
            associated with your workspace.
          </p>
        </div>

        <FaCheckCircle className="settings-card-check" />
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="settings-section-content">
      <div className="settings-option-card">
        <div className="settings-option-icon">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>

        <div className="settings-option-content">
          <h3>Interface theme</h3>

          <p>
            Choose the visual appearance of your TaskFlow
            workspace.
          </p>

          <div className="settings-theme-selector">
            <button
              type="button"
              className={`settings-theme-option ${
                !settings.darkMode ? "selected" : ""
              }`}
              onClick={() =>
                updateSetting("darkMode", false)
              }
            >
              <FaSun />
              <span>
                <strong>Light</strong>
                <small>Clean and bright</small>
              </span>

              {!settings.darkMode && (
                <FaCheck className="theme-check" />
              )}
            </button>

            <button
              type="button"
              className={`settings-theme-option ${
                settings.darkMode ? "selected" : ""
              }`}
              onClick={() =>
                updateSetting("darkMode", true)
              }
            >
              <FaMoon />
              <span>
                <strong>Dark</strong>
                <small>Comfortable at night</small>
              </span>

              {settings.darkMode && (
                <FaCheck className="theme-check" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-option-card">
        <div className="settings-option-icon">
          <FaDesktop />
        </div>

        <div className="settings-option-content">
          <h3>Workspace density</h3>

          <p>
            Control how much information is displayed on
            your screen.
          </p>

          <div className="settings-toggle-row">
            <div>
              <strong>Compact workspace</strong>
              <span>
                Reduce spacing between workspace elements.
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.compactMode ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "compactMode",
                  !settings.compactMode
                )
              }
              aria-label="Toggle compact workspace"
            >
              <span />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-section-content">
      <div className="settings-notification-header">
        <div>
          <h3>Notification preferences</h3>
          <p>
            Decide which TaskFlow events should notify you.
          </p>
        </div>

        <div className="settings-notification-status">
          <FaBell />
          {Object.values(settings).filter(Boolean).length} active
        </div>
      </div>

      <div className="settings-notification-list">
        <div className="settings-notification-item">
          <div className="settings-notification-icon">
            <FaEnvelope />
          </div>

          <div className="settings-notification-text">
            <strong>Email notifications</strong>
            <span>
              Receive important TaskFlow updates by email.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.emailNotifications ? "active" : ""
            }`}
            onClick={() =>
              updateSetting(
                "emailNotifications",
                !settings.emailNotifications
              )
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon">
            <FaTasks />
          </div>

          <div className="settings-notification-text">
            <strong>Task notifications</strong>
            <span>
              Get notified about task assignments,
              updates and deadlines.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.taskNotifications ? "active" : ""
            }`}
            onClick={() =>
              updateSetting(
                "taskNotifications",
                !settings.taskNotifications
              )
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon">
            <FaProjectDiagram />
          </div>

          <div className="settings-notification-text">
            <strong>Project notifications</strong>
            <span>
              Stay updated about project activity and
              progress.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.projectNotifications ? "active" : ""
            }`}
            onClick={() =>
              updateSetting(
                "projectNotifications",
                !settings.projectNotifications
              )
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon">
            <FaDesktop />
          </div>

          <div className="settings-notification-text">
            <strong>Desktop notifications</strong>
            <span>
              Show browser notifications when TaskFlow
              requires your attention.
            </span>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.desktopNotifications ? "active" : ""
            }`}
            onClick={() =>
              updateSetting(
                "desktopNotifications",
                !settings.desktopNotifications
              )
            }
          >
            <span />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="settings-section-content">
      <div className="settings-security-banner">
        <div className="settings-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your account is protected</strong>

          <p>
            Keep your password strong and never share it
            with anyone.
          </p>
        </div>

        <span>
          <FaCheckCircle />
          Secure
        </span>
      </div>

      <form
        className="settings-password-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="settings-password-heading">
          <div>
            <h3>Change password</h3>
            <p>
              Update your password to keep your account
              secure.
            </p>
          </div>

          <FaKey />
        </div>

        <div className="settings-field">
          <label htmlFor="currentPassword">
            Current password
          </label>

          <div className="settings-input-wrapper">
            <FaLock />

            <input
              id="currentPassword"
              name="currentPassword"
              type={
                showPasswords.current
                  ? "text"
                  : "password"
              }
              value={passwordFields.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />

            <button
              type="button"
              className="password-visibility"
              onClick={() => togglePassword("current")}
            >
              {showPasswords.current ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
        </div>

        <div className="settings-password-grid">
          <div className="settings-field">
            <label htmlFor="newPassword">
              New password
            </label>

            <div className="settings-input-wrapper">
              <FaKey />

              <input
                id="newPassword"
                name="newPassword"
                type={
                  showPasswords.new
                    ? "text"
                    : "password"
                }
                value={passwordFields.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimum 6 characters"
              />

              <button
                type="button"
                className="password-visibility"
                onClick={() => togglePassword("new")}
              >
                {showPasswords.new ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="settings-input-wrapper">
              <FaKey />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showPasswords.confirm
                    ? "text"
                    : "password"
                }
                value={passwordFields.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
              />

              <button
                type="button"
                className="password-visibility"
                onClick={() => togglePassword("confirm")}
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
            className={`settings-password-message ${passwordMessage.type}`}
          >
            {passwordMessage.type === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaInfoCircle />
            )}

            {passwordMessage.text}
          </div>
        )}

        <button
          type="submit"
          className="settings-primary-button"
        >
          <FaLock />
          Update password
        </button>
      </form>
    </div>
  );

  const renderApplication = () => (
    <div className="settings-section-content">
      <div className="settings-application-hero">
        <div className="settings-taskflow-logo">
          TF
        </div>

        <div>
          <span>PROJECT MANAGEMENT PLATFORM</span>
          <h3>TaskFlow</h3>
          <p>
            A modern workspace for managing projects,
            tasks, teams and productivity.
          </p>
        </div>

        <div className="settings-version">
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>
      </div>

      <div className="settings-system-grid">
        <div className="settings-system-card">
          <FaDesktop />
          <span>Platform</span>
          <strong>Web Application</strong>
        </div>

        <div className="settings-system-card">
          <FaGlobe />
          <span>Environment</span>
          <strong>Production</strong>
        </div>

        <div className="settings-system-card">
          <FaServer />
          <span>Backend</span>
          <strong>Node.js / Express</strong>
        </div>

        <div className="settings-system-card">
          <FaDatabase />
          <span>Database</span>
          <strong>MongoDB</strong>
        </div>

        <div className="settings-system-card">
          <FaCode />
          <span>Frontend</span>
          <strong>React + Vite</strong>
        </div>

        <div className="settings-system-card">
          <FaShieldAlt />
          <span>System status</span>
          <strong className="status-active">
            Operational
          </strong>
        </div>
      </div>

      <div className="settings-about-card">
        <div className="settings-about-icon">
          <FaInfoCircle />
        </div>

        <div>
          <h3>About TaskFlow</h3>

          <p>
            TaskFlow is designed to provide a centralized,
            organized and secure environment for modern
            project management.
          </p>
        </div>

        <div className="settings-operational-badge">
          <FaCheckCircle />
          Operational
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
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

  return (
    <main className="settings-page">
      <div className="settings-background">
        <div className="settings-bg-orb settings-orb-one" />
        <div className="settings-bg-orb settings-orb-two" />
        <div className="settings-bg-orb settings-orb-three" />
        <div className="settings-bg-grid" />
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

          <div className="settings-secure-badge">
            <span />
            <FaShieldAlt />
            Workspace secure
          </div>
        </header>

        <section className="settings-main-card">
          <aside className="settings-sidebar">
            <div className="settings-sidebar-title">
              SETTINGS
            </div>

            <nav className="settings-navigation">
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`settings-nav-item ${
                      active ? "active" : ""
                    }`}
                    onClick={() =>
                      setActiveSection(item.id)
                    }
                  >
                    <div className="settings-nav-icon">
                      <Icon />
                    </div>

                    <div className="settings-nav-text">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <FaChevronRight className="settings-nav-arrow" />
                  </button>
                );
              })}
            </nav>

            <div className="settings-sidebar-security">
              <div className="settings-sidebar-security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>
                <span>
                  Your TaskFlow account is secure.
                </span>
              </div>

              <FaCheckCircle />
            </div>
          </aside>

          <section className="settings-content">
            <div className="settings-content-header">
              <div className="settings-content-heading">
                <span>
                  {activeItem.title.toUpperCase()}
                </span>

                <h2>{activeItem.title === "Account"
                  ? "Account information"
                  : activeItem.title === "Appearance"
                  ? "Workspace appearance"
                  : activeItem.title === "Notifications"
                  ? "Notification preferences"
                  : activeItem.title === "Security"
                  ? "Password & security"
                  : "TaskFlow information"}
                </h2>

                <p>
                  {activeSection === "account" &&
                    "Manage your personal identity and TaskFlow workspace information."}

                  {activeSection === "appearance" &&
                    "Personalize the visual experience of your TaskFlow workspace."}

                  {activeSection === "notifications" &&
                    "Control how TaskFlow keeps you informed about important activity."}

                  {activeSection === "security" &&
                    "Protect your account and manage your authentication credentials."}

                  {activeSection === "application" &&
                    "Information about your TaskFlow application and current environment."}
                </p>
              </div>

              <div className="settings-content-icon">
                <ActiveIcon />
              </div>
            </div>

            <div className="settings-content-body">
              {renderSection()}
            </div>

            <footer className="settings-footer">
              <div className="settings-save-status">
                {saveMessage ? (
                  <>
                    <FaCheckCircle />
                    <span>{saveMessage}</span>
                  </>
                ) : (
                  <>
                    <span className="save-status-dot" />
                    <span>
                      {hasChanges
                        ? "You have unsaved changes"
                        : "All changes are currently saved"}
                    </span>
                  </>
                )}
              </div>

              <div className="settings-footer-actions">
                <button
                  type="button"
                  className="settings-reset-button"
                  onClick={resetSettings}
                >
                  <FaUndo />
                  Reset
                </button>

                <button
                  type="button"
                  className="settings-primary-button"
                  onClick={saveSettings}
                >
                  <FaSave />
                  Save changes
                </button>
              </div>
            </footer>
          </section>
        </section>

        <div className="settings-bottom-security">
          <div className="settings-bottom-security-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>
              Your preferences are stored securely
            </strong>

            <span>
              TaskFlow keeps your workspace settings
              organized and protected.
            </span>
          </div>

          <span className="settings-secure-label">
            <FaCheckCircle />
            Secure
          </span>
        </div>
      </div>
    </main>
  );
};

export default Settings;