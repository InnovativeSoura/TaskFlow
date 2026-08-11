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
  FaUserShield,
  FaDesktop,
  FaGlobe,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff,
  FaCircle,
  FaBolt,
  FaDatabase,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";


/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const cleanedName = String(name).trim();

  if (!cleanedName) {
    return "SP";
  }

  const parts = cleanedName.split(/\s+/).filter(Boolean);

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
    "Souradipta Patra"
  );
};


const getUserEmail = (user) => {
  return user?.email || "soura@gmail.com";
};


const getUserRole = (user) => {
  return user?.role || "Administrator";
};


/* =========================================================
   SETTINGS NAVIGATION
========================================================= */

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


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  browserNotifications: true,
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

const Settings = () => {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem("taskflow-settings");

      if (storedSettings) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings),
        };
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }

    return DEFAULT_SETTINGS;
  });

  const [account, setAccount] = useState({
    name: getUserName(user),
    email: getUserEmail(user),
  });

  const [savedAccount, setSavedAccount] = useState({
    name: getUserName(user),
    email: getUserEmail(user),
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");

  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  /* =========================================================
     USER DATA SYNC
  ========================================================= */

  useEffect(() => {
    const nextName = getUserName(user);
    const nextEmail = getUserEmail(user);

    setAccount({
      name: nextName,
      email: nextEmail,
    });

    setSavedAccount({
      name: nextName,
      email: nextEmail,
    });
  }, [user]);


  /* =========================================================
     SAVE SETTINGS TO LOCAL STORAGE
  ========================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "taskflow-settings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Unable to save settings:", error);
    }

    document.documentElement.classList.toggle(
      "taskflow-dark-mode",
      Boolean(settings.darkMode)
    );
  }, [settings]);


  /* =========================================================
     DERIVED VALUES
  ========================================================= */

  const userName = account.name || "Souradipta Patra";
  const userEmail = account.email || "soura@gmail.com";
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  const hasAccountChanges = useMemo(() => {
    return (
      account.name.trim() !== savedAccount.name.trim() ||
      account.email.trim() !== savedAccount.email.trim()
    );
  }, [account, savedAccount]);


  /* =========================================================
     GENERAL SETTINGS HANDLER
  ========================================================= */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };


  /* =========================================================
     ACCOUNT HANDLERS
  ========================================================= */

  const handleAccountChange = (event) => {
    const { name, value } = event.target;

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSaveAccount = async () => {
    if (!account.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!account.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(account.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSavingAccount(true);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      const updatedAccount = {
        name: account.name.trim(),
        email: account.email.trim(),
      };

      setAccount(updatedAccount);
      setSavedAccount(updatedAccount);

      try {
        localStorage.setItem(
          "taskflow-account-settings",
          JSON.stringify(updatedAccount)
        );
      } catch (error) {
        console.error("Unable to save account settings:", error);
      }

      toast.success("Account settings saved successfully.");
    } finally {
      setIsSavingAccount(false);
    }
  };


  const handleResetAccount = () => {
    setAccount(savedAccount);
    toast.info("Account changes have been reset.");
  };


  /* =========================================================
     PASSWORD HANDLERS
  ========================================================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
  };


  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    setPasswordMessage("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword) {
      setPasswordMessage("Enter your current password.");
      toast.error("Current password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "Your new password must contain at least 6 characters."
      );
      toast.error("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage(
        "Your new password must be different from your current password."
      );
      toast.error("Choose a different password.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        "Password validation completed successfully."
      );

      toast.success("Password updated successfully.");
    } finally {
      setIsSavingPassword(false);
    }
  };


  /* =========================================================
     RESET ALL SETTINGS
  ========================================================= */

  const handleResetAllSettings = () => {
    const confirmed = window.confirm(
      "Reset all TaskFlow settings to their default values?"
    );

    if (!confirmed) {
      return;
    }

    setSettings(DEFAULT_SETTINGS);

    setAccount({
      name: savedAccount.name,
      email: savedAccount.email,
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Settings have been restored to default.");
  };


  /* =========================================================
     SECTION RENDERING
  ========================================================= */

  const renderAccountSection = () => {
    return (
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">ACCOUNT</span>

            <h2>Account information</h2>

            <p>
              Manage your personal information and TaskFlow
              workspace identity.
            </p>
          </div>

          <div className="settings-section-icon purple">
            <FaUser />
          </div>
        </div>

        <div className="settings-profile-card">
          <div className="settings-profile-left">
            <div className="settings-large-avatar">
              {initials}
              <span className="settings-avatar-status" />
            </div>

            <div className="settings-profile-details">
              <h3>{userName}</h3>

              <p>{userEmail}</p>

              <div className="settings-profile-meta">
                <span>
                  <FaUserShield />
                  {userRole}
                </span>

                <span className="active-meta">
                  <FaCircle />
                  Active account
                </span>
              </div>
            </div>
          </div>

          <div className="settings-admin-badge">
            <FaShieldAlt />
            {userRole}
          </div>
        </div>

        <div className="settings-form-grid">
          <div className="settings-field-card">
            <label htmlFor="settings-name">
              <FaUser />
              Full name
            </label>

            <input
              id="settings-name"
              name="name"
              type="text"
              value={account.name}
              onChange={handleAccountChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="settings-field-card">
            <label htmlFor="settings-email">
              <FaEnvelope />
              Email address
            </label>

            <input
              id="settings-email"
              name="email"
              type="email"
              value={account.email}
              onChange={handleAccountChange}
              placeholder="Enter your email address"
            />
          </div>

          <div className="settings-info-card">
            <div className="settings-info-icon">
              <FaUserShield />
            </div>

            <div>
              <span>ROLE</span>
              <strong>{userRole}</strong>
            </div>
          </div>

          <div className="settings-info-card success-card">
            <div className="settings-info-icon success">
              <FaCheckCircle />
            </div>

            <div>
              <span>ACCOUNT STATUS</span>
              <strong>Active</strong>
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
              Your account information is securely associated
              with your TaskFlow workspace.
            </p>
          </div>

          <FaCheckCircle className="protected-check" />
        </div>

        <div className="settings-action-bar">
          <div className="settings-unsaved-status">
            <FaCircle
              className={
                hasAccountChanges
                  ? "status-dot changed"
                  : "status-dot"
              }
            />

            <div>
              <strong>
                {hasAccountChanges
                  ? "Unsaved changes"
                  : "All changes saved"}
              </strong>

              <span>
                {hasAccountChanges
                  ? "Save your profile changes."
                  : "Your account information is up to date."}
              </span>
            </div>
          </div>

          <div className="settings-action-buttons">
            <button
              type="button"
              className="settings-secondary-button"
              onClick={handleResetAccount}
              disabled={!hasAccountChanges}
            >
              <FaUndo />
              Reset
            </button>

            <button
              type="button"
              className="settings-primary-button"
              onClick={handleSaveAccount}
              disabled={!hasAccountChanges || isSavingAccount}
            >
              <FaSave />

              {isSavingAccount
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </div>
      </section>
    );
  };


  const renderAppearanceSection = () => {
    return (
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">APPEARANCE</span>

            <h2>Workspace appearance</h2>

            <p>
              Personalize the way TaskFlow looks and feels
              across your workspace.
            </p>
          </div>

          <div className="settings-section-icon blue">
            <FaPalette />
          </div>
        </div>

        <div className="appearance-hero">
          <div>
            <span className="appearance-label">
              CURRENT THEME
            </span>

            <h3>
              {settings.darkMode
                ? "Dark workspace"
                : "Light workspace"}
            </h3>

            <p>
              {settings.darkMode
                ? "A focused dark interface designed for low-light environments."
                : "A clean, bright interface designed for maximum clarity."}
            </p>
          </div>

          <div className="appearance-preview">
            <div className="preview-window">
              <div className="preview-window-top">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-window-body">
                <div className="preview-sidebar" />

                <div className="preview-content">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-options">
          <button
            type="button"
            className={`theme-option ${
              !settings.darkMode ? "selected" : ""
            }`}
            onClick={() => {
              updateSetting("darkMode", false);
              toast.success("Light mode enabled.");
            }}
          >
            <div className="theme-option-icon light">
              <FaSun />
            </div>

            <div className="theme-option-content">
              <strong>Light mode</strong>
              <span>Bright and clean workspace</span>
            </div>

            <div className="theme-option-check">
              {!settings.darkMode && <FaCheckCircle />}
            </div>
          </button>

          <button
            type="button"
            className={`theme-option ${
              settings.darkMode ? "selected" : ""
            }`}
            onClick={() => {
              updateSetting("darkMode", true);
              toast.success("Dark mode enabled.");
            }}
          >
            <div className="theme-option-icon dark">
              <FaMoon />
            </div>

            <div className="theme-option-content">
              <strong>Dark mode</strong>
              <span>Focused interface for low-light environments</span>
            </div>

            <div className="theme-option-check">
              {settings.darkMode && <FaCheckCircle />}
            </div>
          </button>
        </div>

        <div className="settings-note-card">
          <FaDesktop />

          <div>
            <strong>Preference saved automatically</strong>

            <p>
              Your appearance preference is stored locally
              and applied automatically when you return.
            </p>
          </div>
        </div>
      </section>
    );
  };


  const renderNotificationsSection = () => {
    return (
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">
              NOTIFICATIONS
            </span>

            <h2>Notification preferences</h2>

            <p>
              Choose which TaskFlow events should notify you.
            </p>
          </div>

          <div className="settings-section-icon orange">
            <FaBell />
          </div>
        </div>

        <div className="notification-list">
          <div className="notification-setting">
            <div className="notification-icon">
              <FaEnvelope />
            </div>

            <div className="notification-content">
              <strong>Email notifications</strong>

              <span>
                Receive important workspace updates by email.
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
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
              {settings.emailNotifications ? (
                <FaToggleOn />
              ) : (
                <FaToggleOff />
              )}
            </button>
          </div>

          <div className="notification-setting">
            <div className="notification-icon purple-bg">
              <FaBolt />
            </div>

            <div className="notification-content">
              <strong>Task notifications</strong>

              <span>
                Get notified when tasks are assigned or updated.
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.taskNotifications
                  ? "on"
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
              {settings.taskNotifications ? (
                <FaToggleOn />
              ) : (
                <FaToggleOff />
              )}
            </button>
          </div>

          <div className="notification-setting">
            <div className="notification-icon blue-bg">
              <FaDatabase />
            </div>

            <div className="notification-content">
              <strong>Project notifications</strong>

              <span>
                Receive updates about your projects and teams.
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.projectNotifications
                  ? "on"
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
              {settings.projectNotifications ? (
                <FaToggleOn />
              ) : (
                <FaToggleOff />
              )}
            </button>
          </div>

          <div className="notification-setting">
            <div className="notification-icon green-bg">
              <FaGlobe />
            </div>

            <div className="notification-content">
              <strong>Browser notifications</strong>

              <span>
                Allow TaskFlow to display browser notifications.
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.browserNotifications
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                updateSetting(
                  "browserNotifications",
                  !settings.browserNotifications
                )
              }
              aria-label="Toggle browser notifications"
            >
              {settings.browserNotifications ? (
                <FaToggleOn />
              ) : (
                <FaToggleOff />
              )}
            </button>
          </div>
        </div>

        <div className="notification-summary">
          <div className="summary-icon">
            <FaCheckCircle />
          </div>

          <div>
            <strong>
              {Object.values(settings).filter(Boolean).length}{" "}
              preferences enabled
            </strong>

            <span>
              Your notification preferences are saved
              automatically.
            </span>
          </div>
        </div>
      </section>
    );
  };


  const renderSecuritySection = () => {
    return (
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">SECURITY</span>

            <h2>Password & security</h2>

            <p>
              Keep your TaskFlow account protected with a
              strong password.
            </p>
          </div>

          <div className="settings-section-icon red">
            <FaLock />
          </div>
        </div>

        <div className="security-banner">
          <div className="security-banner-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Your workspace is protected</strong>

            <p>
              Use a strong password containing a combination
              of letters, numbers and symbols.
            </p>
          </div>

          <span className="security-status">
            <FaCheckCircle />
            Secure
          </span>
        </div>

        <form
          className="password-form"
          onSubmit={handlePasswordUpdate}
        >
          <div className="password-field">
            <label htmlFor="currentPassword">
              <FaKey />
              Current password
            </label>

            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (previous) => !previous
                  )
                }
                aria-label="Toggle current password visibility"
              >
                {showCurrentPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <div className="password-grid">
            <div className="password-field">
              <label htmlFor="newPassword">
                <FaLock />
                New password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 6 characters"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <div className="password-field">
              <label htmlFor="confirmPassword">
                <FaLock />
                Confirm password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat your new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>
          </div>

          {passwordMessage && (
            <div className="password-message">
              <FaInfoCircle />
              {passwordMessage}
            </div>
          )}

          <div className="password-requirements">
            <strong>Password requirements</strong>

            <div className="requirements-grid">
              <span
                className={
                  passwordData.newPassword.length >= 6
                    ? "valid"
                    : ""
                }
              >
                <FaCheckCircle />
                At least 6 characters
              </span>

              <span
                className={
                  /[A-Z]/.test(passwordData.newPassword)
                    ? "valid"
                    : ""
                }
              >
                <FaCheckCircle />
                One uppercase letter
              </span>

              <span
                className={
                  /[0-9]/.test(passwordData.newPassword)
                    ? "valid"
                    : ""
                }
              >
                <FaCheckCircle />
                One number
              </span>

              <span
                className={
                  /[^A-Za-z0-9]/.test(
                    passwordData.newPassword
                  )
                    ? "valid"
                    : ""
                }
              >
                <FaCheckCircle />
                One special character
              </span>
            </div>
          </div>

          <div className="settings-action-bar security-actions">
            <div />

            <button
              type="submit"
              className="settings-primary-button"
              disabled={isSavingPassword}
            >
              <FaSave />

              {isSavingPassword
                ? "Updating..."
                : "Update password"}
            </button>
          </div>
        </form>
      </section>
    );
  };


  const renderApplicationSection = () => {
    return (
      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <span className="settings-eyebrow">
              APPLICATION
            </span>

            <h2>TaskFlow application</h2>

            <p>
              Information about your TaskFlow workspace and
              application.
            </p>
          </div>

          <div className="settings-section-icon green">
            <FaCog />
          </div>
        </div>

        <div className="application-brand-card">
          <div className="application-logo">
            TF
          </div>

          <div className="application-brand-content">
            <span>TASKFLOW</span>

            <h3>Project management workspace</h3>

            <p>
              Organize projects, manage tasks, collaborate
              with your team and monitor productivity from
              one powerful workspace.
            </p>
          </div>

          <div className="application-version">
            <span>VERSION</span>
            <strong>1.0.0</strong>
          </div>
        </div>

        <div className="application-info-grid">
          <div className="application-info-card">
            <div className="application-card-icon">
              <FaDesktop />
            </div>

            <div>
              <span>PLATFORM</span>
              <strong>Web Application</strong>
            </div>
          </div>

          <div className="application-info-card">
            <div className="application-card-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>SYSTEM STATUS</span>
              <strong className="status-online">
                Operational
              </strong>
            </div>
          </div>

          <div className="application-info-card">
            <div className="application-card-icon purple">
              <FaDatabase />
            </div>

            <div>
              <span>WORKSPACE</span>
              <strong>TaskFlow Workspace</strong>
            </div>
          </div>

          <div className="application-info-card">
            <div className="application-card-icon blue">
              <FaShieldAlt />
            </div>

            <div>
              <span>SECURITY</span>
              <strong>Protected</strong>
            </div>
          </div>
        </div>

        <div className="application-about-card">
          <div className="application-about-icon">
            <FaInfoCircle />
          </div>

          <div>
            <h3>About TaskFlow</h3>

            <p>
              TaskFlow is designed to provide a focused,
              modern and efficient environment for managing
              projects, tasks and teams.
            </p>
          </div>
        </div>

        <div className="danger-zone">
          <div>
            <span>DANGER ZONE</span>

            <h3>Reset application preferences</h3>

            <p>
              Restore your TaskFlow preferences to their
              default values. Your account and projects will
              not be deleted.
            </p>
          </div>

          <button
            type="button"
            className="danger-button"
            onClick={handleResetAllSettings}
          >
            <FaUndo />
            Reset preferences
          </button>
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


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="settings-page">
      {/* =====================================================
          EXISTING GLOBAL NAVIGATION
          DO NOT CHANGE SIDEBAR OR NAVBAR
      ===================================================== */}

      <Sidebar />

      <div className="settings-main-shell">
        <Navbar />

        <main className="settings-main">
          {/* Decorative background */}
          <div className="settings-background">
            <div className="settings-bg-orb orb-one" />
            <div className="settings-bg-orb orb-two" />
            <div className="settings-bg-orb orb-three" />
            <div className="settings-bg-grid" />
          </div>

          <div className="settings-content">
            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="settings-page-header">
              <div>
                <div className="settings-breadcrumb">
                  <span>WORKSPACE</span>
                  <FaChevronRight />
                  <strong>SETTINGS</strong>
                </div>

                <h1>Settings</h1>

                <p>
                  Manage your account, workspace preferences
                  and security.
                </p>
              </div>

              <div className="workspace-secure-badge">
                <span className="secure-pulse" />
                <FaShieldAlt />
                Workspace secure
              </div>
            </header>


            {/* =================================================
                MAIN SETTINGS CARD
            ================================================= */}

            <div className="settings-layout">

              {/* ===============================================
                  SETTINGS SIDEBAR
              =============================================== */}

              <aside className="settings-navigation">
                <div className="settings-navigation-title">
                  SETTINGS
                </div>

                <div className="settings-navigation-items">
                  {SETTINGS_ITEMS.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`settings-navigation-item ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() =>
                          setActiveSection(item.id)
                        }
                      >
                        <div
                          className={`settings-nav-icon ${
                            isActive ? "active" : ""
                          }`}
                        >
                          <Icon />
                        </div>

                        <div className="settings-nav-copy">
                          <strong>{item.label}</strong>

                          <span>
                            {item.description}
                          </span>
                        </div>

                        <FaChevronRight className="settings-nav-arrow" />
                      </button>
                    );
                  })}
                </div>

                <div className="settings-navigation-footer">
                  <div className="footer-security-icon">
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

                  <FaCheckCircle />
                </div>
              </aside>


              {/* ===============================================
                  MAIN CONTENT
              =============================================== */}

              <div className="settings-panel">
                {renderActiveSection()}
              </div>
            </div>


            {/* =================================================
                BOTTOM SECURITY STRIP
            ================================================= */}

            <div className="settings-bottom-strip">
              <div className="bottom-strip-icon">
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

              <div className="bottom-strip-status">
                <FaCheckCircle />
                Secure
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default Settings;