import React, { useMemo, useState } from "react";
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
  FaTasks,
  FaProjectDiagram,
  FaKey,
  FaGlobe,
  FaDatabase,
  FaBolt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
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

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "TF";

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

const Toggle = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "active" : ""}`}
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
    </button>
  );
};

function Settings() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const userName = useMemo(() => getUserName(user), [user]);
  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const userRole = useMemo(() => getUserRole(user), [user]);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const activeItem =
    SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
    SETTINGS_ITEMS[0];

  const ActiveIcon = activeItem.icon;

  const updateSetting = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordFields((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwordFields.currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (passwordFields.newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordFields.newPassword !==
      passwordFields.confirmPassword
    ) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password validation successful. Connect your password API to save it."
    );

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const renderAccount = () => (
    <section className="settings-section-content">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            Manage your TaskFlow identity and view your workspace
            account details.
          </p>
        </div>

        <div className="section-icon-large">
          <FaUser />
        </div>
      </div>

      <div className="account-hero-card">
        <div className="account-avatar-large">
          {initials}
        </div>

        <div className="account-hero-info">
          <span className="account-hero-label">
            TASKFLOW MEMBER
          </span>

          <h3>{userName}</h3>

          <p>{userEmail}</p>

          <div className="account-meta">
            <span className="role-pill">
              <FaShieldAlt />
              {userRole}
            </span>

            <span className="active-pill">
              <span className="active-dot" />
              Active account
            </span>
          </div>
        </div>

        <div className="account-hero-badge">
          <FaCheckCircle />
          Verified
        </div>
      </div>

      <div className="account-info-grid">
        <div className="premium-info-card">
          <div className="info-card-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{userName}</strong>
          </div>
        </div>

        <div className="premium-info-card">
          <div className="info-card-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        <div className="premium-info-card">
          <div className="info-card-icon slate">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="premium-info-card">
          <div className="info-card-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>
            <strong className="success-text">
              <span className="active-dot" />
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="protected-workspace-card">
        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>
          <p>
            Your account information is securely associated with
            your TaskFlow workspace.
          </p>
        </div>

        <FaCheckCircle className="protected-check" />
      </div>
    </section>
  );

  const renderAppearance = () => (
    <section className="settings-section-content">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">APPEARANCE</span>

          <h2>Customize your workspace</h2>

          <p>
            Personalize the visual experience of your TaskFlow
            workspace.
          </p>
        </div>

        <div className="section-icon-large">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>

      <div className="appearance-preview-card">
        <div className="appearance-preview-glow" />

        <div className="appearance-preview-content">
          <span className="preview-label">LIVE PREVIEW</span>

          <h3>
            {settings.darkMode
              ? "Dark workspace"
              : "Light workspace"}
          </h3>

          <p>
            Your interface automatically reflects the selected
            appearance preference.
          </p>
        </div>

        <div className="appearance-preview-orb">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>

      <div className="setting-option-card">
        <div className="setting-option-icon">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>

        <div className="setting-option-content">
          <strong>Dark mode</strong>

          <p>
            Switch between light and dark visual modes.
          </p>
        </div>

        <Toggle
          checked={settings.darkMode}
          onChange={() => updateSetting("darkMode")}
          label="Toggle dark mode"
        />
      </div>
    </section>
  );

  const renderNotifications = () => (
    <section className="settings-section-content">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">NOTIFICATIONS</span>

          <h2>Stay informed</h2>

          <p>
            Choose which TaskFlow events should send you
            notifications.
          </p>
        </div>

        <div className="section-icon-large">
          <FaBell />
        </div>
      </div>

      <div className="notification-list">
        <div className="setting-option-card">
          <div className="setting-option-icon purple">
            <FaEnvelope />
          </div>

          <div className="setting-option-content">
            <strong>Email notifications</strong>

            <p>
              Receive important TaskFlow updates by email.
            </p>
          </div>

          <Toggle
            checked={settings.emailNotifications}
            onChange={() =>
              updateSetting("emailNotifications")
            }
            label="Toggle email notifications"
          />
        </div>

        <div className="setting-option-card">
          <div className="setting-option-icon blue">
            <FaTasks />
          </div>

          <div className="setting-option-content">
            <strong>Task notifications</strong>

            <p>
              Get notified about task assignments and updates.
            </p>
          </div>

          <Toggle
            checked={settings.taskNotifications}
            onChange={() =>
              updateSetting("taskNotifications")
            }
            label="Toggle task notifications"
          />
        </div>

        <div className="setting-option-card">
          <div className="setting-option-icon green">
            <FaProjectDiagram />
          </div>

          <div className="setting-option-content">
            <strong>Project notifications</strong>

            <p>
              Receive updates about projects and team activity.
            </p>
          </div>

          <Toggle
            checked={settings.projectNotifications}
            onChange={() =>
              updateSetting("projectNotifications")
            }
            label="Toggle project notifications"
          />
        </div>
      </div>
    </section>
  );

  const renderSecurity = () => (
    <section className="settings-section-content">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected with strong
            authentication settings.
          </p>
        </div>

        <div className="section-icon-large">
          <FaLock />
        </div>
      </div>

      <div className="security-banner">
        <div className="security-banner-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your workspace is protected</strong>

          <p>
            Security settings help keep your TaskFlow account
            private and protected.
          </p>
        </div>

        <span>
          <FaCheckCircle />
          Secure
        </span>
      </div>

      <form
        className="password-card"
        onSubmit={handlePasswordSubmit}
      >
        <div className="password-card-header">
          <div className="setting-option-icon purple">
            <FaKey />
          </div>

          <div>
            <h3>Change password</h3>
            <p>
              Use a strong password with at least 6 characters.
            </p>
          </div>
        </div>

        <div className="password-grid">
          <label>
            Current password

            <input
              type="password"
              name="currentPassword"
              value={passwordFields.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </label>

          <label>
            New password

            <input
              type="password"
              name="newPassword"
              value={passwordFields.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
          </label>

          <label>
            Confirm password

            <input
              type="password"
              name="confirmPassword"
              value={passwordFields.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </label>
        </div>

        {passwordMessage && (
          <div
            className={`password-message ${
              passwordMessage.includes("successful")
                ? "success"
                : "error"
            }`}
          >
            {passwordMessage}
          </div>
        )}

        <button
          type="submit"
          className="premium-primary-button"
        >
          <FaLock />
          Update password
        </button>
      </form>
    </section>
  );

  const renderApplication = () => (
    <section className="settings-section-content">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">APPLICATION</span>

          <h2>About TaskFlow</h2>

          <p>
            Information about your project management workspace.
          </p>
        </div>

        <div className="section-icon-large">
          <FaCog />
        </div>
      </div>

      <div className="application-hero-card">
        <div className="application-logo">
          TF
        </div>

        <div>
          <span>TASKFLOW</span>
          <h3>Project management, simplified.</h3>
          <p>
            A modern workspace for organizing projects, tasks,
            teams and productivity.
          </p>
        </div>

        <div className="application-status">
          <span className="active-dot" />
          Operational
        </div>
      </div>

      <div className="application-grid">
        <div className="application-info-card">
          <FaBolt />
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>

        <div className="application-info-card">
          <FaGlobe />
          <span>PLATFORM</span>
          <strong>Web Application</strong>
        </div>

        <div className="application-info-card">
          <FaDatabase />
          <span>WORKSPACE</span>
          <strong>Protected</strong>
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
    <div className="settings-layout">
      {/* IMPORTANT:
          Existing application shell remains intact.
          Do not remove Sidebar or Navbar.
      */}
      <Sidebar />
      <Navbar />

      <main className="settings-main">
        <div className="settings-background">
          <div className="settings-orb orb-one" />
          <div className="settings-orb orb-two" />
          <div className="settings-orb orb-three" />

          <div className="settings-ring ring-one" />
          <div className="settings-ring ring-two" />

          <div className="settings-grid-background" />

          <div className="settings-particle particle-one" />
          <div className="settings-particle particle-two" />
          <div className="settings-particle particle-three" />
          <div className="settings-particle particle-four" />
        </div>

        <div className="settings-page-container">
          <header className="settings-page-header">
            <div>
              <div className="settings-breadcrumb">
                WORKSPACE
                <span>›</span>
                SETTINGS
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences and
                security.
              </p>
            </div>

            <div className="workspace-status">
              <span className="status-pulse" />
              Workspace secure
            </div>
          </header>

          <div className="settings-shell">
            <aside className="settings-navigation">
              <div className="settings-navigation-title">
                SETTINGS
              </div>

              <div className="settings-navigation-items">
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
                        <small>{item.description}</small>
                      </span>

                      <FaChevronRight className="nav-chevron" />
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
                  <span>Your TaskFlow account is secure.</span>
                </div>

                <FaCheckCircle />
              </div>
            </aside>

            <div className="settings-content">
              <div className="content-top-accent" />

              <div className="active-section-indicator">
                <span>
                  <ActiveIcon />
                </span>

                <div>
                  <strong>{activeItem.label}</strong>
                  <small>{activeItem.description}</small>
                </div>
              </div>

              {renderContent()}
            </div>
          </div>

          <div className="settings-bottom-security">
            <div className="bottom-security-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>
                Your preferences are stored securely
              </strong>

              <p>
                TaskFlow keeps your workspace settings organized
                and protected.
              </p>
            </div>

            <span>
              <FaCheckCircle />
              Secure
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;