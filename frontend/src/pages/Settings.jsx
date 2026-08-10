import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCheckCircle,
  FaChevronRight,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

const Settings = () => {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    emailNotifications: true,
    desktopNotifications: false,
  });

  const settingsItems = useMemo(
    () => [
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
    ],
    []
  );

  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra";

  const userEmail = user?.email || "soura@gmail.com";
  const userRole = user?.role || "Admin";

  const getInitials = (name) => {
    if (!name) return "SP";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const initials = getInitials(userName);

  const toggleNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const renderAccount = () => (
    <motion.div
      key="account"
      className="settings-panel-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            View the information associated with your TaskFlow account.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="account-profile-card">
        <div className="account-avatar">{initials}</div>

        <div className="account-profile-details">
          <strong>{userName}</strong>
          <span>{userEmail}</span>
        </div>

        <span className="account-role-badge">
          {String(userRole).toUpperCase()}
        </span>
      </div>

      <div className="account-info-grid">
        <div className="account-info-card">
          <span>FULL NAME</span>
          <strong>{userName}</strong>
        </div>

        <div className="account-info-card">
          <span>EMAIL ADDRESS</span>
          <strong>{userEmail}</strong>
        </div>

        <div className="account-info-card">
          <span>ROLE</span>
          <strong>{userRole}</strong>
        </div>

        <div className="account-info-card">
          <span>ACCOUNT STATUS</span>

          <strong className="account-status">
            <span className="status-dot" />
            Active
          </strong>
        </div>
      </div>

      <div className="protected-workspace-card">
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
      className="settings-panel-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how your TaskFlow workspace looks and feels.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="appearance-card">
        <div className="appearance-preview light-preview">
          <div className="preview-top" />
          <div className="preview-body">
            <div className="preview-sidebar" />
            <div className="preview-content">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>

        <div className="appearance-info">
          <span className="appearance-label">CURRENT THEME</span>
          <h3>Light workspace</h3>
          <p>
            Clean, bright and optimized for focused productivity.
          </p>

          <div className="active-theme">
            <FaCheckCircle />
            Active
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => {
    const notificationItems = [
      {
        key: "taskAssignments",
        title: "Task assignments",
        description: "Notify me when a task is assigned to me.",
        color: "purple",
      },
      {
        key: "taskUpdates",
        title: "Task updates",
        description: "Notify me when tasks assigned to me are updated.",
        color: "blue",
      },
      {
        key: "projectUpdates",
        title: "Project updates",
        description: "Notify me about important project activity.",
        color: "purple",
      },
      {
        key: "emailNotifications",
        title: "Email notifications",
        description: "Receive important TaskFlow updates by email.",
        color: "green",
      },
      {
        key: "desktopNotifications",
        title: "Desktop notifications",
        description: "Show notifications directly on your device.",
        color: "orange",
      },
    ];

    return (
      <motion.div
        key="notifications"
        className="settings-panel-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="settings-panel-heading">
          <div>
            <span className="settings-eyebrow">NOTIFICATIONS</span>

            <h2>Notification preferences</h2>

            <p>
              Decide which events should notify you.
            </p>
          </div>

          <div className="settings-heading-icon">
            <FaBell />
          </div>
        </div>

        <div className="settings-divider" />

        <div className="notification-list">
          {notificationItems.map((item) => (
            <div
              className={`notification-card ${item.color}`}
              key={item.key}
            >
              <div className="notification-icon">
                <FaBell />
              </div>

              <div className="notification-info">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  notifications[item.key] ? "active" : ""
                }`}
                onClick={() => toggleNotification(item.key)}
                aria-label={`Toggle ${item.title}`}
                aria-pressed={notifications[item.key]}
              >
                <span />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderSecurity = () => (
    <motion.div
      key="security"
      className="settings-panel-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password and security</h2>

          <p>
            Keep your TaskFlow account protected.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="security-card">
        <div className="security-card-icon">
          <FaLock />
        </div>

        <div>
          <h3>Password protection</h3>

          <p>
            Your account is protected using secure authentication.
          </p>
        </div>

        <span className="security-status">
          <FaCheckCircle />
          Secure
        </span>
      </div>

      <div className="security-card">
        <div className="security-card-icon">
          <FaShieldAlt />
        </div>

        <div>
          <h3>Workspace protection</h3>

          <p>
            Your TaskFlow workspace and account information remain protected.
          </p>
        </div>

        <span className="security-status">
          <FaCheckCircle />
          Active
        </span>
      </div>
    </motion.div>
  );

  const renderApplication = () => (
    <motion.div
      key="application"
      className="settings-panel-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaInfoCircle />
        </div>
      </div>

      <div className="settings-divider" />

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
          <strong>MERN Stack</strong>
        </div>

        <div className="application-card">
          <span>STATUS</span>
          <strong className="application-active">
            <span />
            Operational
          </strong>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
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
      {/* EXISTING TASKFLOW SIDEBAR — DO NOT REMOVE */}
      <Sidebar />

      <div className="settings-main">
        {/* EXISTING TASKFLOW NAVBAR — DO NOT REMOVE */}
        <Navbar />

        <main className="settings-content">
          <div className="settings-background-orb orb-one" />
          <div className="settings-background-orb orb-two" />
          <div className="settings-background-orb orb-three" />

          <div className="settings-background-ring ring-one" />
          <div className="settings-background-ring ring-two" />

          <div className="settings-container">
            <motion.div
              className="settings-page-header"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="settings-breadcrumb">
                WORKSPACE <b>›</b> SETTINGS
              </span>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and security.
              </p>
            </motion.div>

            <motion.section
              className="settings-shell"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <aside className="settings-navigation">
                <span className="settings-navigation-title">
                  SETTINGS
                </span>

                <div className="settings-navigation-list">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`settings-navigation-item ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <div className="settings-navigation-icon">
                          <Icon />
                        </div>

                        <div className="settings-navigation-text">
                          <strong>{item.label}</strong>
                          <span>{item.description}</span>
                        </div>

                        <FaChevronRight className="settings-navigation-arrow" />
                      </button>
                    );
                  })}
                </div>

                <div className="navigation-protected-card">
                  <div className="navigation-protected-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Protected workspace</strong>
                    <span>Your TaskFlow account is secure.</span>
                  </div>

                  <FaCheckCircle />
                </div>
              </aside>

              <section className="settings-panel">
                {renderContent()}
              </section>
            </motion.section>

            <motion.footer
              className="settings-footer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="settings-footer-icon">
                <FaShieldAlt />
              </div>

              <div className="settings-footer-text">
                <strong>Your preferences are stored securely</strong>

                <span>
                  TaskFlow keeps your workspace settings organized and
                  protected.
                </span>
              </div>

              <div className="settings-footer-status">
                <FaCheckCircle />
                Secure
              </div>
            </motion.footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;