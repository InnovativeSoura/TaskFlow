import { useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCheckCircle,
  FaEnvelope,
  FaDesktop,
  FaCog,
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

const NOTIFICATION_ITEMS = [
  {
    id: "taskAssignments",
    title: "Task assignments",
    description: "Notify me when a task is assigned to me.",
    icon: FaUser,
    color: "purple",
  },
  {
    id: "taskUpdates",
    title: "Task updates",
    description: "Notify me when tasks assigned to me are updated.",
    icon: FaCog,
    color: "blue",
  },
  {
    id: "projectUpdates",
    title: "Project updates",
    description: "Notify me about important project activity.",
    icon: FaPalette,
    color: "purple",
  },
  {
    id: "emailNotifications",
    title: "Email notifications",
    description: "Receive important TaskFlow updates by email.",
    icon: FaEnvelope,
    color: "green",
  },
  {
    id: "desktopNotifications",
    title: "Desktop notifications",
    description: "Show notifications directly on your device.",
    icon: FaDesktop,
    color: "orange",
  },
];

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

function getInitials(name) {
  if (!name) return "SP";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function Settings({ user }) {
  const [activeSection, setActiveSection] = useState("account");

  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    emailNotifications: true,
    desktopNotifications: false,
  });

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const toggleNotification = (id) => {
    setNotifications((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const renderAccount = () => (
    <section className="settings-content-section">
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
        <div className="settings-large-avatar">{initials}</div>

        <div className="settings-profile-details">
          <strong>{userName}</strong>
          <span>{userEmail}</span>
        </div>

        <span className="settings-admin-badge">
          {user?.role || "ADMIN"}
        </span>
      </div>

      <div className="settings-info-grid">
        <div className="settings-info-card">
          <span>FULL NAME</span>
          <strong>{userName}</strong>
        </div>

        <div className="settings-info-card">
          <span>EMAIL ADDRESS</span>
          <strong>{userEmail}</strong>
        </div>

        <div className="settings-info-card">
          <span>ROLE</span>
          <strong>{user?.role || "Admin"}</strong>
        </div>

        <div className="settings-info-card">
          <span>ACCOUNT STATUS</span>
          <strong className="settings-active-status">
            <i />
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
          <span>
            Your account information is securely associated with your
            TaskFlow workspace.
          </span>
        </div>

        <FaCheckCircle className="settings-protected-check" />
      </div>
    </section>
  );

  const renderAppearance = () => (
    <section className="settings-content-section">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>
          <h2>Workspace appearance</h2>
          <p>Customize the visual experience of your TaskFlow workspace.</p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-option-large">
        <div className="settings-option-icon purple">
          <FaPalette />
        </div>

        <div className="settings-option-text">
          <strong>Premium workspace theme</strong>
          <span>
            Your current TaskFlow workspace uses the premium visual theme.
          </span>
        </div>

        <span className="settings-enabled-badge">Enabled</span>
      </div>

      <div className="settings-option-large">
        <div className="settings-option-icon blue">
          <FaCog />
        </div>

        <div className="settings-option-text">
          <strong>Animated background</strong>
          <span>
            Soft gradient motion is enabled for the Settings workspace.
          </span>
        </div>

        <span className="settings-enabled-badge">Active</span>
      </div>
    </section>
  );

  const renderNotifications = () => (
    <section className="settings-content-section">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">NOTIFICATIONS</span>
          <h2>Notification preferences</h2>
          <p>Decide which events should notify you.</p>
        </div>

        <div className="settings-heading-icon">
          <FaBell />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-notification-list">
        {NOTIFICATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const enabled = notifications[item.id];

          return (
            <div
              className={`settings-notification-row ${
                enabled ? "is-enabled" : ""
              }`}
              key={item.id}
            >
              <div className={`settings-notification-icon ${item.color}`}>
                <Icon />
              </div>

              <div className="settings-notification-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  enabled ? "active" : ""
                }`}
                onClick={() => toggleNotification(item.id)}
                aria-label={`Toggle ${item.title}`}
                aria-pressed={enabled}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderSecurity = () => (
    <section className="settings-content-section">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>
          <h2>Security settings</h2>
          <p>Review the security status of your TaskFlow account.</p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-security-card">
        <div className="settings-option-icon purple">
          <FaShieldAlt />
        </div>

        <div className="settings-option-text">
          <strong>Account protection</strong>
          <span>
            Your TaskFlow workspace is protected by account-level
            authentication.
          </span>
        </div>

        <span className="settings-secure-badge">
          <FaCheckCircle />
          Secure
        </span>
      </div>
    </section>
  );

  const renderApplication = () => (
    <section className="settings-content-section">
      <div className="settings-section-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>
          <h2>TaskFlow information</h2>
          <p>Information about your project management workspace.</p>
        </div>

        <div className="settings-heading-icon">
          <FaInfoCircle />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-info-grid application-grid">
        <div className="settings-info-card">
          <span>APPLICATION</span>
          <strong>TaskFlow</strong>
        </div>

        <div className="settings-info-card">
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="settings-info-card">
          <span>PLATFORM</span>
          <strong>MERN Stack</strong>
        </div>

        <div className="settings-info-card">
          <span>STATUS</span>
          <strong className="settings-active-status">
            <i />
            Operational
          </strong>
        </div>
      </div>
    </section>
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
      <div className="settings-background">
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />

        <div className="settings-ring settings-ring-one" />
        <div className="settings-ring settings-ring-two" />
      </div>

      <main className="settings-main">
        <header className="settings-page-header">
          <div>
            <div className="settings-breadcrumb">
              WORKSPACE
              <span>›</span>
              SETTINGS
            </div>

            <h1>Settings</h1>

            <p>
              Manage your account, workspace preferences and security.
            </p>
          </div>
        </header>

        <div className="settings-shell">
          <aside className="settings-navigation">
            <div className="settings-nav-title">SETTINGS</div>

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
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="settings-nav-icon">
                      <Icon />
                    </span>

                    <span className="settings-nav-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>

                    <span className="settings-nav-arrow">›</span>
                  </button>
                );
              })}
            </div>

            <div className="settings-navigation-footer">
              <div className="settings-footer-shield">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>
                <span>Your TaskFlow account is secure.</span>
              </div>

              <FaCheckCircle />
            </div>
          </aside>

          <div className="settings-content">{renderContent()}</div>
        </div>

        <footer className="settings-page-footer">
          <div className="settings-page-footer-icon">
            <FaShieldAlt />
          </div>

          <div className="settings-page-footer-copy">
            <strong>Your preferences are stored securely</strong>
            <span>
              TaskFlow keeps your workspace settings organized and
              protected.
            </span>
          </div>

          <span className="settings-secure-pill">
            <FaCheckCircle />
            Secure
          </span>
        </footer>
      </main>
    </div>
  );
}