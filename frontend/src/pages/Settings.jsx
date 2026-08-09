import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaEnvelope,
  FaCheckCircle,
  FaDesktop,
  FaMoon,
  FaSun,
  FaCog,
  FaChevronRight,
  FaCircle,
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

function getInitials(name = "TaskFlow User") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function SettingNavigation({ activeTab, setActiveTab }) {
  return (
    <aside className="settings-navigation">
      <div className="settings-navigation-title">
        <span>SETTINGS</span>
      </div>

      <div className="settings-navigation-list">
        {SETTINGS_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`settings-navigation-item ${
                active ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="settings-navigation-icon">
                <Icon />
              </span>

              <span className="settings-navigation-content">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>

              <FaChevronRight className="settings-navigation-arrow" />
            </button>
          );
        })}
      </div>

      <div className="settings-navigation-security">
        <div className="security-mini-icon">
          <FaShieldAlt />
        </div>

        <div className="security-mini-content">
          <strong>Protected workspace</strong>
          <span>Your TaskFlow account is secure.</span>
        </div>

        <span className="security-status-dot" />
      </div>
    </aside>
  );
}

function AccountSection({ user }) {
  const name =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Souradipta Patra";

  const email =
    user?.email ||
    user?.emailAddress ||
    "soura@gmail.com";

  const role = user?.role || "Admin";
  const initials = getInitials(name);

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="section-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            View the information associated with your TaskFlow account.
          </p>
        </div>

        <div className="section-header-icon">
          <FaUser />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="account-profile-card">
        <div className="account-avatar">{initials}</div>

        <div className="account-profile-details">
          <strong>{name}</strong>
          <span>{email}</span>
        </div>

        <span className="account-role-badge">
          {role}
        </span>
      </div>

      <div className="account-details-grid">
        <div className="account-detail-card">
          <span className="detail-label">FULL NAME</span>
          <strong>{name}</strong>
        </div>

        <div className="account-detail-card">
          <span className="detail-label">EMAIL ADDRESS</span>
          <strong>{email}</strong>
        </div>

        <div className="account-detail-card">
          <span className="detail-label">ROLE</span>
          <strong>{role}</strong>
        </div>

        <div className="account-detail-card">
          <span className="detail-label">ACCOUNT STATUS</span>

          <strong className="status-active">
            <FaCircle />
            Active
          </strong>
        </div>
      </div>

      <div className="protected-card">
        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <span>
            Your account information is securely associated with
            your TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="protected-check" />
      </div>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState("system");

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="section-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>
            Customize how your TaskFlow workspace looks.
          </p>
        </div>

        <div className="section-header-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="appearance-options">
        <button
          type="button"
          className={`appearance-option ${
            theme === "light" ? "selected" : ""
          }`}
          onClick={() => setTheme("light")}
        >
          <div className="appearance-option-icon light">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Use a bright workspace interface.</span>
          </div>

          <span className="appearance-radio">
            {theme === "light" && <span />}
          </span>
        </button>

        <button
          type="button"
          className={`appearance-option ${
            theme === "dark" ? "selected" : ""
          }`}
          onClick={() => setTheme("dark")}
        >
          <div className="appearance-option-icon dark">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Use a darker workspace interface.</span>
          </div>

          <span className="appearance-radio">
            {theme === "dark" && <span />}
          </span>
        </button>

        <button
          type="button"
          className={`appearance-option ${
            theme === "system" ? "selected" : ""
          }`}
          onClick={() => setTheme("system")}
        >
          <div className="appearance-option-icon system">
            <FaDesktop />
          </div>

          <div>
            <strong>System default</strong>
            <span>Follow your device appearance.</span>
          </div>

          <span className="appearance-radio">
            {theme === "system" && <span />}
          </span>
        </button>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    assignments: true,
    taskUpdates: true,
    projectUpdates: true,
    email: true,
    desktop: false,
  });

  const toggleNotification = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
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
      icon: FaCog,
      color: "blue",
    },
    {
      key: "projectUpdates",
      title: "Project updates",
      description: "Notify me about important project activity.",
      icon: FaPalette,
      color: "violet",
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
    <div className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="section-eyebrow">NOTIFICATIONS</span>

          <h2>Notification preferences</h2>

          <p>
            Decide which events should notify you.
          </p>
        </div>

        <div className="section-header-icon">
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

              <div className="notification-content">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  enabled ? "on" : ""
                }`}
                onClick={() => toggleNotification(item.key)}
                aria-label={`Toggle ${item.title}`}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="section-eyebrow">SECURITY</span>

          <h2>Security & protection</h2>

          <p>
            Manage account security and workspace protection.
          </p>
        </div>

        <div className="section-header-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="security-options">
        <div className="security-option">
          <div className="security-option-icon">
            <FaLock />
          </div>

          <div>
            <strong>Password</strong>
            <span>
              Keep your password secure and up to date.
            </span>
          </div>

          <button type="button">Manage</button>
        </div>

        <div className="security-option">
          <div className="security-option-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Workspace protection</strong>
            <span>
              Your TaskFlow workspace is protected.
            </span>
          </div>

          <span className="secure-badge">
            <FaCheckCircle />
            Secure
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationSection() {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div>
          <span className="section-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow workspace.
          </p>
        </div>

        <div className="section-header-icon">
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
          <strong>Web Application</strong>
        </div>

        <div className="application-card">
          <span>STATUS</span>
          <strong className="status-active">
            <FaCircle />
            Operational
          </strong>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("account");

  const activeItem = useMemo(
    () =>
      SETTINGS_ITEMS.find((item) => item.id === activeTab) ||
      SETTINGS_ITEMS[0],
    [activeTab]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "appearance":
        return <AppearanceSection />;

      case "notifications":
        return <NotificationsSection />;

      case "security":
        return <SecuritySection />;

      case "application":
        return <ApplicationSection />;

      case "account":
      default:
        return <AccountSection user={user} />;
    }
  };

  return (
    <div className="settings-page">
      {/* Premium animated background */}
      <div className="settings-background" aria-hidden="true">
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />

        <div className="settings-ring settings-ring-one" />
        <div className="settings-ring settings-ring-two" />

        <div className="settings-grid" />
      </div>

      {/* EXISTING TASKFLOW SHELL */}
      <Sidebar />

      <div className="settings-main-shell">
        <Navbar />

        <main className="settings-main">
          <div className="settings-container">
            <header className="settings-page-header">
              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>
                <span className="breadcrumb-separator">›</span>
                <span>SETTINGS</span>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and security.
              </p>
            </header>

            <section className="settings-card">
              <SettingNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <div className="settings-content">
                <div className="settings-content-mobile-heading">
                  <span>{activeItem.label}</span>
                </div>

                {renderContent()}
              </div>
            </section>

            <footer className="settings-footer">
              <div className="settings-footer-icon">
                <FaShieldAlt />
              </div>

              <div className="settings-footer-content">
                <strong>Your preferences are stored securely</strong>

                <span>
                  TaskFlow keeps your workspace settings organized
                  and protected.
                </span>
              </div>

              <div className="settings-footer-status">
                <FaCheckCircle />
                <span>Secure</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}