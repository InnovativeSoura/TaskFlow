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
  FaUserShield,
  FaDesktop,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaGlobe,
  FaCog,
} from "react-icons/fa";

import "../styles/Settings.css";

const SETTINGS_ITEMS = [
  {
    id: "account",
    title: "Account",
    description: "Your profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your workspace",
    icon: FaPalette,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage your alerts",
    icon: FaBell,
  },
  {
    id: "security",
    title: "Security",
    description: "Password and security",
    icon: FaLock,
  },
  {
    id: "application",
    title: "Application",
    description: "TaskFlow information",
    icon: FaInfoCircle,
  },
];

function getInitials(name) {
  if (!name) return "SP";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getUserData() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("taskflow_user") ||
      localStorage.getItem("currentUser");

    if (!storedUser) {
      return {
        name: "Souradipta Patra",
        email: "soura@gmail.com",
        role: "Admin",
      };
    }

    const parsed = JSON.parse(storedUser);

    return {
      name:
        parsed?.name ||
        parsed?.username ||
        parsed?.fullName ||
        "Souradipta Patra",
      email: parsed?.email || parsed?.emailAddress || "soura@gmail.com",
      role: parsed?.role || "Admin",
    };
  } catch {
    return {
      name: "Souradipta Patra",
      email: "soura@gmail.com",
      role: "Admin",
    };
  }
}

