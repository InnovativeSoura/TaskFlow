import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

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
  FaKey,
  FaEnvelope,
  FaUserShield,
  FaDesktop,
  FaGlobe,
  FaRedo,
  FaSave,
  FaCheck,
  FaTimes,
  FaCircle,
  FaRocket,
  FaDatabase,
  FaCloud,
  FaBolt,
} from "react-icons/fa";

import "../styles/Settings.css";

/* =========================================================
   SETTINGS DATA
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

const DEFAULT_SETTINGS = {
  darkMode: false,
  compactMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  securityNotifications: true,
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
    x: 15,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -15,
    transition: {
      duration: 0.2,
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

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
    user?.displayName ||
    "Souradipta Patra"
  );
};

const getUserEmail = (user) => {
  return user?.email || user?.emailAddress || "soura@gmail.com";
};

const getUserRole = (user) => {
  return user?.role || "Administrator";
};

/* =========================================================
   TOGGLE COMPONENT
========================================================= */

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "is-active" : ""}`}
      onClick={() => onChange(!checked)}
      aria-label={`Toggle ${label}`}
      aria-pressed={checked}
    >
      <span className="settings-toggle-track">
        <span className="settings-toggle-thumb" />
      </span>
    </button>
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function Settings() {
  const { user } = useAuth();

  const userName = useMemo(() => getUserName(user), [user]);
  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const userRole = useMemo(() => getUserRole(user), [user]);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow-settings");

      if (saved) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
        };
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }

    return DEFAULT_SETTINGS;
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [savedState, setSavedState] = useState(false);

  /* =====================================================
     APPLY THEME
  ===================================================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      settings.darkMode ? "dark" : "light"
    );

    localStorage.setItem(
      "taskflow-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  /* =====================================================
     UPDATE SETTING
  ===================================================== */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSavedState(false);
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSaveSettings = () => {
    localStorage.setItem(
      "taskflow-settings",
      JSON.stringify(settings)
    );

    setSavedState(true);

    toast.success("Settings saved successfully.", {
      position: "top-right",
      autoClose: 2200,
    });

    setTimeout(() => {
      setSavedState(false);
    }, 2500);
  };

  /* =====================================================
     RESET SETTINGS
  ===================================================== */

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Reset all TaskFlow preferences to their default values?"
    );

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      "taskflow-settings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    toast.info("Settings restored to default.", {
      position: "top-right",
      autoClose: 2200,
    });
  };

  /* =====================================================
     PASSWORD HANDLER
  ===================================================== */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
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
    } = passwordData;

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
      UI validation only.

      Connect this section to your backend password endpoint
      when that API is available.
    */

    setPasswordMessage({
      type: "success",
      text: "Password validation successful. Connect your password API to complete the update.",
    });

    toast.success("Password details validated.", {
      position: "top-right",
      autoClose: 2500,
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  /* =====================================================
     PASSWORD STRENGTH
  ===================================================== */

  const passwordStrength = useMemo(() => {
    const password = passwordData.newPassword;

    if (!password) {
      return {
        label: "Not set",
        percentage: 0,
        className: "",
      };
    }

    let score = 0;

    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score < 40) {
      return {
        label: "Weak",
        percentage: score,
        className: "weak",
      };
    }

    if (score < 70) {
      return {
        label: "Medium",
        percentage: score,
        className: "medium",
      };
    }

    return {
      label: "Strong",
      percentage: score,
      className: "strong",
    };
  }, [passwordData.newPassword]);

  /* =====================================================
     RENDER ACCOUNT
  ===================================================== */

  const renderAccount = () => (
    <motion.div
      key="account"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-content-section"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            Manage your personal information and TaskFlow workspace identity.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-large">
            {initials}
            <span className="profile-online-dot" />
          </div>

          <div className="profile-hero-info">
            <h3>{userName}</h3>

            <p>{userEmail}</p>

            <div className="profile-meta">
              <span>
                <FaUserShield />
                {userRole}
              </span>

              <span>
                <FaCheckCircle />
                Active account
              </span>
            </div>
          </div>
        </div>

        <div className="admin-badge">
          <FaShieldAlt />
          {userRole}
        </div>
      </div>

      <div className="account-grid">
        <div className="account-info-card">
          <div className="account-info-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{userName}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon slate">
            <FaUserShield />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>

            <strong className="status-active">
              <FaCircle />
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="protected-card">
        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <p>
            Your account information is securely associated with your
            TaskFlow workspace.
          </p>
        </div>

        <FaCheckCircle className="protected-check" />
      </div>
    </motion.div>
  );

  /* =====================================================
     RENDER APPEARANCE
  ===================================================== */

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-content-section"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize the visual experience of your TaskFlow workspace.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="appearance-feature-card">
        <div className="appearance-preview">
          <div className="preview-window">
            <div className="preview-top">
              <span />
              <span />
              <span />
            </div>

            <div className="preview-body">
              <div className="preview-sidebar">
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="preview-main">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>

        <div className="appearance-feature-content">
          <span className="feature-label">THEME</span>

          <h3>Choose your workspace style</h3>

          <p>
            Switch between a clean light workspace and a focused dark
            environment.
          </p>

          <div className="theme-selector">
            <button
              type="button"
              className={!settings.darkMode ? "selected" : ""}
              onClick={() => updateSetting("darkMode", false)}
            >
              <FaSun />
              <span>
                <strong>Light</strong>
                <small>Bright workspace</small>
              </span>

              {!settings.darkMode && <FaCheck />}
            </button>

            <button
              type="button"
              className={settings.darkMode ? "selected" : ""}
              onClick={() => updateSetting("darkMode", true)}
            >
              <FaMoon />
              <span>
                <strong>Dark</strong>
                <small>Focused workspace</small>
              </span>

              {settings.darkMode && <FaCheck />}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-options-grid">
        <div className="settings-option-card">
          <div className="option-icon">
            <FaDesktop />
          </div>

          <div className="option-copy">
            <strong>Compact workspace</strong>
            <span>
              Reduce spacing across workspace components.
            </span>
          </div>

          <Toggle
            checked={settings.compactMode}
            onChange={(value) =>
              updateSetting("compactMode", value)
            }
            label="compact workspace"
          />
        </div>

        <div className="settings-option-card">
          <div className="option-icon">
            <FaPalette />
          </div>

          <div className="option-copy">
            <strong>Premium visual effects</strong>
            <span>
              Keep gradients, shadows and subtle animations enabled.
            </span>
          </div>

          <div className="enabled-badge">
            <FaCheck />
            Enabled
          </div>
        </div>
      </div>
    </motion.div>
  );

  /* =====================================================
     RENDER NOTIFICATIONS
  ===================================================== */

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-content-section"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">NOTIFICATIONS</span>

          <h2>Notification preferences</h2>

          <p>
            Decide which TaskFlow updates you want to receive.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-icon purple">
            <FaEnvelope />
          </div>

          <div className="notification-copy">
            <strong>Email notifications</strong>

            <span>
              Receive important TaskFlow updates through email.
            </span>
          </div>

          <Toggle
            checked={settings.emailNotifications}
            onChange={(value) =>
              updateSetting("emailNotifications", value)
            }
            label="email notifications"
          />
        </div>

        <div className="notification-item">
          <div className="notification-icon blue">
            <FaBolt />
          </div>

          <div className="notification-copy">
            <strong>Task notifications</strong>

            <span>
              Get notified when tasks are created, assigned or updated.
            </span>
          </div>

          <Toggle
            checked={settings.taskNotifications}
            onChange={(value) =>
              updateSetting("taskNotifications", value)
            }
            label="task notifications"
          />
        </div>

        <div className="notification-item">
          <div className="notification-icon green">
            <FaRocket />
          </div>

          <div className="notification-copy">
            <strong>Project notifications</strong>

            <span>
              Stay informed about project activity and progress.
            </span>
          </div>

          <Toggle
            checked={settings.projectNotifications}
            onChange={(value) =>
              updateSetting("projectNotifications", value)
            }
            label="project notifications"
          />
        </div>

        <div className="notification-item">
          <div className="notification-icon orange">
            <FaShieldAlt />
          </div>

          <div className="notification-copy">
            <strong>Security notifications</strong>

            <span>
              Receive alerts about important security activity.
            </span>
          </div>

          <Toggle
            checked={settings.securityNotifications}
            onChange={(value) =>
              updateSetting("securityNotifications", value)
            }
            label="security notifications"
          />
        </div>
      </div>

      <div className="notification-summary">
        <div className="summary-icon">
          <FaBell />
        </div>

        <div>
          <strong>
            {
              Object.values(settings).filter(
                (value) => value === true
              ).length
            }{" "}
            preferences enabled
          </strong>

          <span>
            Your notification preferences are saved automatically.
          </span>
        </div>
      </div>
    </motion.div>
  );

  /* =====================================================
     RENDER SECURITY
  ===================================================== */

  const renderSecurity = () => (
    <motion.div
      key="security"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-content-section"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected with secure credentials.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="security-banner">
        <div className="security-banner-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your account is protected</strong>

          <span>
            Use a strong password containing uppercase letters,
            numbers and special characters.
          </span>
        </div>

        <div className="security-score">
          <FaCheckCircle />
          Secure
        </div>
      </div>

      <form
        className="password-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="password-form-header">
          <div className="password-form-icon">
            <FaKey />
          </div>

          <div>
            <h3>Change password</h3>

            <p>
              Update the password associated with your TaskFlow account.
            </p>
          </div>
        </div>

        <div className="password-grid">
          <div className="input-field full">
            <label htmlFor="currentPassword">
              Current password
            </label>

            <div className="password-input-wrapper">
              <FaLock />

              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showCurrentPassword ? "text" : "password"
                }
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                autoComplete="current-password"
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

          <div className="input-field">
            <label htmlFor="newPassword">
              New password
            </label>

            <div className="password-input-wrapper">
              <FaKey />

              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Create new password"
                autoComplete="new-password"
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

            {passwordData.newPassword && (
              <div className="password-strength">
                <div className="strength-header">
                  <span>Password strength</span>

                  <strong
                    className={passwordStrength.className}
                  >
                    {passwordStrength.label}
                  </strong>
                </div>

                <div className="strength-track">
                  <span
                    className={passwordStrength.className}
                    style={{
                      width: `${passwordStrength.percentage}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="password-input-wrapper">
              <FaKey />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
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

        <div className="password-form-footer">
          <span>
            <FaShieldAlt />
            Your password is never displayed or stored here.
          </span>

          <button
            type="submit"
            className="primary-action-button"
          >
            <FaLock />
            Update password
          </button>
        </div>
      </form>
    </motion.div>
  );

  /* =====================================================
     RENDER APPLICATION
  ===================================================== */

  const renderApplication = () => (
    <motion.div
      key="application"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-content-section"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow application</h2>

          <p>
            Information about your TaskFlow workspace and platform.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaCog />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="application-hero">
        <div className="application-logo">
          TF
        </div>

        <div>
          <span>PROJECT MANAGEMENT PLATFORM</span>

          <h3>TaskFlow</h3>

          <p>
            Organize projects, manage tasks and collaborate with
            your team from one premium workspace.
          </p>
        </div>

        <div className="application-status">
          <FaCheckCircle />
          Operational
        </div>
      </div>

      <div className="application-grid">
        <div className="application-info-card">
          <FaRocket />

          <div>
            <span>VERSION</span>
            <strong>1.0.0</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaGlobe />

          <div>
            <span>PLATFORM</span>
            <strong>Web Application</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaDatabase />

          <div>
            <span>DATA SYSTEM</span>
            <strong>Cloud Database</strong>
          </div>
        </div>

        <div className="application-info-card">
          <FaCloud />

          <div>
            <span>WORKSPACE</span>
            <strong>Protected</strong>
          </div>
        </div>
      </div>

      <div className="application-footer-card">
        <div className="application-footer-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Built for productive teams</strong>

          <p>
            TaskFlow keeps your projects, tasks and workspace
            preferences organized in one secure environment.
          </p>
        </div>

        <span className="secure-pill">
          <FaCheckCircle />
          Secure
        </span>
      </div>
    </motion.div>
  );

  /* =====================================================
     ACTIVE CONTENT
  ===================================================== */

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

  /* =====================================================
     MAIN RENDER
  ===================================================== */

  return (
    <>
      {/* KEEP EXISTING GLOBAL NAVIGATION */}
      <Sidebar />
      <Navbar />

      <motion.main
        className={`settings-page ${
          settings.compactMode ? "compact-mode" : ""
        }`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* BACKGROUND */}
        <div className="settings-background">
          <div className="settings-bg-grid" />

          <div className="settings-bg-orb orb-one" />
          <div className="settings-bg-orb orb-two" />
          <div className="settings-bg-orb orb-three" />

          <div className="settings-bg-ring ring-one" />
          <div className="settings-bg-ring ring-two" />

          <div className="settings-bg-glow glow-one" />
          <div className="settings-bg-glow glow-two" />
        </div>

        <div className="settings-page-inner">
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
                Manage your account, workspace preferences and
                security.
              </p>
            </div>

            <div className="workspace-secure-badge">
              <span className="secure-pulse" />
              <FaShieldAlt />
              Workspace secure
            </div>
          </header>

          {/* =================================================
              SETTINGS CARD
          ================================================= */}

          <section className="settings-shell">
            {/* LEFT SETTINGS NAVIGATION */}

            <aside className="settings-navigation">
              <div className="settings-nav-title">
                SETTINGS
              </div>

              <div className="settings-nav-list">
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

                      <span className="settings-nav-copy">
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>

                      <FaChevronRight className="settings-nav-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="settings-nav-security">
                <div className="security-mini-icon">
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

            {/* RIGHT CONTENT */}

            <div className="settings-main-content">
              <AnimatePresence mode="wait">
                {renderActiveContent()}
              </AnimatePresence>

              {/* ACTION BAR */}

              <div className="settings-action-bar">
                <button
                  type="button"
                  className="secondary-action-button"
                  onClick={handleResetSettings}
                >
                  <FaRedo />
                  Reset
                </button>

                <button
                  type="button"
                  className={`primary-action-button ${
                    savedState ? "saved" : ""
                  }`}
                  onClick={handleSaveSettings}
                >
                  {savedState ? (
                    <>
                      <FaCheck />
                      Saved
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

          {/* =================================================
              BOTTOM SECURITY BAR
          ================================================= */}

          <div className="settings-bottom-bar">
            <div className="bottom-bar-icon">
              <FaShieldAlt />
            </div>

            <div className="bottom-bar-content">
              <strong>
                Your preferences are stored securely
              </strong>

              <span>
                TaskFlow keeps your workspace settings organized
                and protected.
              </span>
            </div>

            <div className="bottom-secure-badge">
              <FaCheckCircle />
              Secure
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
}