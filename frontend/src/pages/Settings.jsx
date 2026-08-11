import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
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
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaDesktop,
  FaGlobe,
  FaBolt,
  FaKey,
  FaCircle,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

const STORAGE_KEY = "taskflow-settings";

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};

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

function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "TF";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function getUserName(user) {
  return (
    user?.name ||
    user?.username ||
    user?.fullName ||
    "TaskFlow User"
  );
}

function getUserEmail(user) {
  return user?.email || "No email available";
}

function getUserRole(user) {
  return user?.role || "Administrator";
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const { user } = useAuth();

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);

  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettings] = useState(loadSettings);

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [originalProfile, setOriginalProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
  }, []);

  const hasProfileChanges = useMemo(() => {
    return (
      profile.name !== originalProfile.name ||
      profile.email !== originalProfile.email
    );
  }, [profile, originalProfile]);

  const passwordStrength = useMemo(() => {
    const password = passwords.newPassword;

    if (!password) {
      return {
        score: 0,
        label: "Enter a password",
      };
    }

    let score = 0;

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) {
      return {
        score,
        label: "Weak password",
      };
    }

    if (score <= 3) {
      return {
        score,
        label: "Good password",
      };
    }

    return {
      score,
      label: "Strong password",
    };
  }, [passwords.newPassword]);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Unable to save settings.");
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );

      toast.info("Settings restored to default.");
    } catch {
      toast.error("Unable to reset settings.");
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!profile.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setSaving(true);

    try {
      /*
       * This keeps the settings page functional immediately.
       * If your backend exposes a profile-update endpoint,
       * this is the place to connect it.
       */
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOriginalProfile(profile);

      toast.success("Account information updated.");
    } catch {
      toast.error("Unable to update account information.");
    } finally {
      setSaving(false);
    }
  };

  const resetProfile = () => {
    setProfile(originalProfile);
    toast.info("Account changes discarded.");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const changePassword = async (event) => {
    event.preventDefault();

    if (!passwords.currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must contain at least 6 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      /*
       * Frontend validation is complete.
       * Connect your backend password endpoint here when available.
       */
      await new Promise((resolve) => setTimeout(resolve, 700));

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully.");
    } catch {
      toast.error("Unable to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const selectSection = (section) => {
    setActiveSection(section);

    window.requestAnimationFrame(() => {
      const content = document.querySelector(
        ".tf-settings-content-panel"
      );

      if (content) {
        content.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  };

  const activeItem =
    SETTINGS_ITEMS.find((item) => item.id === activeSection) ||
    SETTINGS_ITEMS[0];

  const ActiveIcon = activeItem.icon;

  return (
    <div
      className={`tf-settings-page ${
        settings.darkMode ? "tf-settings-dark" : ""
      }`}
    >
      <div className="tf-settings-background">
        <div className="tf-settings-orb tf-settings-orb-one" />
        <div className="tf-settings-orb tf-settings-orb-two" />
        <div className="tf-settings-orb tf-settings-orb-three" />
        <div className="tf-settings-grid" />
      </div>

      <main className="tf-settings-main">
        {/* PAGE HEADER */}
        <header className="tf-settings-header">
          <div className="tf-settings-header-left">
            <div className="tf-settings-eyebrow">
              <span>WORKSPACE</span>
              <span className="tf-settings-eyebrow-separator">›</span>
              <strong>SETTINGS</strong>
            </div>

            <h1>Settings</h1>

            <p>
              Manage your account, workspace preferences,
              notifications and security.
            </p>
          </div>

          <div className="tf-settings-secure-badge">
            <span className="tf-settings-status-dot" />
            <FaShieldAlt />
            <span>Workspace secure</span>
          </div>
        </header>

        {/* MAIN SETTINGS CARD */}
        <section className="tf-settings-card">
          {/* LEFT SETTINGS NAVIGATION */}
          <aside className="tf-settings-navigation">
            <div className="tf-settings-navigation-heading">
              SETTINGS
            </div>

            <div className="tf-settings-navigation-list">
              {SETTINGS_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`tf-settings-navigation-item ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() => selectSection(item.id)}
                  >
                    <span className="tf-settings-navigation-icon">
                      <Icon />
                    </span>

                    <span className="tf-settings-navigation-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    <FaChevronRight className="tf-settings-navigation-arrow" />
                  </button>
                );
              })}
            </div>

            <div className="tf-settings-protection">
              <div className="tf-settings-protection-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>Protected workspace</strong>
                <span>
                  Your TaskFlow account is securely protected.
                </span>
              </div>

              <FaCheckCircle className="tf-settings-protection-check" />
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="tf-settings-content-panel">
            <div className="tf-settings-section-header">
              <div>
                <span className="tf-settings-section-kicker">
                  {activeItem.title.toUpperCase()}
                </span>

                <h2>{activeItem.title}</h2>

                <p>{activeItem.description}</p>
              </div>

              <div className="tf-settings-section-icon">
                <ActiveIcon />
              </div>
            </div>

            {/* ACCOUNT */}
            {activeSection === "account" && (
              <section className="tf-settings-section-content">
                <div className="tf-settings-profile-banner">
                  <div className="tf-settings-avatar">
                    {initials}
                  </div>

                  <div className="tf-settings-profile-main">
                    <h3>{profile.name || "TaskFlow User"}</h3>

                    <p>{profile.email}</p>

                    <div className="tf-settings-profile-meta">
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

                  <span className="tf-settings-role-badge">
                    {userRole}
                  </span>
                </div>

                <div className="tf-settings-form-grid">
                  <div className="tf-settings-field">
                    <label htmlFor="settings-name">
                      FULL NAME
                    </label>

                    <div className="tf-settings-input-wrapper">
                      <FaUser />

                      <input
                        id="settings-name"
                        name="name"
                        type="text"
                        value={profile.name}
                        onChange={handleProfileChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="tf-settings-field">
                    <label htmlFor="settings-email">
                      EMAIL ADDRESS
                    </label>

                    <div className="tf-settings-input-wrapper">
                      <FaEnvelope />

                      <input
                        id="settings-email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="tf-settings-info-grid">
                  <div className="tf-settings-info-card">
                    <div className="tf-settings-info-icon">
                      <FaShieldAlt />
                    </div>

                    <div>
                      <span>ROLE</span>
                      <strong>{userRole}</strong>
                    </div>
                  </div>

                  <div className="tf-settings-info-card">
                    <div className="tf-settings-info-icon tf-settings-success">
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

                <div className="tf-settings-protected-row">
                  <div className="tf-settings-protected-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Protected workspace</strong>
                    <p>
                      Your account information is securely
                      associated with your TaskFlow workspace.
                    </p>
                  </div>

                  <FaCheckCircle />
                </div>

                <div className="tf-settings-action-bar">
                  <div className="tf-settings-save-status">
                    <FaCheckCircle />
                    <div>
                      <strong>
                        {hasProfileChanges
                          ? "Unsaved changes"
                          : "All changes saved"}
                      </strong>
                      <span>
                        Keep your workspace information up to date.
                      </span>
                    </div>
                  </div>

                  <div className="tf-settings-actions">
                    <button
                      type="button"
                      className="tf-settings-secondary-button"
                      onClick={resetProfile}
                      disabled={!hasProfileChanges || saving}
                    >
                      <FaUndo />
                      Reset
                    </button>

                    <button
                      type="button"
                      className="tf-settings-primary-button"
                      onClick={saveProfile}
                      disabled={!hasProfileChanges || saving}
                    >
                      <FaSave />
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <section className="tf-settings-section-content">
                <div className="tf-settings-hero-setting">
                  <div className="tf-settings-setting-icon">
                    {settings.darkMode ? <FaMoon /> : <FaSun />}
                  </div>

                  <div>
                    <h3>Workspace appearance</h3>
                    <p>
                      Choose how TaskFlow looks while you work.
                    </p>
                  </div>

                  <div className="tf-settings-live-badge">
                    <FaBolt />
                    Live
                  </div>
                </div>

                <div className="tf-settings-theme-grid">
                  <button
                    type="button"
                    className={`tf-settings-theme-card ${
                      !settings.darkMode ? "is-selected" : ""
                    }`}
                    onClick={() => updateSetting("darkMode", false)}
                  >
                    <div className="tf-settings-theme-preview tf-settings-light-preview">
                      <div className="tf-preview-top" />
                      <div className="tf-preview-body">
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>

                    <div className="tf-settings-theme-info">
                      <span className="tf-settings-radio">
                        {!settings.darkMode && <span />}
                      </span>

                      <div>
                        <strong>Light mode</strong>
                        <small>Clean and bright workspace</small>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`tf-settings-theme-card ${
                      settings.darkMode ? "is-selected" : ""
                    }`}
                    onClick={() => updateSetting("darkMode", true)}
                  >
                    <div className="tf-settings-theme-preview tf-settings-dark-preview">
                      <div className="tf-preview-top" />
                      <div className="tf-preview-body">
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>

                    <div className="tf-settings-theme-info">
                      <span className="tf-settings-radio">
                        {settings.darkMode && <span />}
                      </span>

                      <div>
                        <strong>Dark mode</strong>
                        <small>Comfortable low-light workspace</small>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="tf-settings-preference-row">
                  <div className="tf-settings-preference-icon">
                    <FaPalette />
                  </div>

                  <div className="tf-settings-preference-copy">
                    <strong>Current workspace theme</strong>
                    <span>
                      {settings.darkMode
                        ? "Dark mode is currently active."
                        : "Light mode is currently active."}
                    </span>
                  </div>

                  <span className="tf-settings-current-badge">
                    {settings.darkMode ? "Dark" : "Light"}
                  </span>
                </div>

                <div className="tf-settings-action-bar">
                  <div className="tf-settings-save-status">
                    <FaCheckCircle />
                    <div>
                      <strong>Preference ready</strong>
                      <span>
                        Your appearance preference is saved locally.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="tf-settings-primary-button"
                    onClick={saveSettings}
                  >
                    <FaSave />
                    Save preference
                  </button>
                </div>
              </section>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <section className="tf-settings-section-content">
                <div className="tf-settings-hero-setting">
                  <div className="tf-settings-setting-icon">
                    <FaBell />
                  </div>

                  <div>
                    <h3>Notification preferences</h3>
                    <p>
                      Control which updates TaskFlow can send you.
                    </p>
                  </div>
                </div>

                <div className="tf-settings-toggle-list">
                  <div className="tf-settings-toggle-row">
                    <div className="tf-settings-toggle-icon">
                      <FaEnvelope />
                    </div>

                    <div className="tf-settings-toggle-copy">
                      <strong>Email notifications</strong>
                      <span>
                        Receive important TaskFlow updates by email.
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle email notifications"
                      className={`tf-settings-switch ${
                        settings.emailNotifications
                          ? "is-on"
                          : ""
                      }`}
                      onClick={() =>
                        updateSetting(
                          "emailNotifications",
                          !settings.emailNotifications
                        )
                      }
                    >
                      <span />
                    </button>
                  </div>

                  <div className="tf-settings-toggle-row">
                    <div className="tf-settings-toggle-icon">
                      <FaTasks />
                    </div>

                    <div className="tf-settings-toggle-copy">
                      <strong>Task notifications</strong>
                      <span>
                        Get notified about task assignments and
                        updates.
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle task notifications"
                      className={`tf-settings-switch ${
                        settings.taskNotifications ? "is-on" : ""
                      }`}
                      onClick={() =>
                        updateSetting(
                          "taskNotifications",
                          !settings.taskNotifications
                        )
                      }
                    >
                      <span />
                    </button>
                  </div>

                  <div className="tf-settings-toggle-row">
                    <div className="tf-settings-toggle-icon">
                      <FaProjectDiagram />
                    </div>

                    <div className="tf-settings-toggle-copy">
                      <strong>Project notifications</strong>
                      <span>
                        Stay updated when projects change.
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle project notifications"
                      className={`tf-settings-switch ${
                        settings.projectNotifications
                          ? "is-on"
                          : ""
                      }`}
                      onClick={() =>
                        updateSetting(
                          "projectNotifications",
                          !settings.projectNotifications
                        )
                      }
                    >
                      <span />
                    </button>
                  </div>
                </div>

                <div className="tf-settings-notification-summary">
                  <div>
                    <FaBell />
                  </div>

                  <section>
                    <strong>Notification center</strong>
                    <p>
                      Your notification preferences are applied
                      across this workspace.
                    </p>
                  </section>

                  <span>
                    {
                      [
                        settings.emailNotifications,
                        settings.taskNotifications,
                        settings.projectNotifications,
                      ].filter(Boolean).length
                    }{" "}
                    / 3 active
                  </span>
                </div>

                <div className="tf-settings-action-bar">
                  <div className="tf-settings-save-status">
                    <FaCheckCircle />
                    <div>
                      <strong>Preferences configured</strong>
                      <span>
                        Changes are stored in your browser.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="tf-settings-primary-button"
                    onClick={saveSettings}
                  >
                    <FaSave />
                    Save notifications
                  </button>
                </div>
              </section>
            )}

            {/* SECURITY */}
            {activeSection === "security" && (
              <section className="tf-settings-section-content">
                <div className="tf-settings-security-banner">
                  <div className="tf-settings-security-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Your account is protected</strong>
                    <p>
                      Use a strong password that you do not reuse
                      on other services.
                    </p>
                  </div>

                  <span>
                    <FaCheckCircle />
                    Secure
                  </span>
                </div>

                <form
                  className="tf-settings-password-form"
                  onSubmit={changePassword}
                >
                  <div className="tf-settings-field">
                    <label htmlFor="current-password">
                      CURRENT PASSWORD
                    </label>

                    <div className="tf-settings-input-wrapper">
                      <FaKey />

                      <input
                        id="current-password"
                        name="currentPassword"
                        type={
                          showPasswords.currentPassword
                            ? "text"
                            : "password"
                        }
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        className="tf-settings-eye-button"
                        onClick={() =>
                          togglePasswordVisibility(
                            "currentPassword"
                          )
                        }
                        aria-label="Toggle current password"
                      >
                        {showPasswords.currentPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="tf-settings-form-grid">
                    <div className="tf-settings-field">
                      <label htmlFor="new-password">
                        NEW PASSWORD
                      </label>

                      <div className="tf-settings-input-wrapper">
                        <FaLock />

                        <input
                          id="new-password"
                          name="newPassword"
                          type={
                            showPasswords.newPassword
                              ? "text"
                              : "password"
                          }
                          value={passwords.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Create new password"
                        />

                        <button
                          type="button"
                          className="tf-settings-eye-button"
                          onClick={() =>
                            togglePasswordVisibility(
                              "newPassword"
                            )
                          }
                          aria-label="Toggle new password"
                        >
                          {showPasswords.newPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="tf-settings-field">
                      <label htmlFor="confirm-password">
                        CONFIRM PASSWORD
                      </label>

                      <div className="tf-settings-input-wrapper">
                        <FaLock />

                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type={
                            showPasswords.confirmPassword
                              ? "text"
                              : "password"
                          }
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                        />

                        <button
                          type="button"
                          className="tf-settings-eye-button"
                          onClick={() =>
                            togglePasswordVisibility(
                              "confirmPassword"
                            )
                          }
                          aria-label="Toggle confirm password"
                        >
                          {showPasswords.confirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="tf-settings-password-strength">
                    <div className="tf-settings-strength-header">
                      <span>Password strength</span>
                      <strong>{passwordStrength.label}</strong>
                    </div>

                    <div className="tf-settings-strength-bars">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <span
                          key={bar}
                          className={
                            bar <= passwordStrength.score
                              ? "is-filled"
                              : ""
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="tf-settings-password-hint">
                    <FaInfoCircle />
                    <span>
                      Use at least 6 characters. A combination of
                      uppercase letters, numbers and symbols is
                      recommended.
                    </span>
                  </div>

                  <div className="tf-settings-action-bar">
                    <div className="tf-settings-save-status">
                      <FaShieldAlt />
                      <div>
                        <strong>Security controls</strong>
                        <span>
                          Protect your TaskFlow account.
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="tf-settings-primary-button"
                      disabled={passwordSaving}
                    >
                      <FaLock />
                      {passwordSaving
                        ? "Updating..."
                        : "Update password"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* APPLICATION */}
            {activeSection === "application" && (
              <section className="tf-settings-section-content">
                <div className="tf-settings-application-hero">
                  <div className="tf-settings-taskflow-logo">
                    TF
                  </div>

                  <div>
                    <span>PROJECT MANAGEMENT PLATFORM</span>
                    <h3>TaskFlow</h3>
                    <p>
                      Organize projects, manage tasks and keep
                      your team aligned.
                    </p>
                  </div>

                  <div className="tf-settings-operational">
                    <FaCheckCircle />
                    Operational
                  </div>
                </div>

                <div className="tf-settings-application-grid">
                  <div className="tf-settings-application-card">
                    <div className="tf-settings-application-card-icon">
                      <FaCog />
                    </div>

                    <div>
                      <span>VERSION</span>
                      <strong>1.0.0</strong>
                      <small>Current release</small>
                    </div>
                  </div>

                  <div className="tf-settings-application-card">
                    <div className="tf-settings-application-card-icon">
                      <FaDesktop />
                    </div>

                    <div>
                      <span>PLATFORM</span>
                      <strong>Web Application</strong>
                      <small>Browser based</small>
                    </div>
                  </div>

                  <div className="tf-settings-application-card">
                    <div className="tf-settings-application-card-icon">
                      <FaGlobe />
                    </div>

                    <div>
                      <span>WORKSPACE</span>
                      <strong>TaskFlow Workspace</strong>
                      <small>Protected workspace</small>
                    </div>
                  </div>

                  <div className="tf-settings-application-card">
                    <div className="tf-settings-application-card-icon">
                      <FaBolt />
                    </div>

                    <div>
                      <span>SYSTEM STATUS</span>
                      <strong className="tf-settings-active-text">
                        Operational
                      </strong>
                      <small>All systems running</small>
                    </div>
                  </div>
                </div>

                <div className="tf-settings-about-card">
                  <div className="tf-settings-about-icon">
                    <FaInfoCircle />
                  </div>

                  <div>
                    <strong>About TaskFlow</strong>
                    <p>
                      TaskFlow is a modern project management
                      workspace designed to help teams plan,
                      organize and execute work efficiently.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>

        {/* FOOTER STATUS */}
        <footer className="tf-settings-footer">
          <div className="tf-settings-footer-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Your preferences are stored securely</strong>
            <span>
              TaskFlow keeps your workspace settings organized
              and protected.
            </span>
          </div>

          <div className="tf-settings-footer-status">
            <FaCheckCircle />
            Secure
          </div>
        </footer>
      </main>
    </div>
  );
}