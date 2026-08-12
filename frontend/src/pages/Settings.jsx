import React, { useMemo, useState } from "react";
import {
  FaUser,
  FaPalette,
  FaBell,
  FaLock,
  FaInfoCircle,
  FaShieldAlt,
  FaCog,
  FaCheckCircle,
  FaMoon,
  FaSun,
  FaChevronRight,
  FaRedo,
  FaSave,
  FaEdit,
  FaEnvelope,
  FaIdBadge,
  FaDesktop,
  FaDatabase,
  FaCode,
  FaServer,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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
    return parts[0].slice(0, 2).toUpperCase();
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
  return user?.email || user?.emailAddress || "soura@gmail.com";
};

const getUserRole = (user) => {
  return user?.role || "Admin";
};

function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [savedProfile, setSavedProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");

  const activeItem = useMemo(
    () =>
      SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
      SETTINGS_ITEMS[0],
    [activeSection]
  );

  const ActiveIcon = activeItem.icon;

  const updateSetting = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSavedProfile(profile);

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser) {
      const updatedUser = {
        ...storedUser,
        name: profile.name,
        email: profile.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    setIsEditingProfile(false);

    toast.success("Settings saved successfully.");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);

    setProfile({
      name: savedProfile.name,
      email: savedProfile.email,
    });

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("");

    toast.info("Settings have been reset.");
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (!passwordFields.currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (!passwordFields.newPassword) {
      setPasswordMessage("Please enter a new password.");
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

    setPasswordMessage("Password validation completed successfully.");

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Password updated successfully.");
  };

  const renderPasswordInput = (
    label,
    name,
    value,
    showPassword,
    setShowPassword
  ) => (
    <div className="tf-settings-field">
      <label>{label}</label>

      <div className="tf-settings-password-wrap">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={(event) =>
            setPasswordFields((previous) => ({
              ...previous,
              [name]: event.target.value,
            }))
          }
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          className="tf-settings-password-toggle"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-label={`Toggle ${label}`}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <section className="tf-settings-section">
      <div className="tf-settings-section-header">
        <div>
          <span className="tf-settings-eyebrow">ACCOUNT</span>

          <h2>Account information</h2>

          <p>
            Manage your personal identity and TaskFlow workspace
            information.
          </p>
        </div>

        <div className="tf-settings-header-icon">
          <FaUser />
        </div>
      </div>

      <div className="tf-settings-profile-card">
        <div className="tf-settings-profile-main">
          <div className="tf-settings-large-avatar">
            {initials}

            <span className="tf-settings-online-dot" />
          </div>

          <div className="tf-settings-profile-info">
            <div className="tf-settings-profile-name-row">
              <h3>{savedProfile.name}</h3>

              <span className="tf-settings-admin-badge">
                {userRole}
              </span>
            </div>

            <p className="tf-settings-email">
              <FaEnvelope />
              {savedProfile.email}
            </p>

            <div className="tf-settings-profile-status">
              <span>
                <FaCheckCircle />
                Active account
              </span>

              <span>
                <FaShieldAlt />
                Protected workspace
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="tf-settings-edit-profile"
          onClick={() => setIsEditingProfile(true)}
        >
          <FaEdit />
          <span>Edit profile</span>
        </button>
      </div>

      {isEditingProfile && (
        <div className="tf-settings-edit-panel">
          <div className="tf-settings-edit-header">
            <div>
              <span>EDIT PROFILE</span>
              <h3>Update your profile</h3>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="tf-settings-close-button"
            >
              <FaTimes />
            </button>
          </div>

          <div className="tf-settings-edit-grid">
            <div className="tf-settings-field">
              <label>Full name</label>

              <div className="tf-settings-input-icon">
                <FaUser />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="tf-settings-field">
              <label>Email address</label>

              <div className="tf-settings-input-icon">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          <div className="tf-settings-edit-actions">
            <button
              type="button"
              className="tf-settings-secondary-button"
              onClick={() => setIsEditingProfile(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="tf-settings-primary-button"
              onClick={() => {
                if (!profile.name.trim()) {
                  toast.error("Name cannot be empty.");
                  return;
                }

                if (!profile.email.trim()) {
                  toast.error("Email cannot be empty.");
                  return;
                }

                handleSave();
              }}
            >
              <FaSave />
              Save profile
            </button>
          </div>
        </div>
      )}

      <div className="tf-settings-info-grid">
        <div className="tf-settings-info-card">
          <div className="tf-settings-info-icon purple">
            <FaUser />
          </div>

          <div>
            <span>FULL NAME</span>
            <strong>{savedProfile.name}</strong>
          </div>
        </div>

        <div className="tf-settings-info-card">
          <div className="tf-settings-info-icon blue">
            <FaEnvelope />
          </div>

          <div>
            <span>EMAIL ADDRESS</span>
            <strong>{savedProfile.email}</strong>
          </div>
        </div>

        <div className="tf-settings-info-card">
          <div className="tf-settings-info-icon purple">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="tf-settings-info-card">
          <div className="tf-settings-info-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>
            <strong className="tf-settings-active-text">
              Active
            </strong>
          </div>
        </div>
      </div>

      <div className="tf-settings-protected-card">
        <div className="tf-settings-protected-icon">
          <FaShieldAlt />
        </div>

        <div>
          <h4>Protected workspace</h4>

          <p>
            Your TaskFlow account information is securely associated
            with your workspace.
          </p>
        </div>

        <FaCheckCircle className="tf-settings-success-icon" />
      </div>
    </section>
  );

  const renderAppearance = () => (
    <section className="tf-settings-section">
      <div className="tf-settings-section-header">
        <div>
          <span className="tf-settings-eyebrow">APPEARANCE</span>

          <h2>Customize your workspace</h2>

          <p>
            Personalize the TaskFlow interface to match your
            preferred working environment.
          </p>
        </div>

        <div className="tf-settings-header-icon">
          {settings.darkMode ? <FaMoon /> : <FaSun />}
        </div>
      </div>

      <div className="tf-settings-appearance-preview">
        <div className="tf-settings-preview-content">
          <div className="tf-settings-preview-sidebar">
            <div className="tf-settings-preview-logo">TF</div>

            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="tf-settings-preview-main">
            <div className="tf-settings-preview-top" />

            <div className="tf-settings-preview-cards">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>

        <div className="tf-settings-preview-label">
          <strong>
            {settings.darkMode ? "Dark workspace" : "Light workspace"}
          </strong>

          <span>
            {settings.darkMode
              ? "A focused dark interface."
              : "A clean and bright interface."}
          </span>
        </div>
      </div>

      <div className="tf-settings-option-list">
        <button
          type="button"
          className={`tf-settings-option ${
            !settings.darkMode ? "selected" : ""
          }`}
          onClick={() =>
            setSettings((previous) => ({
              ...previous,
              darkMode: false,
            }))
          }
        >
          <div className="tf-settings-option-icon">
            <FaSun />
          </div>

          <div>
            <strong>Light mode</strong>
            <span>Bright and clean workspace</span>
          </div>

          {!settings.darkMode && (
            <FaCheckCircle className="tf-settings-option-check" />
          )}
        </button>

        <button
          type="button"
          className={`tf-settings-option ${
            settings.darkMode ? "selected" : ""
          }`}
          onClick={() =>
            setSettings((previous) => ({
              ...previous,
              darkMode: true,
            }))
          }
        >
          <div className="tf-settings-option-icon">
            <FaMoon />
          </div>

          <div>
            <strong>Dark mode</strong>
            <span>Comfortable interface for low-light environments</span>
          </div>

          {settings.darkMode && (
            <FaCheckCircle className="tf-settings-option-check" />
          )}
        </button>
      </div>
    </section>
  );

  const renderNotifications = () => (
    <section className="tf-settings-section">
      <div className="tf-settings-section-header">
        <div>
          <span className="tf-settings-eyebrow">
            NOTIFICATIONS
          </span>

          <h2>Notification preferences</h2>

          <p>
            Control which TaskFlow alerts and updates you receive.
          </p>
        </div>

        <div className="tf-settings-header-icon">
          <FaBell />
        </div>
      </div>

      <div className="tf-settings-toggle-list">
        {[
          {
            key: "emailNotifications",
            title: "Email notifications",
            description:
              "Receive important TaskFlow updates by email.",
          },
          {
            key: "taskNotifications",
            title: "Task notifications",
            description:
              "Get notified when tasks are assigned or updated.",
          },
          {
            key: "projectNotifications",
            title: "Project notifications",
            description:
              "Receive updates about your projects and workspace.",
          },
        ].map((item) => (
          <div className="tf-settings-toggle-card" key={item.key}>
            <div className="tf-settings-toggle-icon">
              <FaBell />
            </div>

            <div className="tf-settings-toggle-content">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>

            <button
              type="button"
              className={`tf-settings-switch ${
                settings[item.key] ? "on" : ""
              }`}
              onClick={() => updateSetting(item.key)}
              aria-label={`Toggle ${item.title}`}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSecurity = () => (
    <section className="tf-settings-section">
      <div className="tf-settings-section-header">
        <div>
          <span className="tf-settings-eyebrow">SECURITY</span>

          <h2>Password & security</h2>

          <p>
            Keep your TaskFlow account protected with a strong
            password.
          </p>
        </div>

        <div className="tf-settings-header-icon">
          <FaLock />
        </div>
      </div>

      <div className="tf-settings-security-banner">
        <div className="tf-settings-security-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Your account is protected</strong>

          <p>
            Use a unique password that you do not reuse on other
            services.
          </p>
        </div>

        <FaCheckCircle />
      </div>

      <form
        className="tf-settings-password-form"
        onSubmit={handlePasswordChange}
      >
        {renderPasswordInput(
          "Current password",
          "currentPassword",
          passwordFields.currentPassword,
          showCurrentPassword,
          setShowCurrentPassword
        )}

        {renderPasswordInput(
          "New password",
          "newPassword",
          passwordFields.newPassword,
          showNewPassword,
          setShowNewPassword
        )}

        {renderPasswordInput(
          "Confirm password",
          "confirmPassword",
          passwordFields.confirmPassword,
          showConfirmPassword,
          setShowConfirmPassword
        )}

        {passwordMessage && (
          <div className="tf-settings-password-message">
            <FaInfoCircle />
            {passwordMessage}
          </div>
        )}

        <button
          type="submit"
          className="tf-settings-primary-button tf-settings-password-submit"
        >
          <FaLock />
          Update password
        </button>
      </form>
    </section>
  );

  const renderApplication = () => (
    <section className="tf-settings-section">
      <div className="tf-settings-section-header">
        <div>
          <span className="tf-settings-eyebrow">
            APPLICATION
          </span>

          <h2>TaskFlow information</h2>

          <p>
            Information about your TaskFlow application and current
            environment.
          </p>
        </div>

        <div className="tf-settings-header-icon">
          <FaCog />
        </div>
      </div>

      <div className="tf-settings-app-brand">
        <div className="tf-settings-app-logo">TF</div>

        <div className="tf-settings-app-title">
          <span>PROJECT MANAGEMENT PLATFORM</span>

          <h3>TaskFlow</h3>

          <p>
            A modern workspace for managing projects, tasks, teams
            and productivity.
          </p>
        </div>

        <div className="tf-settings-version">
          <span>VERSION</span>
          <strong>1.0.0</strong>
        </div>
      </div>

      <div className="tf-settings-tech-grid">
        <div className="tf-settings-tech-card">
          <FaDesktop />

          <div>
            <span>PLATFORM</span>
            <strong>Web Application</strong>
          </div>
        </div>

        <div className="tf-settings-tech-card">
          <FaCode />

          <div>
            <span>FRONTEND</span>
            <strong>React + Vite</strong>
          </div>
        </div>

        <div className="tf-settings-tech-card">
          <FaServer />

          <div>
            <span>BACKEND</span>
            <strong>Node.js / Express</strong>
          </div>
        </div>

        <div className="tf-settings-tech-card">
          <FaDatabase />

          <div>
            <span>DATABASE</span>
            <strong>MongoDB</strong>
          </div>
        </div>
      </div>

      <div className="tf-settings-about-card">
        <div className="tf-settings-about-icon">
          <FaInfoCircle />
        </div>

        <div>
          <h4>About TaskFlow</h4>

          <p>
            TaskFlow is designed to provide a centralized,
            organized and secure environment for modern project
            management.
          </p>
        </div>

        <span className="tf-settings-operational">
          <FaCheckCircle />
          Operational
        </span>
      </div>
    </section>
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
    <div className="tf-settings-root">
      {/* Existing application navigation */}
      <Sidebar />
      <Navbar />

      {/* Settings page */}
      <main className="tf-settings-page">
        <div className="tf-settings-background">
          <div className="tf-settings-orb tf-settings-orb-one" />
          <div className="tf-settings-orb tf-settings-orb-two" />
          <div className="tf-settings-grid-bg" />
        </div>

        <div className="tf-settings-container">
          <header className="tf-settings-page-header">
            <div>
              <div className="tf-settings-breadcrumb">
                WORKSPACE
                <span>›</span>
                <strong>SETTINGS</strong>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences,
                notifications and security.
              </p>
            </div>

            <div className="tf-settings-secure-badge">
              <FaShieldAlt />
              <span>Workspace secure</span>
            </div>
          </header>

          <div className="tf-settings-shell">
            <aside className="tf-settings-navigation">
              <div className="tf-settings-nav-title">
                SETTINGS
              </div>

              <div className="tf-settings-nav-list">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`tf-settings-nav-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <div className="tf-settings-nav-icon">
                        <Icon />
                      </div>

                      <div className="tf-settings-nav-text">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </div>

                      <FaChevronRight className="tf-settings-nav-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="tf-settings-nav-security">
                <div className="tf-settings-nav-security-icon">
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

            <div className="tf-settings-content">
              {renderActiveSection()}

              <footer className="tf-settings-footer">
                <div className="tf-settings-footer-status">
                  <span className="tf-settings-status-dot" />

                  <div>
                    <strong>
                      All changes are currently saved
                    </strong>

                    <span>
                      Your workspace preferences are organized and
                      protected.
                    </span>
                  </div>
                </div>

                <div className="tf-settings-footer-actions">
                  <button
                    type="button"
                    className="tf-settings-reset-button"
                    onClick={handleReset}
                  >
                    <FaRedo />
                    Reset
                  </button>

                  <button
                    type="button"
                    className="tf-settings-primary-button"
                    onClick={handleSave}
                  >
                    <FaSave />
                    Save changes
                  </button>
                </div>
              </footer>
            </div>
          </div>

          <div className="tf-settings-secure-footer">
            <div className="tf-settings-secure-footer-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>Your preferences are stored securely</strong>

              <span>
                TaskFlow keeps your workspace settings organized and
                protected.
              </span>
            </div>

            <span className="tf-settings-secure-label">
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