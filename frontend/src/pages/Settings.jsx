import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaDesktop,
  FaCheckCircle,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaGlobe,
  FaDesktop as FaMonitor,
  FaCog,
  FaKey,
  FaCheck,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

const settingsItems = [
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

const notificationDefaults = {
  taskAssignments: true,
  taskUpdates: true,
  projectUpdates: true,
  emailNotifications: true,
  desktopNotifications: false,
};

function getInitials(name = "") {
  const cleanName = name.trim();

  if (!cleanName) return "SP";

  const parts = cleanName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "is-active" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span className="settings-toggle-thumb">
        {checked && <FaCheck />}
      </span>
    </button>
  );
}

function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [theme, setTheme] = useState("system");

  const [notifications, setNotifications] = useState(
    notificationDefaults
  );

  const userName = useMemo(() => {
    return (
      user?.name ||
      user?.username ||
      user?.fullName ||
      "Souradipta Patra"
    );
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email || "soura@gmail.com";
  }, [user]);

  const userRole = useMemo(() => {
    return user?.role || "Admin";
  }, [user]);

  const initials = useMemo(() => getInitials(userName), [userName]);

  const updateNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const renderAccount = () => (
    <motion.div
      key="account"
      className="settings-content-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            View the information associated with your TaskFlow account.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-large-avatar">{initials}</div>

          <div className="settings-profile-details">
            <h3>{userName}</h3>
            <p>{userEmail}</p>
          </div>
        </div>

        <span className="settings-role-badge">
          {String(userRole).toUpperCase()}
        </span>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <span className="settings-info-label">FULL NAME</span>
          <strong>{userName}</strong>
        </div>

        <div className="settings-info-card">
          <span className="settings-info-label">EMAIL ADDRESS</span>
          <strong>{userEmail}</strong>
        </div>

        <div className="settings-info-card">
          <span className="settings-info-label">ROLE</span>
          <strong>{userRole}</strong>
        </div>

        <div className="settings-info-card">
          <span className="settings-info-label">
            ACCOUNT STATUS
          </span>

          <strong className="settings-status-active">
            <span className="settings-status-dot" />
            Active
          </strong>
        </div>
      </div>

      <div className="settings-protected-card">
        <div className="settings-protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <p>
            Your account information is securely associated with your
            TaskFlow workspace.
          </p>
        </div>

        <FaCheckCircle className="settings-protected-check" />
      </div>
    </motion.div>
  );

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      className="settings-content-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Personalize how TaskFlow looks across your workspace.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-preference-list">
        <div className="settings-preference-title">
          <div className="settings-preference-icon purple">
            <FaPalette />
          </div>

          <div>
            <h3>Theme preference</h3>
            <p>Choose how TaskFlow should appear.</p>
          </div>
        </div>

        <div className="settings-theme-options">
          <button
            type="button"
            className={`settings-theme-option ${
              theme === "light" ? "selected" : ""
            }`}
            onClick={() => setTheme("light")}
          >
            <FaSun />
            <span>Light</span>
            {theme === "light" && <FaCheck />}
          </button>

          <button
            type="button"
            className={`settings-theme-option ${
              theme === "dark" ? "selected" : ""
            }`}
            onClick={() => setTheme("dark")}
          >
            <FaMoon />
            <span>Dark</span>
            {theme === "dark" && <FaCheck />}
          </button>

          <button
            type="button"
            className={`settings-theme-option ${
              theme === "system" ? "selected" : ""
            }`}
            onClick={() => setTheme("system")}
          >
            <FaDesktop />
            <span>System</span>
            {theme === "system" && <FaCheck />}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      className="settings-content-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">NOTIFICATIONS</span>

          <h2>Notification preferences</h2>

          <p>
            Decide which events should notify you.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-notification-list">
        <NotificationRow
          icon={FaUser}
          iconClass="purple"
          title="Task assignments"
          description="Notify me when a task is assigned to me."
          checked={notifications.taskAssignments}
          onChange={() => updateNotification("taskAssignments")}
        />

        <NotificationRow
          icon={FaTasks}
          iconClass="blue"
          title="Task updates"
          description="Notify me when tasks assigned to me are updated."
          checked={notifications.taskUpdates}
          onChange={() => updateNotification("taskUpdates")}
        />

        <NotificationRow
          icon={FaProjectDiagram}
          iconClass="violet"
          title="Project updates"
          description="Notify me about important project activity."
          checked={notifications.projectUpdates}
          onChange={() => updateNotification("projectUpdates")}
        />

        <NotificationRow
          icon={FaEnvelope}
          iconClass="green"
          title="Email notifications"
          description="Receive important TaskFlow updates by email."
          checked={notifications.emailNotifications}
          onChange={() => updateNotification("emailNotifications")}
        />

        <NotificationRow
          icon={FaMonitor}
          iconClass="orange"
          title="Desktop notifications"
          description="Show notifications directly on your device."
          checked={notifications.desktopNotifications}
          onChange={() => updateNotification("desktopNotifications")}
        />
      </div>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      key="security"
      className="settings-content-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Manage your account security and authentication settings.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-security-card">
        <div className="settings-security-icon">
          <FaKey />
        </div>

        <div className="settings-security-content">
          <h3>Password</h3>

          <p>
            Your password is securely encrypted and protected.
          </p>

          <span className="settings-security-status">
            <FaCheckCircle />
            Password protected
          </span>
        </div>

        <button type="button" className="settings-secondary-button">
          Change password
          <FaChevronRight />
        </button>
      </div>

      <div className="settings-security-card">
        <div className="settings-security-icon blue">
          <FaShieldAlt />
        </div>

        <div className="settings-security-content">
          <h3>Workspace protection</h3>

          <p>
            Your TaskFlow workspace is protected with secure account
            authentication.
          </p>

          <span className="settings-security-status">
            <FaCheckCircle />
            Protected
          </span>
        </div>
      </div>
    </motion.div>
  );

  const renderApplication = () => (
    <motion.div
      key="application"
      className="settings-content-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="settings-content-header">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace and application.
          </p>
        </div>

        <div className="settings-header-icon">
          <FaCog />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-application-grid">
        <div className="settings-info-card large">
          <span className="settings-info-label">APPLICATION</span>
          <strong>TaskFlow</strong>
          <p>Project management workspace</p>
        </div>

        <div className="settings-info-card large">
          <span className="settings-info-label">VERSION</span>
          <strong>1.0.0</strong>
          <p>Current production release</p>
        </div>

        <div className="settings-info-card large">
          <span className="settings-info-label">WORKSPACE</span>
          <strong>TaskFlow Workspace</strong>
          <p>Your collaborative project environment</p>
        </div>

        <div className="settings-info-card large">
          <span className="settings-info-label">STATUS</span>

          <strong className="settings-status-active">
            <span className="settings-status-dot" />
            Operational
          </strong>

          <p>All core services are available</p>
        </div>
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
    <div className="settings-page">
      {/* Animated background */}
      <div className="settings-background">
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />
        <div className="settings-orb settings-orb-four" />

        <div className="settings-grid-glow" />

        <div className="settings-wave settings-wave-one" />
        <div className="settings-wave settings-wave-two" />
      </div>

      <Sidebar />

      <div className="settings-app">
        <Navbar />

        <main className="settings-main">
          <motion.div
            className="settings-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>
                <FaChevronRight />
                <span>SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and security.
              </p>
            </div>
          </motion.div>

          <motion.section
            className="settings-shell"
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: "easeOut",
            }}
          >
            <aside className="settings-sidebar">
              <div className="settings-sidebar-title">
                SETTINGS
              </div>

              <nav className="settings-nav">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`settings-nav-item ${
                        active ? "active" : ""
                      }`}
                      onClick={() => setActiveSection(item.id)}
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
              </nav>

              <div className="settings-sidebar-protected">
                <div className="settings-sidebar-protected-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>Protected workspace</strong>
                  <span>Your TaskFlow account is secure.</span>
                </div>

                <span className="settings-secure-dot" />
              </div>
            </aside>

            <div className="settings-content">
              <AnimatePresence mode="wait">
                {renderActiveSection()}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.footer
            className="settings-footer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <div className="settings-footer-icon">
              <FaShieldAlt />
            </div>

            <div className="settings-footer-copy">
              <strong>Your preferences are stored securely</strong>

              <span>
                TaskFlow keeps your workspace settings organized and
                protected.
              </span>
            </div>

            <div className="settings-footer-status">
              <FaLock />
              <span>Secure</span>
            </div>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}

function NotificationRow({
  icon: Icon,
  iconClass,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="settings-notification-row">
      <div className={`settings-notification-icon ${iconClass}`}>
        <Icon />
      </div>

      <div className="settings-notification-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default Settings;