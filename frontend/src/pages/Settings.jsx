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
  FaEye,
  FaEyeSlash,
  FaKey,
  FaDesktop,
  FaGlobe,
  FaDatabase,
  FaRocket,
  FaCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Settings.css";

const SETTINGS_ITEMS = [
  {
    id: "account",
    title: "Account",
    subtitle: "Your profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Customize your workspace",
    icon: FaPalette,
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Manage your alerts",
    icon: FaBell,
  },
  {
    id: "security",
    title: "Security",
    subtitle: "Password and security",
    icon: FaLock,
  },
  {
    id: "application",
    title: "Application",
    subtitle: "TaskFlow information",
    icon: FaInfoCircle,
  },
];

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
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

function getInitials(name = "") {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "SP";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getUserName(user) {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra"
  );
}

function getUserEmail(user) {
  return user?.email || "soura@gmail.com";
}

function getUserRole(user) {
  return user?.role || "Administrator";
}

function SettingToggle({
  checked,
  onChange,
  icon: Icon,
  title,
  description,
  accent = "purple",
}) {
  return (
    <button
      type="button"
      className={`setting-toggle-card ${
        checked ? "is-enabled" : ""
      } ${accent}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <div className="toggle-card-left">
        <div className="toggle-card-icon">
          <Icon />
        </div>

        <div className="toggle-card-copy">
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
      </div>

      <span className={`premium-toggle ${checked ? "active" : ""}`}>
        <span />
      </span>
    </button>
  );
}

function Settings() {
  const [user, setUser] = useState(null);

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
      console.error("Unable to load saved settings:", error);
    }

    return DEFAULT_SETTINGS;
  });

  const [savedSettings, setSavedSettings] = useState(settings);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("taskflow-user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to read user:", error);
    }
  }, []);

  const userName = useMemo(() => getUserName(user), [user]);
  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const userRole = useMemo(() => getUserRole(user), [user]);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      localStorage.setItem(
        "taskflow-settings",
        JSON.stringify(settings)
      );

      setSavedSettings(settings);

      if (settings.darkMode) {
        document.documentElement.classList.add("taskflow-dark-preview");
      } else {
        document.documentElement.classList.remove(
          "taskflow-dark-preview"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 450));

      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(savedSettings);

    toast.info("Unsaved changes have been discarded.");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordFields((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordFields;

    if (!currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsPasswordSaving(true);

    try {
      /*
       * The UI is fully functional here.
       *
       * Connect your real backend password endpoint here when available.
       *
       * Example:
       *
       * await axios.put(
       *   `${import.meta.env.VITE_API_URL}/api/users/password`,
       *   {
       *     currentPassword,
       *     newPassword,
       *   }
       * );
       */

      await new Promise((resolve) => setTimeout(resolve, 700));

      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const renderAccount = () => (
    <motion.div
      key="account"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="settings-section-content"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">ACCOUNT</span>
          <h2>Account information</h2>
          <p>
            Manage your personal information and TaskFlow workspace
            identity.
          </p>
        </div>

        <div className="heading-icon purple">
          <FaUser />
        </div>
      </div>

      <div className="section-divider" />

      <div className="profile-hero-card">
        <div className="profile-identity">
          <div className="large-avatar">
            {initials}
            <span className="online-dot" />
          </div>

          <div className="profile-main-copy">
            <h3>{userName}</h3>
            <p>{userEmail}</p>

            <div className="profile-meta">
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
        </div>

        <span className="admin-badge">
          <FaShieldAlt />
          {userRole}
        </span>
      </div>

      <div className="information-grid">
        <div className="information-card">
          <div className="information-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{userName}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon slate">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon green">
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

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="settings-section-content"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">APPEARANCE</span>
          <h2>Workspace appearance</h2>
          <p>
            Personalize how TaskFlow looks and feels across your
            workspace.
          </p>
        </div>

        <div className="heading-icon purple">
          <FaPalette />
        </div>
      </div>

      <div className="section-divider" />

      <div className="appearance-preview">
        <div className="preview-glow" />

        <div className="preview-content">
          <div className="preview-window">
            <div className="preview-topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="preview-body">
              <div className="preview-sidebar" />

              <div className="preview-main">
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

          <div className="preview-copy">
            <span>LIVE PREVIEW</span>
            <h3>
              {settings.darkMode
                ? "Dark workspace"
                : "Light workspace"}
            </h3>
            <p>
              Your selected appearance will be used throughout your
              TaskFlow experience.
            </p>
          </div>
        </div>
      </div>

      <div className="appearance-options">
        <button
          type="button"
          className={`theme-card ${
            !settings.darkMode ? "selected" : ""
          }`}
          onClick={() => updateSetting("darkMode", false)}
        >
          <div className="theme-card-icon light">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Clean, bright and professional.</span>
          </div>

          { !settings.darkMode && (
            <FaCheckCircle className="theme-selected" />
          )}
        </button>

        <button
          type="button"
          className={`theme-card ${
            settings.darkMode ? "selected" : ""
          }`}
          onClick={() => updateSetting("darkMode", true)}
        >
          <div className="theme-card-icon dark">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Focused, elegant and easy on the eyes.</span>
          </div>

          { settings.darkMode && (
            <FaCheckCircle className="theme-selected" />
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="settings-section-content"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">NOTIFICATIONS</span>
          <h2>Notification preferences</h2>
          <p>
            Choose which TaskFlow events should notify you.
          </p>
        </div>

        <div className="heading-icon purple">
          <FaBell />
        </div>
      </div>

      <div className="section-divider" />

      <div className="notification-stack">
        <SettingToggle
          checked={settings.emailNotifications}
          onChange={(value) =>
            updateSetting("emailNotifications", value)
          }
          icon={FaEnvelope}
          title="Email notifications"
          description="Receive important TaskFlow updates by email."
        />

        <SettingToggle
          checked={settings.taskNotifications}
          onChange={(value) =>
            updateSetting("taskNotifications", value)
          }
          icon={FaTasks}
          title="Task notifications"
          description="Get notified when tasks are created, updated or assigned."
          accent="blue"
        />

        <SettingToggle
          checked={settings.projectNotifications}
          onChange={(value) =>
            updateSetting("projectNotifications", value)
          }
          icon={FaProjectDiagram}
          title="Project notifications"
          description="Stay updated on important project activity."
          accent="green"
        />
      </div>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      key="security"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="settings-section-content"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">SECURITY</span>
          <h2>Password & security</h2>
          <p>
            Keep your TaskFlow account secure with a strong password.
          </p>
        </div>

        <div className="heading-icon purple">
          <FaLock />
        </div>
      </div>

      <div className="section-divider" />

      <div className="security-banner">
        <div className="security-banner-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your account is protected</strong>
          <p>
            Use a unique password that you do not reuse on other
            services.
          </p>
        </div>

        <span>
          <FaCheckCircle />
          Secure
        </span>
      </div>

      <form
        className="password-form"
        onSubmit={handlePasswordSave}
      >
        <div className="password-field">
          <label htmlFor="currentPassword">
            Current password
          </label>

          <div className="password-input-wrapper">
            <FaKey />

            <input
              id="currentPassword"
              name="currentPassword"
              type={
                passwordVisibility.current
                  ? "text"
                  : "password"
              }
              value={passwordFields.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />

            <button
              type="button"
              onClick={() =>
                togglePasswordVisibility("current")
              }
              aria-label="Toggle current password visibility"
            >
              {passwordVisibility.current ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>
        </div>

        <div className="password-row">
          <div className="password-field">
            <label htmlFor="newPassword">
              New password
            </label>

            <div className="password-input-wrapper">
              <FaLock />

              <input
                id="newPassword"
                name="newPassword"
                type={
                  passwordVisibility.new
                    ? "text"
                    : "password"
                }
                value={passwordFields.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimum 6 characters"
              />

              <button
                type="button"
                onClick={() =>
                  togglePasswordVisibility("new")
                }
                aria-label="Toggle new password visibility"
              >
                {passwordVisibility.new ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="password-input-wrapper">
              <FaLock />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  passwordVisibility.confirm
                    ? "text"
                    : "password"
                }
                value={passwordFields.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePasswordVisibility("confirm")
                }
                aria-label="Toggle confirm password visibility"
              >
                {passwordVisibility.confirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="password-requirements">
          <span>
            <FaCheckCircle />
            Minimum 6 characters
          </span>

          <span>
            <FaCheckCircle />
            New passwords must match
          </span>
        </div>

        <button
          type="submit"
          className="primary-action-button"
          disabled={isPasswordSaving}
        >
          {isPasswordSaving ? (
            <>
              <span className="button-spinner" />
              Updating password...
            </>
          ) : (
            <>
              <FaKey />
              Update password
            </>
          )}
        </button>
      </form>
    </motion.div>
  );

  const renderApplication = () => (
    <motion.div
      key="application"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="settings-section-content"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">APPLICATION</span>
          <h2>TaskFlow information</h2>
          <p>
            Details about your TaskFlow workspace application.
          </p>
        </div>

        <div className="heading-icon purple">
          <FaCog />
        </div>
      </div>

      <div className="section-divider" />

      <div className="application-hero">
        <div className="application-logo">
          TF
        </div>

        <div>
          <span>PROJECT MANAGEMENT PLATFORM</span>
          <h3>TaskFlow</h3>
          <p>
            A modern workspace for planning, managing and
            completing projects efficiently.
          </p>
        </div>

        <div className="application-status">
          <FaCheckCircle />
          Operational
        </div>
      </div>

      <div className="application-grid">
        <div className="application-card">
          <div className="application-card-icon purple">
            <FaRocket />
          </div>

          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="application-card">
          <div className="application-card-icon blue">
            <FaDesktop />
          </div>

          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div className="application-card">
          <div className="application-card-icon green">
            <FaDatabase />
          </div>

          <span>SERVICE STATUS</span>
          <strong className="operational">
            Operational
          </strong>
        </div>

        <div className="application-card">
          <div className="application-card-icon orange">
            <FaGlobe />
          </div>

          <span>ENVIRONMENT</span>
          <strong>Production</strong>
        </div>
      </div>

      <div className="application-footer">
        <div>
          <FaInfoCircle />
          <span>
            TaskFlow workspace configuration is stored securely.
          </span>
        </div>

        <strong>TaskFlow © 2026</strong>
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
    <div className="taskflow-app-shell">
      {/* EXISTING GLOBAL SIDEBAR */}
      <Sidebar />

      {/* EXISTING GLOBAL NAVBAR */}
      <Navbar />

      {/* SETTINGS PAGE ONLY */}
      <main className="settings-page">
        <div className="settings-background">
          <div className="settings-orb orb-one" />
          <div className="settings-orb orb-two" />
          <div className="settings-orb orb-three" />

          <div className="settings-grid-pattern" />
          <div className="settings-noise" />
        </div>

        <motion.div
          className="settings-container"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* PAGE HEADER */}
          <header className="settings-page-header">
            <div className="settings-header-left">
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

          {/* MAIN SETTINGS CARD */}
          <section className="settings-main-card">
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
                      type="button"
                      key={item.id}
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
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </span>

                      <FaChevronRight className="nav-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="navigation-security-card">
                <div className="navigation-security-icon">
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
            <div className="settings-content">
              <AnimatePresence mode="wait">
                {renderActiveSection()}
              </AnimatePresence>

              {/* SAVE BAR */}
              {(
                activeSection === "account" ||
                activeSection === "appearance" ||
                activeSection === "notifications"
              ) && (
                <div className="settings-action-bar">
                  <div className="changes-status">
                    <span
                      className={
                        hasUnsavedChanges
                          ? "status-dot changed"
                          : "status-dot"
                      }
                    />

                    <div>
                      <strong>
                        {hasUnsavedChanges
                          ? "Unsaved changes"
                          : "All changes saved"}
                      </strong>

                      <span>
                        {hasUnsavedChanges
                          ? "Save your preferences to keep them."
                          : "Your preferences are up to date."}
                      </span>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      type="button"
                      className="secondary-action-button"
                      onClick={handleResetSettings}
                      disabled={!hasUnsavedChanges || isSaving}
                    >
                      <FaUndo />
                      Reset
                    </button>

                    <button
                      type="button"
                      className="primary-action-button"
                      onClick={handleSaveSettings}
                      disabled={!hasUnsavedChanges || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="button-spinner" />
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
              )}
            </div>
          </section>

          {/* BOTTOM TRUST BAR */}
          <section className="settings-trust-bar">
            <div className="trust-left">
              <div className="trust-icon">
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
            </div>

            <div className="trust-status">
              <FaCheckCircle />
              Secure
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

export default Settings;