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
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaDesktop,
  FaGlobe,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaCircle,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
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
  desktopNotifications: true,
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "SP";

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
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
  return user?.email || "soura@gmail.com";
};

const getUserRole = (user) => {
  return user?.role || "Administrator";
};

const Toggle = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-label={`Toggle ${label}`}
      aria-pressed={checked}
    >
      <span className="settings-toggle-track">
        <span className="settings-toggle-thumb" />
      </span>
    </button>
  );
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="settings-section-header">
      <div>
        <span className="settings-eyebrow">{eyebrow}</span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className="settings-section-icon">
        <Icon />
      </div>
    </div>
  );
};

const Settings = () => {
  const { user } = useAuth();

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = useMemo(() => getInitials(userName), [userName]);

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setHasChanges(true);
    setMessage({
      type: "",
      text: "",
    });
  };

  const updateProfile = (key, value) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setHasChanges(true);
    setMessage({
      type: "",
      text: "",
    });
  };

  const updatePassword = (key, value) => {
    setPasswords((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const resetChanges = () => {
    setSettings(DEFAULT_SETTINGS);

    setProfile({
      name: userName,
      email: userEmail,
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage({
      type: "",
      text: "",
    });

    setHasChanges(false);
  };

  const saveChanges = () => {
    if (!profile.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your full name.",
      });
      return;
    }

    if (!profile.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }

    setHasChanges(false);

    setMessage({
      type: "success",
      text: "Your settings have been saved successfully.",
    });
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();

    if (!passwords.currentPassword) {
      setMessage({
        type: "error",
        text: "Enter your current password.",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage({
      type: "success",
      text: "Password validation completed successfully.",
    });
  };

  const renderPasswordInput = ({
    name,
    placeholder,
    value,
    visible,
    setVisible,
  }) => {
    return (
      <div className="settings-password-wrapper">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            updatePassword(name, event.target.value)
          }
          autoComplete="new-password"
        />

        <button
          type="button"
          className="settings-password-eye"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  };

  const renderAccount = () => (
    <motion.div
      key="account"
      className="settings-content-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        eyebrow="ACCOUNT"
        title="Account information"
        description="Manage your personal information and TaskFlow workspace identity."
        icon={FaUser}
      />

      <div className="settings-profile-hero">
        <div className="settings-profile-avatar">
          {initials}
          <span className="settings-online-dot" />
        </div>

        <div className="settings-profile-details">
          <h3>{profile.name}</h3>

          <p>{profile.email}</p>

          <div className="settings-profile-meta">
            <span>
              <FaCircle />
              {userRole}
            </span>

            <span>
              <FaCheckCircle />
              Active account
            </span>
          </div>
        </div>

        <div className="settings-role-badge">
          <FaShieldAlt />
          {userRole}
        </div>
      </div>

      <div className="settings-form-grid">
        <div className="settings-field">
          <label>FULL NAME</label>

          <div className="settings-input-with-icon">
            <FaUser />

            <input
              type="text"
              value={profile.name}
              onChange={(event) =>
                updateProfile("name", event.target.value)
              }
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="settings-field">
          <label>EMAIL ADDRESS</label>

          <div className="settings-input-with-icon">
            <FaEnvelope />

            <input
              type="email"
              value={profile.email}
              onChange={(event) =>
                updateProfile("email", event.target.value)
              }
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="settings-info-card">
          <div className="settings-info-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span>ROLE</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <div className="settings-info-card success">
          <div className="settings-info-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>ACCOUNT STATUS</span>
            <strong>Active</strong>
          </div>
        </div>
      </div>

      <div className="settings-security-banner">
        <div className="settings-banner-icon">
          <FaShieldAlt />
        </div>

        <div>
          <strong>Protected workspace</strong>

          <p>
            Your TaskFlow account information is securely associated
            with your workspace.
          </p>
        </div>

        <FaCheckCircle className="settings-banner-check" />
      </div>

      <div className="settings-action-bar">
        <div>
          <span className="settings-save-status">
            <FaCircle />
            {hasChanges ? "Unsaved changes" : "All changes saved"}
          </span>

          <small>
            Keep your workspace information up to date.
          </small>
        </div>

        <div className="settings-actions">
          <button
            type="button"
            className="settings-secondary-btn"
            onClick={resetChanges}
          >
            <FaUndo />
            Reset
          </button>

          <button
            type="button"
            className="settings-primary-btn"
            onClick={saveChanges}
          >
            <FaSave />
            Save changes
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderAppearance = () => (
    <motion.div
      key="appearance"
      className="settings-content-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        eyebrow="APPEARANCE"
        title="Customize your workspace"
        description="Control how TaskFlow looks and feels across your workspace."
        icon={FaPalette}
      />

      <div className="settings-theme-showcase">
        <div className="settings-theme-copy">
          <div className="settings-large-icon">
            {settings.darkMode ? <FaMoon /> : <FaSun />}
          </div>

          <div>
            <span className="settings-card-eyebrow">
              WORKSPACE THEME
            </span>

            <h3>
              {settings.darkMode
                ? "Dark workspace"
                : "Light workspace"}
            </h3>

            <p>
              {settings.darkMode
                ? "A darker interface designed for comfortable low-light work."
                : "A bright, clean interface designed for focused daytime work."}
            </p>
          </div>
        </div>

        <div className="settings-theme-switch">
          <button
            type="button"
            className={!settings.darkMode ? "active" : ""}
            onClick={() => updateSetting("darkMode", false)}
          >
            <FaSun />
            Light
          </button>

          <button
            type="button"
            className={settings.darkMode ? "active" : ""}
            onClick={() => updateSetting("darkMode", true)}
          >
            <FaMoon />
            Dark
          </button>
        </div>
      </div>

      <div className="settings-preference-grid">
        <div className="settings-preference-card">
          <div className="settings-preference-icon purple">
            <FaDesktop />
          </div>

          <div>
            <h3>Workspace interface</h3>
            <p>
              Keep your interface consistent across your workspace.
            </p>
          </div>

          <FaCheckCircle className="settings-preference-check" />
        </div>

        <div className="settings-preference-card">
          <div className="settings-preference-icon blue">
            <FaGlobe />
          </div>

          <div>
            <h3>Web application</h3>
            <p>
              TaskFlow automatically adapts to your browser environment.
            </p>
          </div>

          <FaCheckCircle className="settings-preference-check" />
        </div>
      </div>

      <div className="settings-note">
        <FaInfoCircle />

        <span>
          Appearance preferences are applied locally to this workspace.
        </span>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      key="notifications"
      className="settings-content-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        eyebrow="NOTIFICATIONS"
        title="Stay informed"
        description="Choose which TaskFlow events should notify you."
        icon={FaBell}
      />

      <div className="settings-notification-list">
        <div className="settings-notification-item">
          <div className="settings-notification-icon purple">
            <FaEnvelope />
          </div>

          <div className="settings-notification-copy">
            <h3>Email notifications</h3>
            <p>
              Receive important workspace updates through email.
            </p>
          </div>

          <Toggle
            label="email notifications"
            checked={settings.emailNotifications}
            onChange={(value) =>
              updateSetting("emailNotifications", value)
            }
          />
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon blue">
            <FaTasks />
          </div>

          <div className="settings-notification-copy">
            <h3>Task notifications</h3>
            <p>
              Get notified about task assignments, updates and deadlines.
            </p>
          </div>

          <Toggle
            label="task notifications"
            checked={settings.taskNotifications}
            onChange={(value) =>
              updateSetting("taskNotifications", value)
            }
          />
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon green">
            <FaProjectDiagram />
          </div>

          <div className="settings-notification-copy">
            <h3>Project notifications</h3>
            <p>
              Stay updated when projects change or reach milestones.
            </p>
          </div>

          <Toggle
            label="project notifications"
            checked={settings.projectNotifications}
            onChange={(value) =>
              updateSetting("projectNotifications", value)
            }
          />
        </div>

        <div className="settings-notification-item">
          <div className="settings-notification-icon orange">
            <FaDesktop />
          </div>

          <div className="settings-notification-copy">
            <h3>Desktop notifications</h3>
            <p>
              Allow TaskFlow to show notifications on your desktop.
            </p>
          </div>

          <Toggle
            label="desktop notifications"
            checked={settings.desktopNotifications}
            onChange={(value) =>
              updateSetting("desktopNotifications", value)
            }
          />
        </div>
      </div>

      <div className="settings-notification-summary">
        <div>
          <strong>
            {Object.values(settings).filter(Boolean).length - 1}
          </strong>

          <span>notification preferences enabled</span>
        </div>

        <FaBell />
      </div>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div
      key="security"
      className="settings-content-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        eyebrow="SECURITY"
        title="Protect your account"
        description="Manage your password and keep your TaskFlow account secure."
        icon={FaLock}
      />

      <div className="settings-security-overview">
        <div className="settings-security-score">
          <div className="settings-security-score-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span>SECURITY STATUS</span>
            <h3>Account protected</h3>
            <p>Your account security is currently active.</p>
          </div>

          <div className="settings-secure-badge">
            <FaCheckCircle />
            Secure
          </div>
        </div>
      </div>

      <form
        className="settings-password-form"
        onSubmit={handlePasswordChange}
      >
        <div className="settings-form-title">
          <div className="settings-form-title-icon">
            <FaKey />
          </div>

          <div>
            <h3>Change password</h3>
            <p>
              Use a strong password with at least 6 characters.
            </p>
          </div>
        </div>

        <div className="settings-password-grid">
          <div className="settings-field">
            <label>CURRENT PASSWORD</label>

            {renderPasswordInput({
              name: "currentPassword",
              placeholder: "Enter current password",
              value: passwords.currentPassword,
              visible: showCurrentPassword,
              setVisible: setShowCurrentPassword,
            })}
          </div>

          <div className="settings-field">
            <label>NEW PASSWORD</label>

            {renderPasswordInput({
              name: "newPassword",
              placeholder: "Enter new password",
              value: passwords.newPassword,
              visible: showNewPassword,
              setVisible: setShowNewPassword,
            })}
          </div>

          <div className="settings-field">
            <label>CONFIRM PASSWORD</label>

            {renderPasswordInput({
              name: "confirmPassword",
              placeholder: "Confirm new password",
              value: passwords.confirmPassword,
              visible: showConfirmPassword,
              setVisible: setShowConfirmPassword,
            })}
          </div>
        </div>

        <button
          type="submit"
          className="settings-primary-btn settings-password-btn"
        >
          <FaLock />
          Update password
        </button>
      </form>

      <div className="settings-security-tips">
        <div>
          <FaCheckCircle />
          <span>Use a unique password</span>
        </div>

        <div>
          <FaCheckCircle />
          <span>Never share your password</span>
        </div>

        <div>
          <FaCheckCircle />
          <span>Update your password regularly</span>
        </div>
      </div>
    </motion.div>
  );

  const renderApplication = () => (
    <motion.div
      key="application"
      className="settings-content-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        eyebrow="APPLICATION"
        title="TaskFlow information"
        description="Information about your TaskFlow workspace application."
        icon={FaInfoCircle}
      />

      <div className="settings-app-hero">
        <div className="settings-app-logo">
          TF
        </div>

        <div className="settings-app-title">
          <span>PROJECT MANAGEMENT PLATFORM</span>

          <h3>TaskFlow</h3>

          <p>
            Plan projects, manage tasks and collaborate with your
            workspace from one centralized platform.
          </p>
        </div>

        <div className="settings-version-badge">
          v1.0.0
        </div>
      </div>

      <div className="settings-application-grid">
        <div className="settings-application-card">
          <FaCog />

          <span>PLATFORM</span>

          <strong>Web Application</strong>
        </div>

        <div className="settings-application-card">
          <FaGlobe />

          <span>ENVIRONMENT</span>

          <strong>Production</strong>
        </div>

        <div className="settings-application-card success">
          <FaCheckCircle />

          <span>SYSTEM STATUS</span>

          <strong>Operational</strong>
        </div>

        <div className="settings-application-card">
          <FaShieldAlt />

          <span>SECURITY</span>

          <strong>Protected</strong>
        </div>
      </div>

      <div className="settings-about-card">
        <div className="settings-about-icon">
          <FaInfoCircle />
        </div>

        <div>
          <h3>About TaskFlow</h3>

          <p>
            TaskFlow is designed to simplify project management,
            improve productivity and provide a clear overview of
            your team's work.
          </p>
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
      <div className="settings-background">
        <div className="settings-bg-orb settings-bg-orb-one" />
        <div className="settings-bg-orb settings-bg-orb-two" />
        <div className="settings-bg-orb settings-bg-orb-three" />
        <div className="settings-bg-grid" />
      </div>

      {/* Existing navigation remains untouched */}
      <Sidebar />
      <Navbar />

      <main className="settings-main">
        <div className="settings-container">
          <header className="settings-page-header">
            <div>
              <div className="settings-breadcrumb">
                <span>WORKSPACE</span>
                <FaChevronRight />
                <strong>SETTINGS</strong>
              </div>

              <h1>Settings</h1>

              <p>
                Manage your account, workspace preferences,
                notifications and security.
              </p>
            </div>

            <div className="settings-workspace-status">
              <span />
              <FaShieldAlt />
              Workspace secure
            </div>
          </header>

          <section className="settings-shell">
            <aside className="settings-navigation">
              <div className="settings-navigation-title">
                <span>SETTINGS</span>
              </div>

              <div className="settings-navigation-items">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`settings-navigation-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMessage({
                          type: "",
                          text: "",
                        });
                      }}
                    >
                      <span className="settings-navigation-icon">
                        <Icon />
                      </span>

                      <span className="settings-navigation-copy">
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>

                      <FaChevronRight className="settings-navigation-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="settings-sidebar-security">
                <div className="settings-sidebar-security-icon">
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
              <AnimatePresence mode="wait">
                {renderActiveSection()}
              </AnimatePresence>

              {message.text && (
                <motion.div
                  className={`settings-message ${
                    message.type === "error"
                      ? "error"
                      : "success"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === "error" ? (
                    <FaExclamationTriangle />
                  ) : (
                    <FaCheckCircle />
                  )}

                  <span>{message.text}</span>
                </motion.div>
              )}
            </div>
          </section>

          <div className="settings-footer-security">
            <div className="settings-footer-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>Your preferences are stored securely</strong>
              <span>
                TaskFlow keeps your workspace settings organized and
                protected.
              </span>
            </div>

            <span className="settings-footer-badge">
              <FaCheckCircle />
              Secure
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;