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
  FaUndo,
  FaSave,
  FaEdit,
  FaEnvelope,
  FaTasks,
  FaProjectDiagram,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaDesktop,
  FaServer,
  FaDatabase,
  FaCode,
  FaGlobe,
  FaTimes,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";


// ============================================================
// SETTINGS ITEMS
// ============================================================

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


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {
  darkMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};


// ============================================================
// HELPERS
// ============================================================

const getUserName = (user) => {
  if (!user) return "Souradipta Patra";

  return (
    user.name ||
    user.username ||
    user.fullName ||
    "Souradipta Patra"
  );
};


const getUserEmail = (user) => {
  if (!user) return "soura@gmail.com";

  return (
    user.email ||
    user.emailAddress ||
    "soura@gmail.com"
  );
};


const getUserRole = (user) => {
  if (!user) return "Admin";

  return user.role || "Admin";
};


const getInitials = (name) => {
  if (!name) return "SP";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};


// ============================================================
// SETTINGS PAGE
// ============================================================

const Settings = () => {
  const { user } = useAuth();

  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [savedSettings, setSavedSettings] =
    useState(DEFAULT_SETTINGS);

  const [profileName, setProfileName] =
    useState(userName);

  const [profileEmail, setProfileEmail] =
    useState(userEmail);

  const [savedProfile, setSavedProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [editProfile, setEditProfile] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [saveMessage, setSaveMessage] =
    useState("All changes are currently saved");

  const [showProfileModal, setShowProfileModal] =
    useState(false);


  // ----------------------------------------------------------
  // CURRENT SETTINGS ITEM
  // ----------------------------------------------------------

  const activeItem = useMemo(() => {
    return (
      SETTINGS_ITEMS.find(
        (item) => item.id === activeSection
      ) || SETTINGS_ITEMS[0]
    );
  }, [activeSection]);


  // ----------------------------------------------------------
  // TOGGLE SETTINGS
  // ----------------------------------------------------------

  const updateSetting = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setSaveMessage("You have unsaved changes");
  };


  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

  const handleReset = () => {
    setSettings(savedSettings);

    setProfileName(savedProfile.name);
    setProfileEmail(savedProfile.email);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage("");

    setSaveMessage("All changes are currently saved");
  };


  // ----------------------------------------------------------
  // SAVE
  // ----------------------------------------------------------

  const handleSave = () => {
    setSavedSettings(settings);

    setSavedProfile({
      name: profileName,
      email: profileEmail,
    });

    setEditProfile(false);

    setSaveMessage("All changes are currently saved");
  };


  // ----------------------------------------------------------
  // PASSWORD
  // ----------------------------------------------------------

  const handlePasswordChange = () => {
    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordMessage(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "New password and confirmation do not match."
      );
      return;
    }

    setPasswordMessage(
      "Password validated successfully. Connect this action to your backend password endpoint."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };


  // ==========================================================
  // RENDER ACCOUNT
  // ==========================================================

  const renderAccount = () => (
    <div className="settings-section-content">

      <div className="profile-hero">

        <div className="profile-identity">

          <div className="large-avatar">
            {initials}
            <span className="avatar-status-dot" />
          </div>

          <div className="profile-main-info">

            <div className="profile-name-row">

              <h3>
                {profileName}
              </h3>

              <span className="admin-badge">
                {userRole}
              </span>

            </div>

            <p className="profile-email">
              {profileEmail}
            </p>

            <div className="profile-status-row">

              <span className="status-pill active">
                <FaCheckCircle />
                Active account
              </span>

              <span className="status-pill protected">
                <FaShieldAlt />
                Protected workspace
              </span>

            </div>

          </div>

        </div>

        <button
          type="button"
          className="edit-profile-button"
          onClick={() => setShowProfileModal(true)}
        >
          <FaEdit />
          <span>Edit profile</span>
        </button>

      </div>


      <div className="account-grid">

        <div className="information-card">

          <div className="information-icon purple">
            <FaUser />
          </div>

          <div className="information-content">

            <span className="information-label">
              FULL NAME
            </span>

            <strong>
              {profileName}
            </strong>

          </div>

        </div>


        <div className="information-card">

          <div className="information-icon blue">
            <FaEnvelope />
          </div>

          <div className="information-content">

            <span className="information-label">
              EMAIL ADDRESS
            </span>

            <strong>
              {profileEmail}
            </strong>

          </div>

        </div>


        <div className="information-card">

          <div className="information-icon purple">
            <FaShieldAlt />
          </div>

          <div className="information-content">

            <span className="information-label">
              ROLE
            </span>

            <strong>
              {userRole}
            </strong>

          </div>

        </div>


        <div className="information-card">

          <div className="information-icon green">
            <FaCheckCircle />
          </div>

          <div className="information-content">

            <span className="information-label">
              ACCOUNT STATUS
            </span>

            <strong className="green-text">
              Active
            </strong>

          </div>

        </div>

      </div>


      <div className="protected-card">

        <div className="protected-icon">
          <FaShieldAlt />
        </div>

        <div>

          <h4>
            Protected workspace
          </h4>

          <p>
            Your TaskFlow account information is securely
            associated with your workspace.
          </p>

        </div>

        <FaCheckCircle className="protected-check" />

      </div>

    </div>
  );


  // ==========================================================
  // RENDER APPEARANCE
  // ==========================================================

  const renderAppearance = () => (
    <div className="settings-section-content">

      <div className="section-intro-card">

        <div className="intro-icon">
          <FaPalette />
        </div>

        <div>
          <h3>
            Workspace appearance
          </h3>

          <p>
            Customize the visual experience of your
            TaskFlow workspace.
          </p>
        </div>

      </div>


      <div className="appearance-options">

        <button
          type="button"
          className={`theme-option ${
            !settings.darkMode
              ? "selected"
              : ""
          }`}
          onClick={() => {
            setSettings((previous) => ({
              ...previous,
              darkMode: false,
            }));

            setSaveMessage(
              "You have unsaved changes"
            );
          }}
        >

          <div className="theme-preview light-preview">
            <FaSun />
          </div>

          <div className="theme-option-content">

            <strong>
              Light mode
            </strong>

            <span>
              Clean and bright workspace
            </span>

          </div>

          <span className="radio-indicator">
            {!settings.darkMode && <span />}
          </span>

        </button>


        <button
          type="button"
          className={`theme-option ${
            settings.darkMode
              ? "selected"
              : ""
          }`}
          onClick={() => {
            setSettings((previous) => ({
              ...previous,
              darkMode: true,
            }));

            setSaveMessage(
              "You have unsaved changes"
            );
          }}
        >

          <div className="theme-preview dark-preview">
            <FaMoon />
          </div>

          <div className="theme-option-content">

            <strong>
              Dark mode
            </strong>

            <span>
              Comfortable low-light workspace
            </span>

          </div>

          <span className="radio-indicator">
            {settings.darkMode && <span />}
          </span>

        </button>

      </div>


      <div className="setting-row">

        <div className="setting-row-icon">
          <FaPalette />
        </div>

        <div className="setting-row-content">

          <strong>
            Interface theme
          </strong>

          <span>
            {settings.darkMode
              ? "Dark theme selected"
              : "Light theme selected"}
          </span>

        </div>

        <div
          className={`toggle ${
            settings.darkMode
              ? "on"
              : ""
          }`}
          onClick={() =>
            updateSetting("darkMode")
          }
        >
          <span />
        </div>

      </div>

    </div>
  );


  // ==========================================================
  // RENDER NOTIFICATIONS
  // ==========================================================

  const renderNotifications = () => (
    <div className="settings-section-content">

      <div className="section-intro-card">

        <div className="intro-icon">
          <FaBell />
        </div>

        <div>
          <h3>
            Notification preferences
          </h3>

          <p>
            Choose which TaskFlow alerts you want
            to receive.
          </p>
        </div>

      </div>


      <div className="notification-list">

        <div className="setting-row">

          <div className="setting-row-icon">
            <FaEnvelope />
          </div>

          <div className="setting-row-content">

            <strong>
              Email notifications
            </strong>

            <span>
              Receive important workspace updates by email.
            </span>

          </div>

          <button
            type="button"
            className={`toggle ${
              settings.emailNotifications
                ? "on"
                : ""
            }`}
            onClick={() =>
              updateSetting(
                "emailNotifications"
              )
            }
          >
            <span />
          </button>

        </div>


        <div className="setting-row">

          <div className="setting-row-icon">
            <FaTasks />
          </div>

          <div className="setting-row-content">

            <strong>
              Task notifications
            </strong>

            <span>
              Get notified about task assignments,
              updates and deadlines.
            </span>

          </div>

          <button
            type="button"
            className={`toggle ${
              settings.taskNotifications
                ? "on"
                : ""
            }`}
            onClick={() =>
              updateSetting(
                "taskNotifications"
              )
            }
          >
            <span />
          </button>

        </div>


        <div className="setting-row">

          <div className="setting-row-icon">
            <FaProjectDiagram />
          </div>

          <div className="setting-row-content">

            <strong>
              Project notifications
            </strong>

            <span>
              Stay updated when projects change.
            </span>

          </div>

          <button
            type="button"
            className={`toggle ${
              settings.projectNotifications
                ? "on"
                : ""
            }`}
            onClick={() =>
              updateSetting(
                "projectNotifications"
              )
            }
          >
            <span />
          </button>

        </div>

      </div>

    </div>
  );


  // ==========================================================
  // PASSWORD INPUT
  // ==========================================================

  const PasswordInput = ({
    label,
    value,
    onChange,
    visible,
    onToggle,
  }) => (
    <div className="password-field">

      <label>
        {label}
      </label>

      <div className="password-input-wrapper">

        <FaKey className="password-key-icon" />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
        />

        <button
          type="button"
          className="password-eye"
          onClick={onToggle}
        >
          {visible ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>

      </div>

    </div>
  );


  // ==========================================================
  // RENDER SECURITY
  // ==========================================================

  const renderSecurity = () => (
    <div className="settings-section-content">

      <div className="section-intro-card">

        <div className="intro-icon">
          <FaLock />
        </div>

        <div>
          <h3>
            Password and security
          </h3>

          <p>
            Keep your TaskFlow account protected
            with a strong password.
          </p>
        </div>

      </div>


      <div className="security-card">

        <div className="security-card-header">

          <div>
            <h3>
              Change password
            </h3>

            <p>
              Use a password with at least 6 characters.
            </p>
          </div>

          <div className="security-header-icon">
            <FaLock />
          </div>

        </div>


        <div className="password-grid">

          <PasswordInput
            label="Current password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(
                event.target.value
              )
            }
            visible={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword(
                (previous) => !previous
              )
            }
          />


          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword(
                (previous) => !previous
              )
            }
          />

        </div>


        <PasswordInput
          label="Confirm new password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
          visible={showConfirmPassword}
          onToggle={() =>
            setShowConfirmPassword(
              (previous) => !previous
            )
          }
        />


        {passwordMessage && (
          <div
            className={`password-message ${
              passwordMessage.includes(
                "successfully"
              )
                ? "success"
                : "error"
            }`}
          >
            <FaInfoCircle />
            {passwordMessage}
          </div>
        )}


        <button
          type="button"
          className="change-password-button"
          onClick={handlePasswordChange}
        >
          <FaLock />
          Update password
        </button>

      </div>

    </div>
  );


  // ==========================================================
  // RENDER APPLICATION
  // ==========================================================

  const renderApplication = () => (
    <div className="settings-section-content">

      <div className="section-intro-card">

        <div className="intro-icon">
          <FaCog />
        </div>

        <div>
          <h3>
            TaskFlow information
          </h3>

          <p>
            Information about your TaskFlow
            application and environment.
          </p>
        </div>

      </div>


      <div className="application-brand-card">

        <div className="taskflow-app-logo">
          TF
        </div>

        <div className="application-brand-content">

          <span>
            PROJECT MANAGEMENT PLATFORM
          </span>

          <h3>
            TaskFlow
          </h3>

          <p>
            A modern workspace for managing projects,
            tasks, teams and productivity.
          </p>

        </div>

        <div className="application-version">

          <span>
            VERSION
          </span>

          <strong>
            1.0.0
          </strong>

        </div>

      </div>


      <div className="application-grid">

        <div className="application-info-card">

          <div className="application-info-icon">
            <FaDesktop />
          </div>

          <span>
            PLATFORM
          </span>

          <strong>
            Web Application
          </strong>

        </div>


        <div className="application-info-card">

          <div className="application-info-icon">
            <FaGlobe />
          </div>

          <span>
            ENVIRONMENT
          </span>

          <strong>
            Production
          </strong>

        </div>


        <div className="application-info-card">

          <div className="application-info-icon">
            <FaServer />
          </div>

          <span>
            BACKEND
          </span>

          <strong>
            Node.js / Express
          </strong>

        </div>


        <div className="application-info-card">

          <div className="application-info-icon">
            <FaDatabase />
          </div>

          <span>
            DATABASE
          </span>

          <strong>
            MongoDB
          </strong>

        </div>


        <div className="application-info-card">

          <div className="application-info-icon">
            <FaCode />
          </div>

          <span>
            FRONTEND
          </span>

          <strong>
            React + Vite
          </strong>

        </div>


        <div className="application-info-card">

          <div className="application-info-icon">
            <FaShieldAlt />
          </div>

          <span>
            SYSTEM STATUS
          </span>

          <strong className="green-text">
            Operational
          </strong>

        </div>

      </div>


      <div className="about-taskflow-card">

        <div className="about-icon">
          <FaInfoCircle />
        </div>

        <div>

          <h4>
            About TaskFlow
          </h4>

          <p>
            TaskFlow is designed to provide a centralized,
            organized and secure environment for modern
            project management.
          </p>

        </div>

        <span className="operational-badge">
          <FaCheckCircle />
          Operational
        </span>

      </div>

    </div>
  );


  // ==========================================================
  // PROFILE MODAL
  // ==========================================================

  const renderProfileModal = () => {
    if (!showProfileModal) return null;

    return (
      <div
        className="profile-modal-overlay"
        onClick={() =>
          setShowProfileModal(false)
        }
      >

        <div
          className="profile-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <div className="profile-modal-header">

            <div>
              <span>
                ACCOUNT
              </span>

              <h3>
                Edit profile
              </h3>

              <p>
                Update your TaskFlow profile information.
              </p>
            </div>

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowProfileModal(false)
              }
            >
              <FaTimes />
            </button>

          </div>


          <div className="modal-avatar">
            {getInitials(profileName)}
          </div>


          <div className="modal-form">

            <div className="modal-field">

              <label>
                Full name
              </label>

              <input
                type="text"
                value={profileName}
                onChange={(event) => {
                  setProfileName(
                    event.target.value
                  );
                  setSaveMessage(
                    "You have unsaved changes"
                  );
                }}
              />

            </div>


            <div className="modal-field">

              <label>
                Email address
              </label>

              <input
                type="email"
                value={profileEmail}
                onChange={(event) => {
                  setProfileEmail(
                    event.target.value
                  );
                  setSaveMessage(
                    "You have unsaved changes"
                  );
                }}
              />

            </div>

          </div>


          <div className="profile-modal-actions">

            <button
              type="button"
              className="modal-cancel"
              onClick={() =>
                setShowProfileModal(false)
              }
            >
              Cancel
            </button>

            <button
              type="button"
              className="modal-save"
              onClick={() => {
                setSavedProfile({
                  name: profileName,
                  email: profileEmail,
                });

                setEditProfile(true);

                setShowProfileModal(false);

                setSaveMessage(
                  "Profile changes are ready to be saved"
                );
              }}
            >
              <FaSave />
              Save profile
            </button>

          </div>

        </div>

      </div>
    );
  };


  // ==========================================================
  // MAIN CONTENT
  // ==========================================================

  const renderActiveContent = () => {
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


  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div className="settings-page">

      {/* EXISTING GLOBAL NAVIGATION */}
      <Navbar />
      <Sidebar />


      {/* PREMIUM BACKGROUND */}

      <div className="settings-background">

        <div className="settings-grid-bg" />

        <div className="settings-orb orb-one" />
        <div className="settings-orb orb-two" />
        <div className="settings-orb orb-three" />

      </div>


      {/* PAGE CONTENT */}

      <main className="settings-main">

        <div className="settings-container">


          {/* PAGE HEADER */}

          <header className="settings-page-header">

            <div>

              <div className="settings-breadcrumb">
                <span>
                  WORKSPACE
                </span>

                <FaChevronRight />

                <strong>
                  SETTINGS
                </strong>
              </div>


              <h1>
                Settings
              </h1>

              <p>
                Manage your account, workspace preferences,
                notifications and security.
              </p>

            </div>


            <div className="workspace-secure-badge">

              <FaShieldAlt />

              <span>
                Workspace secure
              </span>

            </div>

          </header>


          {/* SETTINGS PANEL */}

          <section className="settings-panel">


            {/* LEFT SETTINGS NAV */}

            <aside className="settings-navigation">

              <div className="settings-nav-title">
                SETTINGS
              </div>


              <div className="settings-nav-items">

                {SETTINGS_ITEMS.map((item) => {

                  const Icon = item.icon;

                  const isActive =
                    activeSection === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`settings-nav-item ${
                        isActive
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveSection(item.id)
                      }
                    >

                      <div className="settings-nav-icon">
                        <Icon />
                      </div>

                      <div className="settings-nav-text">

                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.description}
                        </span>

                      </div>

                      <FaChevronRight className="settings-nav-arrow" />

                    </button>
                  );

                })}

              </div>


              {/* PROTECTED WORKSPACE */}

              <div className="navigation-security-card">

                <div className="navigation-security-icon">
                  <FaShieldAlt />
                </div>

                <div>

                  <strong>
                    Protected workspace
                  </strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>

                </div>

                <FaCheckCircle className="navigation-security-check" />

              </div>

            </aside>


            {/* RIGHT CONTENT */}

            <div className="settings-content">


              {/* CONTENT HEADER */}

              <div className="settings-content-header">

                <div>

                  <span className="content-eyebrow">
                    {activeItem.title.toUpperCase()}
                  </span>

                  <h2>
                    {activeSection === "account" &&
                      "Account information"}

                    {activeSection === "appearance" &&
                      "Appearance"}

                    {activeSection === "notifications" &&
                      "Notifications"}

                    {activeSection === "security" &&
                      "Security"}

                    {activeSection === "application" &&
                      "TaskFlow information"}
                  </h2>

                  <p>
                    {activeItem.description}
                  </p>

                </div>


                <div className="content-header-icon">
                  <activeItem.icon />
                </div>

              </div>


              {/* ACTIVE SECTION */}

              <div className="settings-content-body">

                {renderActiveContent()}

              </div>


              {/* FOOTER ACTIONS */}

              <div className="settings-panel-footer">

                <div className="save-status">

                  <span className="save-status-dot" />

                  <div>

                    <strong>
                      {saveMessage}
                    </strong>

                    <span>
                      Your workspace preferences stay
                      organized and protected.
                    </span>

                  </div>

                </div>


                <div className="footer-actions">

                  <button
                    type="button"
                    className="reset-button"
                    onClick={handleReset}
                  >
                    <FaUndo />
                    Reset
                  </button>


                  <button
                    type="button"
                    className="save-button"
                    onClick={handleSave}
                  >
                    <FaSave />
                    Save changes
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* SECURITY FOOTER */}

          <div className="settings-security-footer">

            <div className="security-footer-icon">
              <FaShieldAlt />
            </div>

            <div className="security-footer-content">

              <strong>
                Your preferences are stored securely
              </strong>

              <span>
                TaskFlow keeps your workspace settings
                organized and protected.
              </span>

            </div>

            <div className="secure-label">
              <FaCheckCircle />
              Secure
            </div>

          </div>

        </div>

      </main>


      {/* EDIT PROFILE MODAL */}

      {renderProfileModal()}

    </div>
  );
};


export default Settings;