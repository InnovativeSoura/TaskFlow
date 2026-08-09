import React, { useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaEnvelope,
  FaCheckCircle,
  FaChevronRight,
  FaDesktop,
  FaMoon,
  FaSun,
  FaGlobe,
  FaCog,
  FaUserShield,
  FaLayerGroup,
  FaBolt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

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

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "TF";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

function AccountPanel({ user }) {
  const name =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra";

  const email = user?.email || "soura@gmail.com";
  const role = user?.role || "Admin";
  const initials = getInitials(name);

  return (
    <div className="settings-panel-content">
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

      <div className="account-profile-card">
        <div className="account-profile-left">
          <div className="account-large-avatar">{initials}</div>

          <div className="account-profile-details">
            <h3>{name}</h3>
            <span>{email}</span>
          </div>
        </div>

        <span className="account-role-badge">
          {String(role).toUpperCase()}
        </span>
      </div>

      <div className="account-information-grid">
        <div className="account-info-card">
          <div className="account-info-icon">
            <FaUser />
          </div>

          <div>
            <span className="account-info-label">FULL NAME</span>
            <strong>{name}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon email">
            <FaEnvelope />
          </div>

          <div>
            <span className="account-info-label">EMAIL ADDRESS</span>
            <strong>{email}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon security">
            <FaUserShield />
          </div>

          <div>
            <span className="account-info-label">ROLE</span>
            <strong>{role}</strong>
          </div>
        </div>

        <div className="account-info-card">
          <div className="account-info-icon active">
            <FaCheckCircle />
          </div>

          <div>
            <span className="account-info-label">ACCOUNT STATUS</span>

            <strong className="status-active">
              <span className="status-dot"></span>
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="protected-workspace-card">
        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div className="protected-content">
          <strong>Protected workspace</strong>

          <span>
            Your account information is securely associated with your
            TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="protected-check" />
      </div>
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState("system");

  return (
    <div className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how TaskFlow looks and feels across your workspace.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="appearance-options">
        <button
          type="button"
          className={`appearance-option ${
            theme === "light" ? "selected" : ""
          }`}
          onClick={() => setTheme("light")}
        >
          <div className="appearance-icon light">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Bright and clean workspace</span>
          </div>

          {theme === "light" && <FaCheckCircle />}
        </button>

        <button
          type="button"
          className={`appearance-option ${
            theme === "dark" ? "selected" : ""
          }`}
          onClick={() => setTheme("dark")}
        >
          <div className="appearance-icon dark">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Comfortable for low-light environments</span>
          </div>

          {theme === "dark" && <FaCheckCircle />}
        </button>

        <button
          type="button"
          className={`appearance-option ${
            theme === "system" ? "selected" : ""
          }`}
          onClick={() => setTheme("system")}
        >
          <div className="appearance-icon system">
            <FaDesktop />
          </div>

          <div>
            <strong>System default</strong>
            <span>Follow your device preference</span>
          </div>

          {theme === "system" && <FaCheckCircle />}
        </button>
      </div>

      <div className="settings-information-banner">
        <div className="banner-icon">
          <FaPalette />
        </div>

        <div>
          <strong>Personalized workspace</strong>
          <span>
            Your appearance preferences are saved for your TaskFlow
            workspace.
          </span>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const [notifications, setNotifications] = useState({
    assignments: true,
    taskUpdates: true,
    projectUpdates: true,
    email: true,
    desktop: false,
  });

  const notificationItems = [
    {
      key: "assignments",
      title: "Task assignments",
      description: "Notify me when a task is assigned to me.",
      icon: FaUser,
      color: "purple",
    },
    {
      key: "taskUpdates",
      title: "Task updates",
      description: "Notify me when tasks assigned to me are updated.",
      icon: FaBolt,
      color: "blue",
    },
    {
      key: "projectUpdates",
      title: "Project updates",
      description: "Notify me about important project activity.",
      icon: FaGlobe,
      color: "purple",
    },
    {
      key: "email",
      title: "Email notifications",
      description: "Receive important TaskFlow updates by email.",
      icon: FaEnvelope,
      color: "green",
    },
    {
      key: "desktop",
      title: "Desktop notifications",
      description: "Show notifications directly on your device.",
      icon: FaDesktop,
      color: "orange",
    },
  ];

  const toggleNotification = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">NOTIFICATIONS</span>

          <h2>Notification preferences</h2>

          <p>Decide which events should notify you.</p>
        </div>

        <div className="settings-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="notification-list">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          const enabled = notifications[item.key];

          return (
            <div className="notification-row" key={item.key}>
              <div className={`notification-icon ${item.color}`}>
                <Icon />
              </div>

              <div className="notification-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`notification-toggle ${
                  enabled ? "enabled" : ""
                }`}
                onClick={() => toggleNotification(item.key)}
                aria-label={`Toggle ${item.title}`}
              >
                <span></span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password and security</h2>

          <p>Manage your account security and protection preferences.</p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="security-list">
        <div className="security-card">
          <div className="security-card-icon">
            <FaLock />
          </div>

          <div className="security-card-copy">
            <strong>Password</strong>
            <span>
              Your password is securely protected using encrypted
              authentication.
            </span>
          </div>

          <button type="button" className="settings-action-button">
            Manage
          </button>
        </div>

        <div className="security-card">
          <div className="security-card-icon green">
            <FaShieldAlt />
          </div>

          <div className="security-card-copy">
            <strong>Account protection</strong>
            <span>
              Your TaskFlow account is currently protected and active.
            </span>
          </div>

          <span className="security-status">
            <FaCheckCircle />
            Secure
          </span>
        </div>

        <div className="security-card">
          <div className="security-card-icon blue">
            <FaUserShield />
          </div>

          <div className="security-card-copy">
            <strong>Authentication</strong>
            <span>
              Standard TaskFlow authentication is enabled for this
              workspace.
            </span>
          </div>

          <span className="security-status">
            <FaCheckCircle />
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationPanel() {
  return (
    <div className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>Information about your TaskFlow workspace application.</p>
        </div>

        <div className="settings-heading-icon">
          <FaCog />
        </div>
      </div>

      <div className="application-grid">
        <div className="application-card">
          <div className="application-icon">
            <FaLayerGroup />
          </div>

          <span>APPLICATION</span>
          <strong>TaskFlow</strong>
        </div>

        <div className="application-card">
          <div className="application-icon blue">
            <FaBolt />
          </div>

          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="application-card">
          <div className="application-icon green">
            <FaCheckCircle />
          </div>

          <span>STATUS</span>

          <strong className="status-active">
            <span className="status-dot"></span>
            Operational
          </strong>
        </div>

        <div className="application-card">
          <div className="application-icon orange">
            <FaGlobe />
          </div>

          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>
      </div>

      <div className="settings-information-banner">
        <div className="banner-icon">
          <FaInfoCircle />
        </div>

        <div>
          <strong>TaskFlow workspace</strong>
          <span>
            A centralized workspace for managing projects, tasks and
            collaboration.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const activeItem = useMemo(
    () =>
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0],
    [activeSection]
  );

  const renderPanel = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearancePanel />;

      case "notifications":
        return <NotificationsPanel />;

      case "security":
        return <SecurityPanel />;

      case "application":
        return <ApplicationPanel />;

      case "account":
      default:
        return <AccountPanel user={user} />;
    }
  };

  return (
    <main className="settings-page">
      <div className="settings-background">
        <div className="settings-orb orb-one"></div>
        <div className="settings-orb orb-two"></div>
        <div className="settings-orb orb-three"></div>

        <div className="settings-ring ring-one"></div>
        <div className="settings-ring ring-two"></div>

        <div className="settings-grid-pattern"></div>

        <div className="settings-glow glow-one"></div>
        <div className="settings-glow glow-two"></div>
      </div>

      <div className="settings-container">
        <header className="settings-page-header">
          <div>
            <div className="settings-breadcrumb">
              <span>WORKSPACE</span>
              <span className="breadcrumb-arrow">›</span>
              <span>SETTINGS</span>
            </div>

            <h1>Settings</h1>

            <p>
              Manage your account, workspace preferences and security.
            </p>
          </div>
        </header>

        <section className="settings-main-card">
          <aside className="settings-sidebar">
            <div className="settings-sidebar-title">SETTINGS</div>

            <nav className="settings-navigation">
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeSection;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`settings-nav-item ${
                      active ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="settings-nav-icon">
                      <Icon />
                    </span>

                    <span className="settings-nav-text">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>

                    <FaChevronRight className="settings-nav-arrow" />
                  </button>
                );
              })}
            </nav>

            <div className="settings-sidebar-security">
              <div className="sidebar-security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>

                <span>Your TaskFlow account is secure.</span>
              </div>

              <FaCheckCircle className="sidebar-security-check" />
            </div>
          </aside>

          <section className="settings-content">
            <div className="settings-mobile-section">
              <span>ACTIVE SECTION</span>
              <strong>{activeItem.label}</strong>
            </div>

            {renderPanel()}
          </section>
        </section>

        <footer className="settings-footer">
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
            <FaCheckCircle />
            <span>Secure</span>
          </div>
        </footer>
      </div>
    </main>
  );
}