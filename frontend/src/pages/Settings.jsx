// src/pages/Settings.jsx

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
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCog,
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

/* ============================================================
   SETTINGS PAGE
============================================================ */

function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] =
    useState("account");

  const [appearance, setAppearance] =
    useState("light");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [taskNotifications, setTaskNotifications] =
    useState(true);

  const [projectNotifications, setProjectNotifications] =
    useState(true);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  /* ==========================================================
     USER DATA
  ========================================================== */

  const userName = user?.name || "TaskFlow User";

  const userEmail =
    user?.email || "No email available";

  const userRole =
    user?.role || "Team Member";

  const userInitials = useMemo(
    () => getInitials(userName),
    [userName]
  );

  /* ==========================================================
     PASSWORD FORM
  ========================================================== */

  const updatePasswordField = (
    field,
    value
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError(
        "Please complete all password fields."
      );

      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError(
        "New password and confirmation do not match."
      );

      return;
    }

    /*
      UI validation is intentionally handled here.

      Connect this handler to your existing backend
      password-change endpoint once that route is confirmed.
    */

    setPasswordMessage(
      "Password details validated successfully."
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  /* ==========================================================
     RENDER SECTION
  ========================================================== */

  const renderSection = () => {
    switch (activeSection) {
      /* ======================================================
         ACCOUNT
      ====================================================== */

      case "account":
        return (
          <section className="settings-section">
            <div className="settings-section-header">
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

              <div className="settings-section-icon purple">
                <FaUser />
              </div>
            </div>

            <div className="account-profile-card">
              <div className="account-avatar">
                {userInitials}
              </div>

              <div className="account-profile-content">
                <div>
                  <h3>{userName}</h3>

                  <p>{userEmail}</p>
                </div>

                <span className="account-role">
                  {userRole}
                </span>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <span className="field-label">
                  Full Name
                </span>

                <div className="field-value">
                  {userName}
                </div>
              </div>

              <div className="settings-field">
                <span className="field-label">
                  Email Address
                </span>

                <div className="field-value">
                  {userEmail}
                </div>
              </div>

              <div className="settings-field">
                <span className="field-label">
                  Role
                </span>

                <div className="field-value">
                  {userRole}
                </div>
              </div>

              <div className="settings-field">
                <span className="field-label">
                  Account Status
                </span>

                <div className="field-value status-value">
                  <span className="status-dot" />
                  Active
                </div>
              </div>
            </div>
          </section>
        );

      /* ======================================================
         APPEARANCE
      ====================================================== */

      case "appearance":
        return (
          <section className="settings-section">
            <div className="settings-section-header">
              <div>
                <span className="settings-eyebrow">
                  APPEARANCE
                </span>

                <h2>Customize your workspace</h2>

                <p>
                  Choose how TaskFlow looks while you
                  work.
                </p>
              </div>

              <div className="settings-section-icon blue">
                <FaPalette />
              </div>
            </div>

            <div className="appearance-options">
              <button
                type="button"
                className={`appearance-option ${
                  appearance === "light"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setAppearance("light")
                }
              >
                <div className="appearance-preview light-preview">
                  <div className="preview-sidebar" />

                  <div className="preview-content">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="appearance-option-info">
                  <div>
                    <strong>Light</strong>

                    <span>
                      Clean and bright workspace
                    </span>
                  </div>

                  {appearance === "light" && (
                    <FaCheckCircle />
                  )}
                </div>
              </button>

              <button
                type="button"
                className={`appearance-option ${
                  appearance === "dark"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setAppearance("dark")
                }
              >
                <div className="appearance-preview dark-preview">
                  <div className="preview-sidebar" />

                  <div className="preview-content">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="appearance-option-info">
                  <div>
                    <strong>Dark</strong>

                    <span>
                      Comfortable for low light
                    </span>
                  </div>

                  {appearance === "dark" && (
                    <FaCheckCircle />
                  )}
                </div>
              </button>
            </div>

            <div className="settings-info-box">
              <FaMoon />

              <div>
                <strong>
                  Theme preference
                </strong>

                <p>
                  Your current preference is{" "}
                  <b>
                    {appearance === "light"
                      ? "Light"
                      : "Dark"}
                  </b>
                  .
                </p>
              </div>
            </div>
          </section>
        );

      /* ======================================================
         NOTIFICATIONS
      ====================================================== */

      case "notifications":
        return (
          <section className="settings-section">
            <div className="settings-section-header">
              <div>
                <span className="settings-eyebrow">
                  NOTIFICATIONS
                </span>

                <h2>Notification preferences</h2>

                <p>
                  Decide which updates you want to
                  receive.
                </p>
              </div>

              <div className="settings-section-icon orange">
                <FaBell />
              </div>
            </div>

            <div className="notification-list">
              <div className="notification-item">
                <div className="notification-item-icon">
                  <FaBell />
                </div>

                <div className="notification-item-content">
                  <strong>
                    Email notifications
                  </strong>

                  <span>
                    Receive important workspace updates
                    by email.
                  </span>
                </div>

                <button
                  type="button"
                  className={`settings-switch ${
                    emailNotifications
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setEmailNotifications(
                      (value) => !value
                    )
                  }
                  aria-label="Toggle email notifications"
                >
                  <span />
                </button>
              </div>

              <div className="notification-item">
                <div className="notification-item-icon blue">
                  <FaCheckCircle />
                </div>

                <div className="notification-item-content">
                  <strong>
                    Task updates
                  </strong>

                  <span>
                    Get notified when tasks are
                    created, updated or completed.
                  </span>
                </div>

                <button
                  type="button"
                  className={`settings-switch ${
                    taskNotifications
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTaskNotifications(
                      (value) => !value
                    )
                  }
                  aria-label="Toggle task notifications"
                >
                  <span />
                </button>
              </div>

              <div className="notification-item">
                <div className="notification-item-icon purple">
                  <FaShieldAlt />
                </div>

                <div className="notification-item-content">
                  <strong>
                    Project activity
                  </strong>

                  <span>
                    Stay informed about changes to
                    your projects.
                  </span>
                </div>

                <button
                  type="button"
                  className={`settings-switch ${
                    projectNotifications
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setProjectNotifications(
                      (value) => !value
                    )
                  }
                  aria-label="Toggle project notifications"
                >
                  <span />
                </button>
              </div>
            </div>
          </section>
        );

      /* ======================================================
         SECURITY
      ====================================================== */

      case "security":
        return (
          <section className="settings-section">
            <div className="settings-section-header">
              <div>
                <span className="settings-eyebrow">
                  SECURITY
                </span>

                <h2>Change password</h2>

                <p>
                  Keep your TaskFlow account secure with
                  a strong password.
                </p>
              </div>

              <div className="settings-section-icon red">
                <FaLock />
              </div>
            </div>

            <form
              className="password-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="password-field">
                <label htmlFor="current-password">
                  Current Password
                </label>

                <div className="password-input">
                  <input
                    id="current-password"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter current password"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={(event) =>
                      updatePasswordField(
                        "currentPassword",
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (value) => !value
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

              <div className="password-form-row">
                <div className="password-field">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <div className="password-input">
                    <input
                      id="new-password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={
                        passwordForm.newPassword
                      }
                      onChange={(event) =>
                        updatePasswordField(
                          "newPassword",
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (value) => !value
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
                  <label htmlFor="confirm-password">
                    Confirm Password
                  </label>

                  <div className="password-input">
                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={
                        passwordForm.confirmPassword
                      }
                      onChange={(event) =>
                        updatePasswordField(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
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

              <div className="password-requirement">
                <FaShieldAlt />

                <span>
                  Use at least 6 characters for your new
                  password.
                </span>
              </div>

              {passwordError && (
                <div className="settings-message error">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="settings-message success">
                  <FaCheckCircle />

                  {passwordMessage}
                </div>
              )}

              <div className="password-actions">
                <button
                  type="submit"
                  className="settings-primary-btn"
                >
                  <FaLock />
                  Update Password
                </button>
              </div>
            </form>
          </section>
        );

      /* ======================================================
         APPLICATION
      ====================================================== */

      case "application":
        return (
          <section className="settings-section">
            <div className="settings-section-header">
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

              <div className="settings-section-icon green">
                <FaCog />
              </div>
            </div>

            <div className="application-card">
              <div className="application-logo">
                TF
              </div>

              <div className="application-main">
                <h3>TaskFlow</h3>

                <p>
                  A modern project and task management
                  platform designed to keep teams
                  organized and productive.
                </p>

                <div className="application-meta">
                  <span>
                    Version <strong>1.0.0</strong>
                  </span>

                  <span className="application-status">
                    <span />
                    Production
                  </span>
                </div>
              </div>
            </div>

            <div className="application-links">
              <div className="application-link-row">
                <div>
                  <strong>
                    Workspace
                  </strong>

                  <span>
                    TaskFlow project management
                  </span>
                </div>

                <FaChevronRight />
              </div>

              <div className="application-link-row">
                <div>
                  <strong>
                    Security
                  </strong>

                  <span>
                    Authentication and protected
                    workspace access
                  </span>
                </div>

                <FaChevronRight />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  /* ==========================================================
     MAIN RENDER
  ========================================================== */

  return (
    <div className="settings-page">
      {/* PREMIUM BACKGROUND */}

      <div
        className="settings-background"
        aria-hidden="true"
      >
        <div className="settings-grid" />

        <div className="settings-orb settings-orb-one" />

        <div className="settings-orb settings-orb-two" />

        <div className="settings-glow settings-glow-one" />

        <div className="settings-glow settings-glow-two" />
      </div>

      {/* SIDEBAR */}

      <Sidebar />

      {/* APPLICATION AREA */}

      <div className="settings-main">
        <Navbar />

        <main className="settings-container">
          {/* PAGE HEADER */}

          <header className="settings-page-header">
            <div>
              <div className="settings-breadcrumb">
                Workspace
                <span>/</span>
                Settings
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account and workspace
                preferences.
              </p>
            </div>
          </header>

          {/* SETTINGS WORKSPACE */}

          <section className="settings-workspace">
            {/* LEFT NAVIGATION */}

            <aside className="settings-navigation">
              <div className="settings-navigation-title">
                Settings
              </div>

              <nav>
                {SETTINGS_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
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
                      {item.icon}
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
                ))}
              </nav>

              <div className="settings-navigation-footer">
                <FaShieldAlt />

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

            {/* CONTENT */}

            <div className="settings-content">
              {renderSection()}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;