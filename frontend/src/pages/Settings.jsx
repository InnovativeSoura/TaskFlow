import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaDesktop,
  FaGlobe,
  FaDatabase,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaCircle,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

const STORAGE_KEY = "taskflow-settings";

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

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "TF";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(stored),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const getUserName = (user) =>
  user?.name ||
  user?.username ||
  user?.fullName ||
  "Souradipta Patra";

const getUserEmail = (user) =>
  user?.email ||
  user?.userEmail ||
  "soura@gmail.com";

const getUserRole = (user) =>
  user?.role ||
  "Administrator";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(getStoredSettings);

  const [profile, setProfile] = useState({
    name: getUserName(user),
    email: getUserEmail(user),
  });

  const [originalProfile, setOriginalProfile] = useState({
    name: getUserName(user),
    email: getUserEmail(user),
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [saveMessage, setSaveMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);

  const initials = useMemo(
    () => getInitials(profile.name || userName),
    [profile.name, userName]
  );

  useEffect(() => {
    const updatedProfile = {
      name: userName,
      email: userEmail,
    };

    setProfile(updatedProfile);
    setOriginalProfile(updatedProfile);
  }, [userName, userEmail]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    document.documentElement.classList.toggle(
      "taskflow-settings-dark",
      settings.darkMode
    );
  }, [settings]);

  const activeItem =
    SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
    SETTINGS_ITEMS[0];

  const handleSettingChange = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaveMessage("");
  };

  const handleProfileChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaveMessage("");
  };

  const handleSaveProfile = () => {
    const trimmedName = profile.name.trim();
    const trimmedEmail = profile.email.trim();

    if (!trimmedName) {
      setSaveMessage("Please enter your full name.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setSaveMessage("Please enter a valid email address.");
      return;
    }

    const updatedProfile = {
      name: trimmedName,
      email: trimmedEmail,
    };

    setProfile(updatedProfile);
    setOriginalProfile(updatedProfile);

    try {
      localStorage.setItem(
        "taskflow-profile",
        JSON.stringify(updatedProfile)
      );
    } catch {
      // Ignore localStorage errors.
    }

    setSaveMessage("Profile changes saved successfully.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const handleResetProfile = () => {
    setProfile(originalProfile);
    setSaveMessage("Profile changes were reset.");

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);
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

  const handlePasswordUpdate = (event) => {
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
      text: "Password validation passed. Connect this form to your backend password endpoint to persist the change.",
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const resetAllPreferences = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaveMessage("All workspace preferences have been restored.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const renderPasswordInput = (
    label,
    field,
    value,
    visible,
    setVisible,
    placeholder
  ) => (
    <div className="settings-form-group">
      <label htmlFor={field}>{label}</label>

      <div className="settings-password-wrapper">
        <FaKey className="settings-input-icon" />

        <input
          id={field}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            handlePasswordChange(field, event.target.value)
          }
          placeholder={placeholder}
          autoComplete="new-password"
        />

        <button
          type="button"
          className="settings-password-toggle"
          onClick={() => setVisible((previous) => !previous)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <motion.div
      key="account"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-section-content"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>
          <h2>Account information</h2>
          <p>
            Manage your profile identity and TaskFlow workspace information.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaUser />
        </div>
      </div>

      <motion.div
        className="settings-profile-card"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="settings-avatar-large">
          {initials}
          <span className="settings-avatar-status" />
        </div>

        <div className="settings-profile-main">
          <h3>{profile.name || "Your Name"}</h3>

          <p>{profile.email || "your@email.com"}</p>

          <div className="settings-profile-meta">
            <span>
              <FaCircle />
              {userRole}
            </span>

            <span>
              <FaCheckCircle />
              Active account
            </span>
          </div>
        </div>

        <span className="settings-role-badge">
          {userRole}
        </span>
      </motion.div>

      <div className="settings-grid-2">
        <motion.div
          className="settings-field-card"
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="settings-name">FULL NAME</label>

          <div className="settings-input-box">
            <FaUser />

            <input
              id="settings-name"
              type="text"
              value={profile.name}
              onChange={(event) =>
                handleProfileChange("name", event.target.value)
              }
              placeholder="Enter your full name"
            />
          </div>
        </motion.div>

        <motion.div
          className="settings-field-card"
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="settings-email">EMAIL ADDRESS</label>

          <div className="settings-input-box">
            <FaEnvelope />

            <input
              id="settings-email"
              type="email"
              value={profile.email}
              onChange={(event) =>
                handleProfileChange("email", event.target.value)
              }
              placeholder="Enter your email"
            />
          </div>
        </motion.div>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>
            <strong className="settings-active-text">
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="settings-security-banner">
        <div className="settings-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <p>
            Your TaskFlow account information is securely associated
            with your workspace.
          </p>
        </div>

        <FaCheckCircle className="settings-banner-check" />
      </div>

      <div className="settings-action-bar">
        <div className="settings-save-status">
          <FaCheckCircle />

          <div>
            <strong>
              {saveMessage || "All changes saved"}
            </strong>

            <span>
              Your workspace information is up to date.
            </span>
          </div>
        </div>

        <div className="settings-action-buttons">
          <button
            type="button"
            className="settings-btn settings-btn-secondary"
            onClick={handleResetProfile}
          >
            <FaUndo />
            Reset
          </button>

          <button
            type="button"
            className="settings-btn settings-btn-primary"
            onClick={handleSaveProfile}
          >
            <FaSave />
            Save changes
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-section-content"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>
          <h2>Customize your workspace</h2>
          <p>
            Control how TaskFlow looks and behaves on your screen.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-theme-preview">
        <div
          className={`settings-preview-window ${
            settings.darkMode ? "dark-preview" : ""
          }`}
        >
          <div className="preview-topbar">
            <div className="preview-dot" />
            <div className="preview-dot" />
            <div className="preview-dot" />
          </div>

          <div className="preview-body">
            <div className="preview-sidebar" />

            <div className="preview-content">
              <div className="preview-line large" />
              <div className="preview-line" />
              <div className="preview-cards">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-theme-copy">
          <span className="settings-eyebrow">
            CURRENT THEME
          </span>

          <h3>
            {settings.darkMode ? "Dark mode" : "Light mode"}
          </h3>

          <p>
            {settings.darkMode
              ? "A darker interface designed for comfortable low-light work."
              : "A bright, clean interface designed for focused daytime work."}
          </p>
        </div>
      </div>

      <div className="settings-option-grid">
        <button
          type="button"
          className={`settings-choice-card ${
            !settings.darkMode ? "selected" : ""
          }`}
          onClick={() =>
            handleSettingChange("darkMode", false)
          }
        >
          <div className="settings-choice-icon">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Clean and bright interface</span>
          </div>

          {settings.darkMode === false && (
            <FaCheckCircle className="choice-check" />
          )}
        </button>

        <button
          type="button"
          className={`settings-choice-card ${
            settings.darkMode ? "selected" : ""
          }`}
          onClick={() =>
            handleSettingChange("darkMode", true)
          }
        >
          <div className="settings-choice-icon dark">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Comfortable low-light interface</span>
          </div>

          {settings.darkMode && (
            <FaCheckCircle className="choice-check" />
          )}
        </button>
      </div>

      <div className="settings-toggle-card">
        <div className="settings-toggle-icon">
          <FaDesktop />
        </div>

        <div className="settings-toggle-copy">
          <strong>Compact workspace</strong>

          <span>
            Reduce spacing throughout the settings workspace.
          </span>
        </div>

        <button
          type="button"
          className={`settings-switch ${
            settings.compactMode ? "active" : ""
          }`}
          onClick={() =>
            handleSettingChange(
              "compactMode",
              !settings.compactMode
            )
          }
          aria-label="Toggle compact workspace"
        >
          <span />
        </button>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-section-content"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">
            NOTIFICATIONS
          </span>

          <h2>Stay in control</h2>

          <p>
            Choose which TaskFlow events should notify you.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-notification-hero">
        <div className="notification-hero-icon">
          <FaBell />
        </div>

        <div>
          <strong>Notification preferences</strong>

          <p>
            Customize the alerts that matter most to your workflow.
          </p>
        </div>

        <span className="notification-count">
          {
            Object.values(settings).filter(
              (value) => value === true
            ).length
          }{" "}
          active
        </span>
      </div>

      <div className="settings-notification-list">
        {[
          {
            key: "emailNotifications",
            icon: FaEnvelope,
            title: "Email notifications",
            description:
              "Receive important TaskFlow updates by email.",
          },
          {
            key: "taskNotifications",
            icon: FaTasks,
            title: "Task notifications",
            description:
              "Get notified when tasks are assigned or updated.",
          },
          {
            key: "projectNotifications",
            icon: FaProjectDiagram,
            title: "Project notifications",
            description:
              "Receive updates about your projects and milestones.",
          },
          {
            key: "securityNotifications",
            icon: FaShieldAlt,
            title: "Security notifications",
            description:
              "Receive alerts about important account activity.",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              className="settings-notification-item"
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="settings-notification-icon">
                <Icon />
              </div>

              <div className="settings-notification-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings[item.key] ? "active" : ""
                }`}
                onClick={() =>
                  handleSettingChange(
                    item.key,
                    !settings[item.key]
                  )
                }
                aria-label={`Toggle ${item.title}`}
              >
                <span />
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      key="security"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-section-content"
    >
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

      <div className="settings-security-overview">
        <div className="security-score">
          <div className="security-score-circle">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Account security</strong>

            <span>
              Your account is currently protected.
            </span>
          </div>
        </div>

        <div className="security-status-pill">
          <FaCheckCircle />
          Secure
        </div>
      </div>

      <form
        className="settings-password-form"
        onSubmit={handlePasswordUpdate}
      >
        <div className="settings-form-grid">
          {renderPasswordInput(
            "CURRENT PASSWORD",
            "currentPassword",
            passwords.currentPassword,
            showCurrentPassword,
            setShowCurrentPassword,
            "Enter current password"
          )}

          <div />

          {renderPasswordInput(
            "NEW PASSWORD",
            "newPassword",
            passwords.newPassword,
            showNewPassword,
            setShowNewPassword,
            "Minimum 6 characters"
          )}

          {renderPasswordInput(
            "CONFIRM PASSWORD",
            "confirmPassword",
            passwords.confirmPassword,
            showConfirmPassword,
            setShowConfirmPassword,
            "Repeat new password"
          )}
        </div>

        <div className="settings-password-requirements">
          <div>
            <FaCheckCircle
              className={
                passwords.newPassword.length >= 6
                  ? "valid"
                  : ""
              }
            />

            <span>At least 6 characters</span>
          </div>

          <div>
            <FaCheckCircle
              className={
                passwords.newPassword &&
                passwords.newPassword ===
                  passwords.confirmPassword
                  ? "valid"
                  : ""
              }
            />

            <span>Passwords match</span>
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

        <div className="settings-action-bar security-actions">
          <div>
            <strong>Protect your account</strong>

            <span>
              Use a unique password that you do not reuse elsewhere.
            </span>
          </div>

          <button
            type="submit"
            className="settings-btn settings-btn-primary"
          >
            <FaKey />
            Update password
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderApplication = () => (
    <motion.div
      key="application"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="settings-section-content"
    >
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">
            APPLICATION
          </span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace and platform.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaCog />
        </div>
      </div>

      <div className="application-brand-card">
        <div className="application-brand-icon">
          TF
        </div>

        <div>
          <span>PROJECT MANAGEMENT PLATFORM</span>

          <h3>TaskFlow</h3>

          <p>
            Organize projects, manage tasks and keep your team
            moving forward.
          </p>
        </div>

        <span className="application-version">
          v1.0.0
        </span>
      </div>

      <div className="application-info-grid">
        <div className="application-info-card">
          <FaDesktop />

          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div className="application-info-card">
          <FaGlobe />

          <span>ENVIRONMENT</span>
          <strong>Production</strong>
        </div>

        <div className="application-info-card">
          <FaDatabase />

          <span>DATA STORAGE</span>
          <strong>Secure Database</strong>
        </div>

        <div className="application-info-card">
          <FaShieldAlt />

          <span>SYSTEM STATUS</span>
          <strong className="application-status">
            <FaCircle />
            Operational
          </strong>
        </div>
      </div>

      <div className="application-preferences">
        <div>
          <div className="settings-info-icon purple">
            <FaCog />
          </div>

          <div>
            <strong>Workspace preferences</strong>

            <span>
              Reset your local TaskFlow preferences to their defaults.
            </span>
          </div>
        </div>

        <button
          type="button"
          className="settings-btn settings-btn-secondary"
          onClick={resetAllPreferences}
        >
          <FaUndo />
          Reset preferences
        </button>
      </div>

      <div className="settings-security-banner application-banner">
        <div className="settings-security-icon">
          <FaCheckCircle />
        </div>

        <div>
          <strong>Everything looks good</strong>

          <p>
            TaskFlow is ready for your next project.
          </p>
        </div>

        <span className="operational-badge">
          Operational
        </span>
      </div>
    </motion.div>
  );

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

  return (
    <div
      className={`settings-page ${
        settings.compactMode ? "settings-compact" : ""
      } ${settings.darkMode ? "settings-dark" : ""}`}
    >
      <div className="settings-background">
        <div className="settings-grid-bg" />
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />
      </div>

      <main className="settings-main">
        <motion.header
          className="settings-page-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <div className="settings-breadcrumb">
              WORKSPACE
              <FaChevronRight />
              <span>SETTINGS</span>
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
        </motion.header>

        <motion.div
          className="settings-layout"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
          }}
        >
          <aside className="settings-navigation">
            <div className="settings-nav-title">
              SETTINGS
            </div>

            <div className="settings-nav-items">
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
                    onClick={() => {
                      setActiveSection(item.id);
                      setSaveMessage("");
                      setPasswordMessage({
                        type: "",
                        text: "",
                      });
                    }}
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

            <div className="settings-nav-security">
              <div className="settings-nav-security-icon">
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
            <AnimatePresence mode="wait">
              {renderActiveSection()}
            </AnimatePresence>
          </section>
        </motion.div>

        <motion.div
          className="settings-footer-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
        >
          <div className="settings-footer-icon">
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

          <span className="settings-footer-status">
            <FaCheckCircle />
            Secure
          </span>
        </motion.div>
      </main>
    </div>
  );
}

export default Settings;