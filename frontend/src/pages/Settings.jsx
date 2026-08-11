// src/pages/Settings.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCheckCircle,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaDesktop,
  FaRocket,
  FaCircle,
  FaKey,
  FaUserShield,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";


// ============================================================
// SETTINGS SECTIONS
// ============================================================

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


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};


// ============================================================
// HELPERS
// ============================================================

const getInitials = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) {
    return "SP";
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);

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
  return user?.email || user?.emailAddress || "user@taskflow.app";
};


const getUserRole = (user) => {
  return user?.role || "Administrator";
};


// ============================================================
// COMPONENT
// ============================================================

const Settings = () => {
  const { user } = useAuth();

  // ----------------------------------------------------------
  // USER INFORMATION
  // ----------------------------------------------------------

  const initialUserName = getUserName(user);
  const initialUserEmail = getUserEmail(user);
  const initialUserRole = getUserRole(user);

  const [profile, setProfile] = useState({
    name: initialUserName,
    email: initialUserEmail,
    role: initialUserRole,
  });

  // ----------------------------------------------------------
  // ACTIVE SECTION
  // ----------------------------------------------------------

  const [activeSection, setActiveSection] = useState("account");

  // ----------------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------------

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // ----------------------------------------------------------
  // PASSWORD
  // ----------------------------------------------------------

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  // ----------------------------------------------------------
  // SAVE STATE
  // ----------------------------------------------------------

  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------------------------------------
  // LOAD LOCAL SETTINGS
  // ----------------------------------------------------------

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("taskflow-settings");

      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);

        setSettings((previous) => ({
          ...previous,
          ...parsedSettings,
        }));
      }
    } catch (error) {
      console.error("Unable to load TaskFlow settings:", error);
    }
  }, []);

  // ----------------------------------------------------------
  // SYNC USER INFORMATION
  // ----------------------------------------------------------

  useEffect(() => {
    setProfile({
      name: getUserName(user),
      email: getUserEmail(user),
      role: getUserRole(user),
    });
  }, [user]);

  // ----------------------------------------------------------
  // SAVE SETTINGS
  // ----------------------------------------------------------

  const saveSettings = () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      localStorage.setItem(
        "taskflow-settings",
        JSON.stringify(settings)
      );

      setTimeout(() => {
        setIsSaving(false);
        setSaveMessage("Changes saved successfully.");

        setTimeout(() => {
          setSaveMessage("");
        }, 3000);
      }, 450);
    } catch (error) {
      console.error("Unable to save settings:", error);

      setIsSaving(false);
      setSaveMessage("Unable to save settings.");
    }
  };

  // ----------------------------------------------------------
  // RESET SETTINGS
  // ----------------------------------------------------------

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);

    try {
      localStorage.setItem(
        "taskflow-settings",
        JSON.stringify(DEFAULT_SETTINGS)
      );
    } catch (error) {
      console.error("Unable to reset settings:", error);
    }

    setSaveMessage("Settings restored to default.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  // ----------------------------------------------------------
  // TOGGLE SETTINGS
  // ----------------------------------------------------------

  const toggleSetting = (settingName) => {
    setSettings((previous) => ({
      ...previous,
      [settingName]: !previous[settingName],
    }));
  };

  // ----------------------------------------------------------
  // PROFILE INPUT
  // ----------------------------------------------------------

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------
  // PASSWORD INPUT
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // PASSWORD UPDATE
  // ----------------------------------------------------------

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

    setPasswordMessage({
      type: "success",
      text: "Password validation successful. Connect this form to your backend password endpoint to persist the change.",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // ----------------------------------------------------------
  // PASSWORD STRENGTH
  // ----------------------------------------------------------

  const passwordStrength = useMemo(() => {
    const password = passwordData.newPassword;

    if (!password) {
      return {
        label: "Enter a password",
        level: 0,
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
        level: 1,
      };
    }

    if (score <= 3) {
      return {
        label: "Medium",
        level: 2,
      };
    }

    return {
      label: "Strong",
      level: 3,
    };
  }, [passwordData.newPassword]);

  // ----------------------------------------------------------
  // ACTIVE ITEM
  // ----------------------------------------------------------

  const activeItem =
    SETTINGS_ITEMS.find(
      (item) => item.id === activeSection
    ) || SETTINGS_ITEMS[0];

  const ActiveIcon = activeItem.icon;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="settings-shell">

      {/* ======================================================
          EXISTING SIDEBAR
          DO NOT MODIFY SIDEBAR COMPONENT
      ====================================================== */}

      <Sidebar />


      {/* ======================================================
          RIGHT APPLICATION AREA
      ====================================================== */}

      <div className="settings-app-area">

        {/* Existing Navbar */}
        <Navbar />


        {/* ====================================================
            SETTINGS MAIN
        ==================================================== */}

        <main className="settings-main">

          {/* Decorative background */}
          <div className="settings-bg settings-bg-one" />
          <div className="settings-bg settings-bg-two" />
          <div className="settings-bg settings-bg-three" />


          {/* ==================================================
              HEADER
          ================================================== */}

          <motion.header
            className="settings-header"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >

            <div className="settings-header-left">

              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>
                <FaChevronRight />
                <span className="active">SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences,
                notifications and security.
              </p>

            </div>


            <div className="settings-secure-badge">
              <FaShieldAlt />
              <span>
                <strong>Workspace secure</strong>
                <small>All systems operational</small>
              </span>
              <FaCheckCircle className="settings-secure-check" />
            </div>

          </motion.header>


          {/* ==================================================
              SETTINGS CARD
          ================================================== */}

          <motion.section
            className="settings-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >

            {/* =================================================
                LEFT SETTINGS NAVIGATION
            ================================================= */}

            <aside className="settings-navigation">

              <div className="settings-nav-heading">
                <span>SETTINGS</span>
                <small>Workspace controls</small>
              </div>


              <div className="settings-nav-items">

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


              {/* Protected workspace */}
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

                <FaCheckCircle className="protected-check" />

              </div>

            </aside>


            {/* =================================================
                RIGHT SETTINGS CONTENT
            ================================================= */}

            <section className="settings-content">

              {/* Content heading */}
              <div className="settings-content-header">

                <div>

                  <div className="settings-content-eyebrow">
                    <ActiveIcon />
                    {activeItem.label}
                  </div>

                  <h2>{activeItem.label}</h2>

                  <p>{activeItem.description}</p>

                </div>

                <div className="settings-content-icon">
                  <ActiveIcon />
                </div>

              </div>


              <div className="settings-divider" />


              {/* =================================================
                  SECTION CONTENT
              ================================================= */}

              <AnimatePresence mode="wait">

                {/* =================================================
                    ACCOUNT
                ================================================= */}

                {activeSection === "account" && (
                  <motion.div
                    key="account"
                    className="settings-section-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >

                    {/* Profile hero */}
                    <div className="account-profile-card">

                      <div className="account-avatar">
                        {getInitials(profile.name)}
                        <span className="avatar-online" />
                      </div>

                      <div className="account-profile-info">

                        <div className="account-name-row">
                          <h3>{profile.name}</h3>

                          <span className="admin-badge">
                            <FaUserShield />
                            {profile.role}
                          </span>
                        </div>

                        <p>{profile.email}</p>

                        <div className="account-status-row">

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

                    </div>


                    {/* Account information */}
                    <div className="settings-field-grid">

                      <div className="settings-field-card">

                        <div className="field-icon">
                          <FaUser />
                        </div>

                        <div className="field-content">
                          <label htmlFor="settings-name">
                            FULL NAME
                          </label>

                          <input
                            id="settings-name"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            type="text"
                            placeholder="Your full name"
                          />
                        </div>

                      </div>


                      <div className="settings-field-card">

                        <div className="field-icon blue">
                          <FaEnvelope />
                        </div>

                        <div className="field-content">
                          <label htmlFor="settings-email">
                            EMAIL ADDRESS
                          </label>

                          <input
                            id="settings-email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            type="email"
                            placeholder="your@email.com"
                          />
                        </div>

                      </div>


                      <div className="settings-field-card readonly">

                        <div className="field-icon gray">
                          <FaUserShield />
                        </div>

                        <div className="field-content">
                          <label>ROLE</label>
                          <strong>{profile.role}</strong>
                        </div>

                      </div>


                      <div className="settings-field-card readonly">

                        <div className="field-icon green">
                          <FaCheckCircle />
                        </div>

                        <div className="field-content">
                          <label>ACCOUNT STATUS</label>

                          <strong className="active-text">
                            Active
                          </strong>
                        </div>

                      </div>

                    </div>


                    {/* Security information */}
                    <div className="settings-info-banner">

                      <div className="info-banner-icon">
                        <FaShieldAlt />
                      </div>

                      <div>
                        <strong>Protected workspace</strong>
                        <p>
                          Your account information is securely
                          associated with your TaskFlow workspace.
                        </p>
                      </div>

                      <FaCheckCircle className="info-success" />

                    </div>


                    {/* Account actions */}
                    <div className="settings-actions">

                      <div className="settings-save-status">
                        {saveMessage && (
                          <>
                            <FaCheckCircle />
                            {saveMessage}
                          </>
                        )}
                      </div>

                      <div className="settings-action-buttons">

                        <button
                          type="button"
                          className="settings-button secondary"
                          onClick={() => {
                            setProfile({
                              name: getUserName(user),
                              email: getUserEmail(user),
                              role: getUserRole(user),
                            });
                          }}
                        >
                          <FaUndo />
                          Reset
                        </button>

                        <button
                          type="button"
                          className="settings-button primary"
                          onClick={saveSettings}
                          disabled={isSaving}
                        >
                          <FaSave />
                          {isSaving
                            ? "Saving..."
                            : "Save changes"}
                        </button>

                      </div>

                    </div>

                  </motion.div>
                )}


                {/* =================================================
                    APPEARANCE
                ================================================= */}

                {activeSection === "appearance" && (
                  <motion.div
                    key="appearance"
                    className="settings-section-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                  >

                    <div className="settings-feature-hero appearance-hero">

                      <div className="feature-hero-icon">
                        {settings.darkMode ? (
                          <FaMoon />
                        ) : (
                          <FaSun />
                        )}
                      </div>

                      <div>
                        <span>WORKSPACE THEME</span>

                        <h3>
                          {settings.darkMode
                            ? "Dark mode"
                            : "Light mode"}
                        </h3>

                        <p>
                          Choose the visual appearance of
                          your TaskFlow workspace.
                        </p>
                      </div>

                    </div>


                    <div className="settings-option-card">

                      <div className="option-icon">
                        <FaSun />
                      </div>

                      <div className="option-copy">
                        <strong>Light mode</strong>
                        <span>
                          A clean and bright workspace.
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`theme-choice ${
                          !settings.darkMode ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSettings((previous) => ({
                            ...previous,
                            darkMode: false,
                          }))
                        }
                      >
                        {!settings.darkMode && (
                          <FaCheckCircle />
                        )}
                        Light
                      </button>

                    </div>


                    <div className="settings-option-card">

                      <div className="option-icon dark">
                        <FaMoon />
                      </div>

                      <div className="option-copy">
                        <strong>Dark mode</strong>
                        <span>
                          A darker interface for low-light
                          environments.
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`theme-choice ${
                          settings.darkMode ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSettings((previous) => ({
                            ...previous,
                            darkMode: true,
                          }))
                        }
                      >
                        {settings.darkMode && (
                          <FaCheckCircle />
                        )}
                        Dark
                      </button>

                    </div>


                    <div className="settings-actions">

                      <div />

                      <button
                        type="button"
                        className="settings-button primary"
                        onClick={saveSettings}
                      >
                        <FaSave />
                        Save appearance
                      </button>

                    </div>

                  </motion.div>
                )}


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                {activeSection === "notifications" && (
                  <motion.div
                    key="notifications"
                    className="settings-section-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                  >

                    <div className="settings-feature-hero notification-hero">

                      <div className="feature-hero-icon">
                        <FaBell />
                      </div>

                      <div>
                        <span>NOTIFICATION CENTER</span>

                        <h3>
                          Stay informed
                        </h3>

                        <p>
                          Control which TaskFlow updates
                          you want to receive.
                        </p>
                      </div>

                    </div>


                    <div className="settings-toggle-list">

                      {/* Email */}
                      <div className="settings-toggle-card">

                        <div className="toggle-icon">
                          <FaEnvelope />
                        </div>

                        <div className="toggle-copy">
                          <strong>
                            Email notifications
                          </strong>

                          <span>
                            Receive important workspace
                            updates by email.
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`settings-switch ${
                            settings.emailNotifications
                              ? "on"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSetting(
                              "emailNotifications"
                            )
                          }
                          aria-label="Toggle email notifications"
                        >
                          <span />
                        </button>

                      </div>


                      {/* Tasks */}
                      <div className="settings-toggle-card">

                        <div className="toggle-icon task">
                          <FaTasks />
                        </div>

                        <div className="toggle-copy">
                          <strong>
                            Task notifications
                          </strong>

                          <span>
                            Get notified about task
                            assignments and updates.
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`settings-switch ${
                            settings.taskNotifications
                              ? "on"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSetting(
                              "taskNotifications"
                            )
                          }
                          aria-label="Toggle task notifications"
                        >
                          <span />
                        </button>

                      </div>


                      {/* Projects */}
                      <div className="settings-toggle-card">

                        <div className="toggle-icon project">
                          <FaProjectDiagram />
                        </div>

                        <div className="toggle-copy">
                          <strong>
                            Project notifications
                          </strong>

                          <span>
                            Receive updates about your
                            projects and milestones.
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`settings-switch ${
                            settings.projectNotifications
                              ? "on"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSetting(
                              "projectNotifications"
                            )
                          }
                          aria-label="Toggle project notifications"
                        >
                          <span />
                        </button>

                      </div>

                    </div>


                    <div className="settings-actions">

                      <div />

                      <button
                        type="button"
                        className="settings-button primary"
                        onClick={saveSettings}
                      >
                        <FaSave />
                        Save notifications
                      </button>

                    </div>

                  </motion.div>
                )}


                {/* =================================================
                    SECURITY
                ================================================= */}

                {activeSection === "security" && (
                  <motion.div
                    key="security"
                    className="settings-section-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                  >

                    <div className="settings-feature-hero security-hero">

                      <div className="feature-hero-icon">
                        <FaLock />
                      </div>

                      <div>
                        <span>ACCOUNT SECURITY</span>

                        <h3>
                          Protect your account
                        </h3>

                        <p>
                          Keep your TaskFlow account protected
                          with a strong password.
                        </p>
                      </div>

                    </div>


                    <form
                      className="password-form"
                      onSubmit={handlePasswordSubmit}
                    >

                      {/* Current */}
                      <div className="password-field">

                        <label htmlFor="currentPassword">
                          CURRENT PASSWORD
                        </label>

                        <div className="password-input-wrapper">

                          <FaKey />

                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={
                              showCurrentPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              passwordData.currentPassword
                            }
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


                      {/* New */}
                      <div className="password-field">

                        <label htmlFor="newPassword">
                          NEW PASSWORD
                        </label>

                        <div className="password-input-wrapper">

                          <FaLock />

                          <input
                            id="newPassword"
                            name="newPassword"
                            type={
                              showNewPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              passwordData.newPassword
                            }
                            onChange={handlePasswordChange}
                            placeholder="Create a new password"
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


                        {/* Password strength */}
                        <div className="password-strength">

                          <div className="strength-bars">

                            {[1, 2, 3].map((bar) => (
                              <span
                                key={bar}
                                className={
                                  passwordStrength.level >=
                                  bar
                                    ? `active level-${passwordStrength.level}`
                                    : ""
                                }
                              />
                            ))}

                          </div>

                          <span>
                            {passwordStrength.label}
                          </span>

                        </div>

                      </div>


                      {/* Confirm */}
                      <div className="password-field">

                        <label htmlFor="confirmPassword">
                          CONFIRM NEW PASSWORD
                        </label>

                        <div className="password-input-wrapper">

                          <FaLock />

                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              passwordData.confirmPassword
                            }
                            onChange={handlePasswordChange}
                            placeholder="Confirm your new password"
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


                      {/* Message */}
                      {passwordMessage.text && (
                        <div
                          className={`password-message ${
                            passwordMessage.type
                          }`}
                        >
                          {passwordMessage.type ===
                          "success" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaInfoCircle />
                          )}

                          <span>
                            {passwordMessage.text}
                          </span>
                        </div>
                      )}


                      <div className="settings-actions">

                        <div />

                        <button
                          type="submit"
                          className="settings-button primary"
                        >
                          <FaLock />
                          Update password
                        </button>

                      </div>

                    </form>

                  </motion.div>
                )}


                {/* =================================================
                    APPLICATION
                ================================================= */}

                {activeSection === "application" && (
                  <motion.div
                    key="application"
                    className="settings-section-content"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                  >

                    <div className="application-hero">

                      <div className="application-logo">
                        TF
                      </div>

                      <div className="application-hero-copy">

                        <span>TASKFLOW PLATFORM</span>

                        <h3>
                          Built for productive teams.
                        </h3>

                        <p>
                          A modern project management
                          workspace for organizing projects,
                          tasks and teams.
                        </p>

                      </div>

                      <div className="application-version">
                        <strong>1.0.0</strong>
                        <span>VERSION</span>
                      </div>

                    </div>


                    <div className="application-grid">

                      <div className="application-info-card">

                        <div className="application-info-icon">
                          <FaRocket />
                        </div>

                        <div>
                          <label>APPLICATION</label>
                          <strong>TaskFlow</strong>
                        </div>

                      </div>


                      <div className="application-info-card">

                        <div className="application-info-icon blue">
                          <FaDesktop />
                        </div>

                        <div>
                          <label>PLATFORM</label>
                          <strong>Web Application</strong>
                        </div>

                      </div>


                      <div className="application-info-card">

                        <div className="application-info-icon green">
                          <FaCheckCircle />
                        </div>

                        <div>
                          <label>SYSTEM STATUS</label>
                          <strong className="system-online">
                            Operational
                          </strong>
                        </div>

                      </div>


                      <div className="application-info-card">

                        <div className="application-info-icon purple">
                          <FaShieldAlt />
                        </div>

                        <div>
                          <label>WORKSPACE</label>
                          <strong>Protected</strong>
                        </div>

                      </div>

                    </div>


                    <div className="application-status-banner">

                      <div className="status-pulse">
                        <FaCircle />
                      </div>

                      <div>
                        <strong>
                          TaskFlow is running normally
                        </strong>

                        <span>
                          All core workspace services are
                          operational.
                        </span>
                      </div>

                      <span className="operational-badge">
                        Operational
                      </span>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </section>

          </motion.section>


          {/* ==================================================
              FOOTER SECURITY BAR
          ================================================== */}

          <motion.div
            className="settings-footer-security"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >

            <div className="footer-security-icon">
              <FaShieldAlt />
            </div>

            <div className="footer-security-copy">
              <strong>
                Your preferences are stored securely
              </strong>

              <span>
                TaskFlow keeps your workspace settings
                organized and protected.
              </span>
            </div>

            <div className="footer-security-status">
              <FaCheckCircle />
              Secure
            </div>

          </motion.div>

        </main>

      </div>

    </div>
  );
};


export default Settings;