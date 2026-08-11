import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  FaBriefcase,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

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
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};


/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "SP";

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
  "Administrator";


/* =========================================================
   COMPONENT
========================================================= */

export default function Settings() {
  const { user } = useAuth();

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const accountInfo = useMemo(
    () => ({
      name: userName,
      email: userEmail,
      role: userRole,
      initials,
    }),
    [userName, userEmail, userRole, initials]
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

    if (!passwordFields.currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }

    if (passwordFields.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (
      passwordFields.newPassword !==
      passwordFields.confirmPassword
    ) {
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

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
        duration: 0.5,
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
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };


  /* =========================================================
     ACCOUNT
  ========================================================= */

  const renderAccountSection = () => (
    <motion.div
      className="settings-section-content"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      key="account"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            View the information associated with your TaskFlow
            account.
          </p>
        </div>

        <div className="section-heading-icon">
          <FaUser />
        </div>
      </div>

      <div className="section-divider" />

      <div className="profile-summary">
        <div className="large-avatar">
          {accountInfo.initials}
        </div>

        <div className="profile-summary-info">
          <strong>{accountInfo.name}</strong>
          <span>{accountInfo.email}</span>
        </div>

        <span className="role-badge">
          {accountInfo.role}
        </span>
      </div>

      <div className="account-grid">
        <div className="information-card">
          <div className="information-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{accountInfo.name}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{accountInfo.email}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon gray">
            <FaBriefcase />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{accountInfo.role}</strong>
          </div>
        </div>

        <div className="information-card">
          <div className="information-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>

            <strong className="status-active">
              <span className="status-dot" />
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

          <span>
            Your account information is securely associated
            with your TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="protected-check" />
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
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how TaskFlow looks and feels.
          </p>
        </div>

        <div className="section-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="section-divider" />

      <div className="appearance-option">
        <div className="option-icon">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>

        <div className="option-content">
          <strong>Dark mode</strong>

          <span>
            Use a darker appearance across the workspace.
          </span>
        </div>

        <button
          type="button"
          className={`toggle-switch ${
            settings.darkMode ? "active" : ""
          }`}
          onClick={() =>
            handleSettingChange("darkMode")
          }
          aria-label="Toggle dark mode"
        >
          <span />
        </button>
      </div>

      <div className="appearance-preview">
        <div className="preview-top">
          <span />
          <span />
          <span />
        </div>

        <div className="preview-body">
          <div className="preview-sidebar">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="preview-content">
            <span className="preview-title" />
            <span />
            <span />
            <span />
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
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            NOTIFICATIONS
          </span>

          <h2>Notification preferences</h2>

          <p>
            Choose which TaskFlow alerts you want to receive.
          </p>
        </div>

        <div className="section-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="section-divider" />

      <div className="notification-list">
        <div className="notification-option">
          <div className="option-icon purple">
            <FaEnvelope />
          </div>

          <div className="option-content">
            <strong>Email notifications</strong>

            <span>
              Receive important workspace updates by email.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.emailNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange(
                "emailNotifications"
              )
            }
          >
            <span />
          </button>
        </div>

        <div className="notification-option">
          <div className="option-icon blue">
            <FaCheckCircle />
          </div>

          <div className="option-content">
            <strong>Task notifications</strong>

            <span>
              Get notified when tasks are created or updated.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.taskNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange(
                "taskNotifications"
              )
            }
          >
            <span />
          </button>
        </div>

        <div className="notification-option">
          <div className="option-icon green">
            <FaBriefcase />
          </div>

          <div className="option-content">
            <strong>Project notifications</strong>

            <span>
              Receive updates about your projects and teams.
            </span>
          </div>

          <button
            type="button"
            className={`toggle-switch ${
              settings.projectNotifications ? "active" : ""
            }`}
            onClick={() =>
              handleSettingChange(
                "projectNotifications"
              )
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
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected.
          </p>
        </div>

        <div className="section-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="section-divider" />

      <form
        className="password-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="form-field">
          <label htmlFor="currentPassword">
            Current password
          </label>

          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordFields.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
          />
        </div>

        <div className="form-field">
          <label htmlFor="newPassword">
            New password
          </label>

          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordFields.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">
            Confirm new password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordFields.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
          />
        </div>

        {passwordMessage.text && (
          <div
            className={`password-message ${
              passwordMessage.type
            }`}
          >
            {passwordMessage.text}
          </div>
        )}

        <button
          type="submit"
          className="primary-settings-button"
        >
          <FaLock />
          Update password
        </button>
      </form>
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
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            APPLICATION
          </span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace.
          </p>
        </div>

        <div className="section-heading-icon">
          <FaCog />
        </div>
      </div>

      <div className="section-divider" />

      <div className="application-grid">
        <div className="application-card">
          <span>APPLICATION</span>
          <strong>TaskFlow</strong>
        </div>

        <div className="application-card">
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="application-card">
          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div className="application-card">
          <span>STATUS</span>

          <strong className="status-active">
            <span className="status-dot" />
            Operational
          </strong>
        </div>
      </div>

      <div className="application-security">
        <FaShieldAlt />

        <div>
          <strong>TaskFlow workspace protected</strong>

          <span>
            Your workspace preferences and account information
            are securely managed.
          </span>
        </div>
      </div>
    </motion.div>
  );


  /* =========================================================
     ACTIVE SECTION
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
     MAIN RETURN
  ========================================================= */

  return (
    <div className="settings-page">

      {/* =====================================================
          EXISTING APPLICATION NAVIGATION
          DO NOT REMOVE THESE
      ===================================================== */}

      <Sidebar />
      <Navbar />


      {/* =====================================================
          SETTINGS BACKGROUND
      ===================================================== */}

      <div
        className="settings-background"
        aria-hidden="true"
      >
        <div className="settings-bg-grid" />

        <div className="settings-bg-orb settings-orb-one" />
        <div className="settings-bg-orb settings-orb-two" />
        <div className="settings-bg-orb settings-orb-three" />

        <div className="settings-bg-ring settings-ring-one" />
        <div className="settings-bg-ring settings-ring-two" />

        <div className="settings-bg-glow settings-glow-one" />
        <div className="settings-bg-glow settings-glow-two" />

        <div className="settings-bg-particles">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>


      {/* =====================================================
          MAIN SETTINGS WORKSPACE
      ===================================================== */}

      <main className="settings-main">

        <motion.div
          className="settings-container"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >

          {/* PAGE HEADER */}

          <header className="settings-page-header">
            <div className="settings-breadcrumb">
              WORKSPACE
              <FaChevronRight />
              SETTINGS
            </div>

            <h1>Settings</h1>

            <p>
              Manage your account, workspace preferences and
              security.
            </p>
          </header>


          {/* SETTINGS PANEL */}

          <section className="settings-panel">

            {/* LEFT SETTINGS NAV */}

            <aside className="settings-navigation">

              <div className="settings-navigation-title">
                SETTINGS
              </div>

              <div className="settings-navigation-list">
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
                      <span className="settings-nav-icon">
                        <Icon />
                      </span>

                      <span className="settings-nav-copy">
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


              {/* PROTECTED WORKSPACE */}

              <div className="navigation-protected">
                <div className="navigation-protected-icon">
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


            {/* RIGHT CONTENT */}

            <div className="settings-content">
              {renderActiveSection()}
            </div>

          </section>


          {/* FOOTER SECURITY BAR */}

          <footer className="settings-footer">

            <div className="footer-icon">
              <FaShieldAlt />
            </div>

            <div className="footer-copy">
              <strong>
                Your preferences are stored securely
              </strong>

              <span>
                TaskFlow keeps your workspace settings
                organized and protected.
              </span>
            </div>

            <div className="footer-status">
              <FaCheckCircle />
              Secure
            </div>

          </footer>

        </motion.div>
      </main>


      {/* =====================================================
          LOGOUT DECORATIVE ACCESSIBILITY ELEMENT
      ===================================================== */}

      <div className="settings-page-security-mark">
        <FaSignOutAlt />
      </div>

    </div>
  );
}