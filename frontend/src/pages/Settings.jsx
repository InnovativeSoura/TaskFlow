import { useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaChevronRight,
  FaShieldAlt,
  FaCheckCircle,
  FaEnvelope,
  FaUserShield,
  FaDesktop,
  FaMoon,
  FaSun,
  FaGlobe,
  FaKey,
  FaDatabase,
  FaCode,
  FaCloud,
  FaMobileAlt,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

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

function getUserData() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("taskflow_user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.warn("Unable to read stored user data:", error);
  }

  return {};
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "SP";
  }

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AccountContent({ user }) {
  const fullName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra";

  const email =
    user?.email ||
    user?.emailAddress ||
    "soura@gmail.com";

  const role = user?.role || "Admin";

  const initials = getInitials(fullName);

  return (
    <div className="settings-content">
      <div className="settings-section-heading">
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

      <div className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-large-avatar">
            {initials}
          </div>

          <div className="settings-profile-details">
            <strong>{fullName}</strong>
            <span>{email}</span>
          </div>
        </div>

        <span className="settings-admin-badge">
          {String(role).toUpperCase()}
        </span>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaUser />
          </div>

          <div>
            <span className="settings-info-label">FULL NAME</span>
            <strong>{fullName}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span className="settings-info-label">EMAIL ADDRESS</span>
            <strong>{email}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon slate">
            <FaUserShield />
          </div>

          <div>
            <span className="settings-info-label">ROLE</span>
            <strong>{role}</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span className="settings-info-label">
              ACCOUNT STATUS
            </span>

            <strong className="settings-active-status">
              <span />
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="settings-protected-card">
        <div className="settings-protected-icon">
          <FaShieldAlt />
        </div>

        <div className="settings-protected-text">
          <strong>Protected workspace</strong>

          <span>
            Your account information is securely associated with
            your TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="settings-success-icon" />
      </div>
    </div>
  );
}

function AppearanceContent() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="settings-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize the visual appearance of your TaskFlow workspace.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-option-grid">
        <button
          type="button"
          className={`settings-choice-card ${
            theme === "light" ? "selected" : ""
          }`}
          onClick={() => setTheme("light")}
        >
          <div className="settings-choice-icon purple">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Bright and clean workspace</span>
          </div>

          {theme === "light" && (
            <FaCheckCircle className="choice-check" />
          )}
        </button>

        <button
          type="button"
          className={`settings-choice-card ${
            theme === "dark" ? "selected" : ""
          }`}
          onClick={() => setTheme("dark")}
        >
          <div className="settings-choice-icon blue">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Comfortable darker interface</span>
          </div>

          {theme === "dark" && (
            <FaCheckCircle className="choice-check" />
          )}
        </button>
      </div>

      <div className="settings-protected-card">
        <div className="settings-protected-icon">
          <FaDesktop />
        </div>

        <div className="settings-protected-text">
          <strong>Workspace preferences</strong>
          <span>
            Your appearance preferences are saved for this workspace.
          </span>
        </div>
      </div>
    </div>
  );
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState({
    assignments: true,
    taskUpdates: true,
    projectUpdates: true,
    email: true,
    desktop: false,
  });

  const toggleNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const items = [
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
      icon: FaBell,
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

  return (
    <div className="settings-content">
      <div className="settings-section-heading">
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
        {items.map((item) => {
          const Icon = item.icon;
          const enabled = notifications[item.key];

          return (
            <div
              className={`notification-row ${
                enabled ? "enabled" : ""
              }`}
              key={item.key}
            >
              <div className={`notification-icon ${item.color}`}>
                <Icon />
              </div>

              <div className="notification-text">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`notification-toggle ${
                  enabled ? "active" : ""
                }`}
                onClick={() => toggleNotification(item.key)}
                aria-label={`Toggle ${item.title}`}
              >
                {enabled ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecurityContent() {
  return (
    <div className="settings-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Manage your password and protect your TaskFlow account.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="security-card-list">
        <div className="security-card">
          <div className="security-card-icon purple">
            <FaKey />
          </div>

          <div className="security-card-content">
            <strong>Password</strong>
            <span>
              Keep your account protected with a strong password.
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

          <div className="security-card-content">
            <strong>Account protection</strong>
            <span>
              Your TaskFlow workspace is currently protected.
            </span>
          </div>

          <span className="security-status">
            <FaCheckCircle />
            Secure
          </span>
        </div>

        <div className="security-card">
          <div className="security-card-icon blue">
            <FaMobileAlt />
          </div>

          <div className="security-card-content">
            <strong>Active sessions</strong>
            <span>
              Review devices currently connected to your account.
            </span>
          </div>

          <button type="button" className="settings-action-button">
            Review
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationContent() {
  return (
    <div className="settings-content">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow application environment.
          </p>
        </div>

        <div className="settings-heading-icon">
          <FaInfoCircle />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <div className="settings-info-icon purple">
            <FaCode />
          </div>

          <div>
            <span className="settings-info-label">
              APPLICATION
            </span>
            <strong>TaskFlow</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon blue">
            <FaCloud />
          </div>

          <div>
            <span className="settings-info-label">
              ENVIRONMENT
            </span>
            <strong>Production</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon green">
            <FaDatabase />
          </div>

          <div>
            <span className="settings-info-label">
              DATA STORAGE
            </span>
            <strong>Cloud Database</strong>
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon slate">
            <FaGlobe />
          </div>

          <div>
            <span className="settings-info-label">
              STATUS
            </span>
            <strong className="settings-active-status">
              <span />
              Operational
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("account");

  const user = useMemo(() => getUserData(), []);

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearanceContent />;

      case "notifications":
        return <NotificationsContent />;

      case "security":
        return <SecurityContent />;

      case "application":
        return <ApplicationContent />;

      case "account":
      default:
        return <AccountContent user={user} />;
    }
  };

  const activeItem =
    SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
    SETTINGS_ITEMS[0];

  return (
    <main className="settings-page">
      {/* Animated decorative background */}
      <div className="settings-background" aria-hidden="true">
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />

        <div className="settings-ring settings-ring-one" />
        <div className="settings-ring settings-ring-two" />
        <div className="settings-ring settings-ring-three" />

        <div className="settings-grid-pattern" />
      </div>

      <div className="settings-page-inner">
        {/* Page heading */}
        <header className="settings-page-header">
          <div className="settings-breadcrumb">
            <span>WORKSPACE</span>
            <FaChevronRight />
            <span>SETTINGS</span>
          </div>

          <h1>Settings</h1>

          <p>
            Manage your account, workspace preferences and security.
          </p>
        </header>

        {/* Main settings panel */}
        <section className="settings-main-card">
          {/* Left settings navigation */}
          <aside className="settings-navigation">
            <div className="settings-navigation-title">
              SETTINGS
            </div>

            <div className="settings-navigation-list">
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeSection;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`settings-navigation-item ${
                      active ? "active" : ""
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

            <div className="settings-navigation-security">
              <div className="settings-navigation-security-icon">
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

          {/* Right content */}
          <section className="settings-panel-content">
            <div className="settings-mobile-current">
              <span>Current section</span>
              <strong>{activeItem.label}</strong>
            </div>

            {renderContent()}
          </section>
        </section>

        {/* Footer security banner */}
        <footer className="settings-footer-card">
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
            <span>Secure</span>
          </div>
        </footer>
      </div>
    </main>
  );
}