function AccountPanel({ user }) {
  const initials = getInitials(user.name);

  return (
    <section className="settings-panel-content">
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

      <div className="settings-heading-divider" />

      <div className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-profile-avatar">{initials}</div>

          <div className="settings-profile-details">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <span className="settings-admin-badge">
          {String(user.role).toUpperCase()}
        </span>
      </div>

      <div className="settings-information-grid">
        <div className="settings-information-card">
          <div className="settings-information-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{user.name}</strong>
          </div>
        </div>

        <div className="settings-information-card">
          <div className="settings-information-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <div className="settings-information-card">
          <div className="settings-information-icon slate">
            <FaUserShield />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{user.role}</strong>
          </div>
        </div>

        <div className="settings-information-card">
          <div className="settings-information-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>

            <strong className="settings-active-status">
              <i />
              Active
            </strong>
          </div>
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
}

function AppearancePanel() {
  const [theme, setTheme] = useState("light");

  return (
    <section className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPEARANCE</span>

          <h2>Workspace appearance</h2>

          <p>Customize how TaskFlow looks across your workspace.</p>
        </div>

        <div className="settings-heading-icon">
          <FaPalette />
        </div>
      </div>

      <div className="settings-heading-divider" />

      <div className="settings-option-list">
        <button
          type="button"
          className={`settings-option-card ${
            theme === "light" ? "selected" : ""
          }`}
          onClick={() => setTheme("light")}
        >
          <div className="settings-option-icon purple">
            <FaSun />
          </div>

          <div className="settings-option-copy">
            <strong>Light mode</strong>
            <span>Bright and clean workspace appearance.</span>
          </div>

          <span className="settings-radio">
            {theme === "light" && <i />}
          </span>
        </button>

        <button
          type="button"
          className={`settings-option-card ${
            theme === "dark" ? "selected" : ""
          }`}
          onClick={() => setTheme("dark")}
        >
          <div className="settings-option-icon slate">
            <FaMoon />
          </div>

          <div className="settings-option-copy">
            <strong>Dark mode</strong>
            <span>Reduce visual brightness for a darker workspace.</span>
          </div>

          <span className="settings-radio">
            {theme === "dark" && <i />}
          </span>
        </button>

        <div className="settings-preference-card">
          <div className="settings-option-icon blue">
            <FaGlobe />
          </div>

          <div className="settings-option-copy">
            <strong>Workspace language</strong>
            <span>English is currently selected.</span>
          </div>

          <span className="settings-value-badge">English</span>
        </div>
      </div>
    </section>
  );
}

function NotificationsPanel() {
  const [preferences, setPreferences] = useState({
    assignments: true,
    taskUpdates: true,
    projectUpdates: true,
    email: true,
    desktop: false,
  });

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

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
      icon: FaCog,
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
    <section className="settings-panel-content">
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

      <div className="settings-heading-divider" />

      <div className="settings-notification-list">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          const enabled = preferences[item.key];

          return (
            <div
              className={`settings-notification-row ${
                enabled ? "enabled" : ""
              }`}
              key={item.key}
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
                className={`settings-switch ${enabled ? "on" : ""}`}
                onClick={() => togglePreference(item.key)}
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
}

function SecurityPanel() {
  return (
    <section className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">SECURITY</span>

          <h2>Password and security</h2>

          <p>Manage your account security preferences.</p>
        </div>

        <div className="settings-heading-icon">
          <FaLock />
        </div>
      </div>

      <div className="settings-heading-divider" />

      <div className="settings-security-card">
        <div className="settings-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Account security</strong>
          <span>
            Your TaskFlow account is protected with secure authentication.
          </span>
        </div>

        <span className="settings-security-status">
          <FaCheckCircle />
          Protected
        </span>
      </div>

      <div className="settings-security-grid">
        <div className="settings-security-item">
          <span>PASSWORD</span>
          <strong>••••••••••••</strong>
          <button type="button">Change password</button>
        </div>

        <div className="settings-security-item">
          <span>ACCOUNT ACCESS</span>
          <strong>Secure</strong>
          <small>Authentication is enabled.</small>
        </div>
      </div>
    </section>
  );
}

function ApplicationPanel() {
  return (
    <section className="settings-panel-content">
      <div className="settings-panel-heading">
        <div>
          <span className="settings-eyebrow">APPLICATION</span>

          <h2>TaskFlow information</h2>

          <p>Information about your TaskFlow workspace application.</p>
        </div>

        <div className="settings-heading-icon">
          <FaInfoCircle />
        </div>
      </div>

      <div className="settings-heading-divider" />

      <div className="settings-application-card">
        <div className="settings-app-logo">TF</div>

        <div>
          <strong>TaskFlow</strong>
          <span>Project management workspace</span>
        </div>

        <span className="settings-version-badge">v1.0.0</span>
      </div>

      <div className="settings-application-grid">
        <div>
          <span>APPLICATION</span>
          <strong>TaskFlow</strong>
        </div>

        <div>
          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div>
          <span>ENVIRONMENT</span>
          <strong>Production</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong className="settings-active-status">
            <i />
            Operational
          </strong>
        </div>
      </div>
    </section>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("account");

  const user = useMemo(() => getUserData(), []);

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
      {/* Animated decorative background */}
      <div className="settings-background" aria-hidden="true">
        <div className="settings-orb settings-orb-one" />
        <div className="settings-orb settings-orb-two" />
        <div className="settings-orb settings-orb-three" />

        <div className="settings-ring settings-ring-one" />
        <div className="settings-ring settings-ring-two" />

        <div className="settings-grid-overlay" />
      </div>

      <div className="settings-container">
        {/* Page heading */}
        <header className="settings-page-header">
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
        </header>

        {/* Main settings card */}
        <section className="settings-main-card">
          {/* Settings navigation */}
          <aside className="settings-navigation">
            <div className="settings-navigation-title">SETTINGS</div>

            <div className="settings-navigation-list">
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`settings-navigation-item ${
                      active ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="settings-navigation-icon">
                      <Icon />
                    </span>

                    <span className="settings-navigation-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    <FaChevronRight className="settings-navigation-arrow" />
                  </button>
                );
              })}
            </div>

            <div className="settings-navigation-protection">
              <div className="settings-protection-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>
                <span>Your TaskFlow account is secure.</span>
              </div>

              <FaCheckCircle />
            </div>
          </aside>

          {/* Dynamic settings content */}
          <div className="settings-content">{renderPanel()}</div>
        </section>

        {/* Footer / security information */}
        <footer className="settings-footer">
          <div className="settings-footer-icon">
            <FaShieldAlt />
          </div>

          <div className="settings-footer-copy">
            <strong>Your preferences are stored securely</strong>

            <span>
              TaskFlow keeps your workspace settings organized and protected.
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