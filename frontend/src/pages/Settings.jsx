import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

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
  FaRedo,
  FaSave,
  FaEdit,
  FaTimes,
  FaEnvelope,
  FaTasks,
  FaFolder,
  FaUsers,
  FaChartBar,
  FaDesktop,
  FaDatabase,
  FaCode,
  FaServer,
  FaCircle,
  FaKey,
} from "react-icons/fa";

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
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) return "SP";

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
    "Souradipta Patra"
  );
};

const getUserEmail = (user) => {
  return user?.email || "soura@gmail.com";
};

const getUserRole = (user) => {
  return user?.role || "Admin";
};

/* =========================================================
   ANIMATION
========================================================= */

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   SETTINGS PAGE
========================================================= */

const Settings = () => {
  const { user } = useAuth();

  /* -------------------------------------------------------
     USER INFORMATION
  ------------------------------------------------------- */

  const initialName = getUserName(user);
  const initialEmail = getUserEmail(user);
  const initialRole = getUserRole(user);

  /* -------------------------------------------------------
     SECTION
  ------------------------------------------------------- */

  const [activeSection, setActiveSection] = useState("account");

  /* -------------------------------------------------------
     SETTINGS
  ------------------------------------------------------- */

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  /* -------------------------------------------------------
     PROFILE
  ------------------------------------------------------- */

  const [profile, setProfile] = useState({
    name: initialName,
    email: initialEmail,
    role: initialRole,
  });

  const [profileDraft, setProfileDraft] = useState({
    name: initialName,
    email: initialEmail,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  /* -------------------------------------------------------
     SAVE STATE
  ------------------------------------------------------- */

  const [isSaving, setIsSaving] = useState(false);

  /* -------------------------------------------------------
     DERIVED VALUES
  ------------------------------------------------------- */

  const initials = useMemo(
    () => getInitials(profile.name),
    [profile.name]
  );

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleSettingChange = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  /* -------------------------------------------------------
     PROFILE MODAL
  ------------------------------------------------------- */

  const openProfileEditor = () => {
    setProfileDraft({
      name: profile.name,
      email: profile.email,
    });

    setIsEditingProfile(true);
  };

  const closeProfileEditor = () => {
    setIsEditingProfile(false);

    setProfileDraft({
      name: profile.name,
      email: profile.email,
    });
  };

  const handleProfileInput = (event) => {
    const { name, value } = event.target;

    setProfileDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveProfile = () => {
    const trimmedName = profileDraft.name.trim();
    const trimmedEmail = profileDraft.email.trim();

    if (!trimmedName) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setProfile((previous) => ({
      ...previous,
      name: trimmedName,
      email: trimmedEmail,
    }));

    setIsEditingProfile(false);

    toast.success("Profile updated successfully.");
  };

  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    if (!passwords.currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password validation successful. Connect your backend password endpoint to persist this change."
    );

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Password details validated.");
  };

  /* -------------------------------------------------------
     RESET
  ------------------------------------------------------- */

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);

    setProfile({
      name: initialName,
      email: initialEmail,
      role: initialRole,
    });

    setProfileDraft({
      name: initialName,
      email: initialEmail,
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("");

    toast.info("Settings restored to their original values.");
  };

  /* -------------------------------------------------------
     SAVE SETTINGS
  ------------------------------------------------------- */

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      /*
       * This is intentionally local for now.
       *
       * When your backend settings endpoint is ready,
       * replace this section with your Axios request.
       */

      await new Promise((resolve) => {
        setTimeout(resolve, 650);
      });

      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     SECTION CONTENT
  ========================================================= */

  const renderAccountSection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="account"
    >
      {/* ---------------------------------------------------
          SECTION HEADER
      --------------------------------------------------- */}

      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            Manage your personal identity and TaskFlow
            workspace information.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaUser />
        </div>
      </div>

      {/* ---------------------------------------------------
          PROFILE CARD
      --------------------------------------------------- */}

      <div className="settings-profile-card">
        <div className="settings-profile-main">
          <div className="settings-profile-avatar">
            {initials}

            <span className="settings-online-dot" />
          </div>

          <div className="settings-profile-details">
            <div className="settings-profile-name-row">
              <h3>{profile.name}</h3>

              <span className="settings-role-badge">
                {profile.role}
              </span>
            </div>

            <p className="settings-profile-email">
              {profile.email}
            </p>

            <div className="settings-profile-status">
              <span className="status-item status-active">
                <FaCheckCircle />
                Active account
              </span>

              <span className="status-item status-protected">
                <FaShieldAlt />
                Protected workspace
              </span>
            </div>
          </div>
        </div>

        {/* IMPORTANT:
            This button is deliberately NOT absolute
            and NOT width: 100%.
        */}

        <button
          type="button"
          className="settings-edit-profile-btn"
          onClick={openProfileEditor}
        >
          <FaEdit />

          <span>Edit profile</span>
        </button>
      </div>

      {/* ---------------------------------------------------
          INFORMATION GRID
      --------------------------------------------------- */}

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{profile.name}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{profile.email}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{profile.role}</strong>
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

      {/* ---------------------------------------------------
          PROTECTED WORKSPACE
      --------------------------------------------------- */}

      <div className="settings-protected-card">
        <div className="settings-protected-icon">
          <FaShieldAlt />
        </div>

        <div className="settings-protected-content">
          <strong>Protected workspace</strong>

          <p>
            Your TaskFlow account information is securely
            associated with your workspace.
          </p>
        </div>

        <FaCheckCircle className="settings-protected-check" />
      </div>
    </motion.div>
  );

  /* =========================================================
     APPEARANCE
  ========================================================= */

  const renderAppearanceSection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="appearance"
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Customize your workspace</h2>

          <p>
            Control how TaskFlow looks and behaves on your
            device.
          </p>
        </div>

        <div className="settings-header-icon">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>

      <div className="settings-option-card">
        <div className="settings-option-left">
          <div className="settings-option-icon">
            {settings.darkMode ? <FaMoon /> : <FaSun />}
          </div>

          <div>
            <h3>Dark mode</h3>

            <p>
              Use a darker interface that's easier on your
              eyes in low-light environments.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`settings-toggle ${
            settings.darkMode ? "active" : ""
          }`}
          onClick={() => handleSettingChange("darkMode")}
          aria-label="Toggle dark mode"
        >
          <span />
        </button>
      </div>

      <div className="settings-theme-preview">
        <div className="settings-preview-heading">
          <span>THEME PREVIEW</span>

          <FaPalette />
        </div>

        <div className="settings-preview-window">
          <div className="preview-sidebar" />

          <div className="preview-main">
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
    </motion.div>
  );

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const renderNotificationsSection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="notifications"
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">
            NOTIFICATIONS
          </span>

          <h2>Notification preferences</h2>

          <p>
            Choose which TaskFlow alerts you want to receive.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-options-list">
        <div className="settings-option-card">
          <div className="settings-option-left">
            <div className="settings-option-icon">
              <FaEnvelope />
            </div>

            <div>
              <h3>Email notifications</h3>

              <p>
                Receive important TaskFlow updates by email.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.emailNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange("emailNotifications")
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-option-card">
          <div className="settings-option-left">
            <div className="settings-option-icon">
              <FaTasks />
            </div>

            <div>
              <h3>Task notifications</h3>

              <p>
                Get notified about task assignments,
                updates and completions.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.taskNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange("taskNotifications")
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-option-card">
          <div className="settings-option-left">
            <div className="settings-option-icon">
              <FaFolder />
            </div>

            <div>
              <h3>Project notifications</h3>

              <p>
                Receive updates when projects change or are
                completed.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`settings-toggle ${
              settings.projectNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange("projectNotifications")
            }
          >
            <span />
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* =========================================================
     SECURITY
  ========================================================= */

  const renderSecuritySection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="security"
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected with a
            strong password.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaLock />
        </div>
      </div>

      <form
        className="settings-password-form"
        onSubmit={handlePasswordUpdate}
      >
        <div className="settings-password-heading">
          <div className="settings-option-icon">
            <FaKey />
          </div>

          <div>
            <h3>Change password</h3>

            <p>
              Your password should contain at least 6
              characters.
            </p>
          </div>
        </div>

        <div className="settings-form-grid">
          <div className="settings-form-group full">
            <label htmlFor="currentPassword">
              Current password
            </label>

            <div className="settings-input-wrapper">
              <FaLock />

              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label htmlFor="newPassword">
              New password
            </label>

            <div className="settings-input-wrapper">
              <FaKey />

              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="settings-input-wrapper">
              <FaKey />

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        {passwordMessage && (
          <div className="settings-password-message">
            <FaInfoCircle />

            <span>{passwordMessage}</span>
          </div>
        )}

        <button
          type="submit"
          className="settings-primary-action"
        >
          <FaLock />
          Update password
        </button>
      </form>

      <div className="settings-security-status">
        <div className="settings-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <p>
            Your TaskFlow account is currently protected.
          </p>
        </div>

        <span>
          <FaCheckCircle />
          Secure
        </span>
      </div>
    </motion.div>
  );

  /* =========================================================
     APPLICATION
  ========================================================= */

  const renderApplicationSection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="application"
    >
      <div className="settings-content-header">
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

      <div className="settings-app-hero">
        <div className="settings-app-logo">TF</div>

        <div className="settings-app-details">
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

      <div className="settings-technical-grid">
        <div className="settings-tech-card">
          <FaDesktop />

          <div>
            <span>PLATFORM</span>
            <strong>Web Application</strong>
          </div>

          <FaCheckCircle />
        </div>

        <div className="settings-tech-card">
          <FaServer />

          <div>
            <span>ENVIRONMENT</span>
            <strong>Production</strong>
          </div>

          <FaCheckCircle />
        </div>

        <div className="settings-tech-card">
          <FaCode />

          <div>
            <span>FRONTEND</span>
            <strong>React + Vite</strong>
          </div>

          <FaCheckCircle />
        </div>

        <div className="settings-tech-card">
          <FaDatabase />

          <div>
            <span>DATABASE</span>
            <strong>MongoDB</strong>
          </div>

          <FaCheckCircle />
        </div>

        <div className="settings-tech-card">
          <FaUsers />

          <div>
            <span>WORKSPACE</span>
            <strong>Team Management</strong>
          </div>

          <FaCheckCircle />
        </div>

        <div className="settings-tech-card">
          <FaChartBar />

          <div>
            <span>SYSTEM STATUS</span>
            <strong className="settings-active-text">
              Operational
            </strong>
          </div>

          <FaCheckCircle />
        </div>
      </div>

      <div className="settings-about-card">
        <div className="settings-about-icon">
          <FaInfoCircle />
        </div>

        <div>
          <strong>About TaskFlow</strong>

          <p>
            TaskFlow is designed to provide a centralized,
            organized and secure environment for modern
            project management.
          </p>
        </div>

        <span className="settings-operational-badge">
          <FaCircle />
          Operational
        </span>
      </div>
    </motion.div>
  );

  /* =========================================================
     SECTION RENDERER
  ========================================================= */

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
    <div
      className={`settings-page ${
        settings.darkMode ? "settings-dark-mode" : ""
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="settings-background" aria-hidden="true">
        <div className="settings-bg-grid" />

        <div className="settings-bg-orb settings-bg-orb-one" />

        <div className="settings-bg-orb settings-bg-orb-two" />

        <div className="settings-bg-orb settings-bg-orb-three" />

        <div className="settings-bg-glow settings-bg-glow-one" />

        <div className="settings-bg-glow settings-bg-glow-two" />
      </div>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="settings-layout">
        {/* ===================================================
            NAVBAR
        =================================================== */}

        <Navbar />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="settings-main">
          <motion.div
            className="settings-page-container"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ===============================================
                PAGE HEADER
            =============================================== */}

            <div className="settings-page-header">
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
                <FaShieldAlt />

                <span>Workspace secure</span>
              </div>
            </div>

            {/* ===============================================
                MAIN SETTINGS CARD
            =============================================== */}

            <section className="settings-shell">
              {/* =============================================
                  LEFT NAVIGATION
              ============================================= */}

              <aside className="settings-sidebar">
                <div className="settings-sidebar-title">
                  SETTINGS
                </div>

                <div className="settings-sidebar-items">
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

                        <span className="settings-nav-text">
                          <strong>{item.label}</strong>

                          <small>
                            {item.description}
                          </small>
                        </span>

                        <FaChevronRight className="settings-nav-arrow" />
                      </button>
                    );
                  })}
                </div>

                {/* =========================================
                    SIDEBAR SECURITY CARD
                ========================================= */}

                <div className="settings-sidebar-security">
                  <div className="settings-sidebar-security-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Protected workspace</strong>

                    <p>
                      Your TaskFlow account is secure.
                    </p>
                  </div>

                  <FaCheckCircle />
                </div>
              </aside>

              {/* =============================================
                  CONTENT
              ============================================= */}

              <section className="settings-content">
                <AnimatePresence mode="wait">
                  {renderActiveSection()}
                </AnimatePresence>

                {/* =========================================
                    FOOTER ACTIONS
                ========================================= */}

                <div className="settings-content-footer">
                  <div className="settings-save-status">
                    <span className="settings-save-dot" />

                    <div>
                      <strong>
                        All changes are currently saved
                      </strong>

                      <small>
                        Your workspace preferences stay
                        organized and protected.
                      </small>
                    </div>
                  </div>

                  <div className="settings-footer-actions">
                    <button
                      type="button"
                      className="settings-reset-btn"
                      onClick={handleReset}
                    >
                      <FaRedo />
                      Reset
                    </button>

                    <button
                      type="button"
                      className="settings-save-btn"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="settings-spinner" />
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

            {/* ===============================================
                SECURITY FOOTER
            =============================================== */}

            <div className="settings-bottom-security">
              <div className="settings-bottom-security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  Your preferences are stored securely
                </strong>

                <p>
                  TaskFlow keeps your workspace settings
                  organized and protected.
                </p>
              </div>

              <span>
                <FaCheckCircle />
                Secure
              </span>
            </div>
          </motion.div>
        </main>
      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            className="settings-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={closeProfileEditor}
          >
            <motion.div
              className="settings-profile-modal"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              transition={{
                duration: 0.22,
              }}
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              {/* ===========================================
                  MODAL HEADER
              =========================================== */}

              <div className="settings-modal-header">
                <div>
                  <span className="settings-eyebrow">
                    PROFILE
                  </span>

                  <h2>Edit profile</h2>

                  <p>
                    Update your TaskFlow account information.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-modal-close"
                  onClick={closeProfileEditor}
                  aria-label="Close edit profile"
                >
                  <FaTimes />
                </button>
              </div>

              {/* ===========================================
                  PROFILE PREVIEW
              =========================================== */}

              <div className="settings-modal-profile-preview">
                <div className="settings-modal-avatar">
                  {getInitials(profileDraft.name)}
                </div>

                <div>
                  <strong>
                    {profileDraft.name || "Your name"}
                  </strong>

                  <span>
                    {profileDraft.email ||
                      "your@email.com"}
                  </span>
                </div>
              </div>

              {/* ===========================================
                  FORM
              =========================================== */}

              <div className="settings-modal-form">
                <div className="settings-form-group">
                  <label htmlFor="profileName">
                    Full name
                  </label>

                  <div className="settings-input-wrapper">
                    <FaUser />

                    <input
                      id="profileName"
                      type="text"
                      name="name"
                      value={profileDraft.name}
                      onChange={handleProfileInput}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="settings-form-group">
                  <label htmlFor="profileEmail">
                    Email address
                  </label>

                  <div className="settings-input-wrapper">
                    <FaEnvelope />

                    <input
                      id="profileEmail"
                      type="email"
                      name="email"
                      value={profileDraft.email}
                      onChange={handleProfileInput}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* ===========================================
                  MODAL ACTIONS
              =========================================== */}

              <div className="settings-modal-actions">
                <button
                  type="button"
                  className="settings-modal-cancel"
                  onClick={closeProfileEditor}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="settings-modal-save"
                  onClick={saveProfile}
                >
                  <FaSave />
                  Save profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;