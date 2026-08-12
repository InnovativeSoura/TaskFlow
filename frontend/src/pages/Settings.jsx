import React, { useEffect, useMemo, useState } from "react";
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
  FaEnvelope,
  FaKey,
  FaDesktop,
  FaDatabase,
  FaCode,
  FaServer,
  FaGlobe,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Settings.css";


/* =========================================================
   SETTINGS CONFIGURATION
========================================================= */

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
  compactMode: false,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  securityNotifications: true,
};


const DEFAULT_PROFILE = {
  name: "Souradipta Patra",
  email: "soura@gmail.com",
  role: "Admin",
};


/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "SP";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};


const getStoredObject = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Settings() {
  /* -------------------------------------------------------
     AUTH USER
  ------------------------------------------------------- */

  let authUser = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = require("../context/AuthContext").useAuth();
    authUser = user;
  } catch {
    authUser = null;
  }


  /* -------------------------------------------------------
     INITIAL USER DATA
  ------------------------------------------------------- */

  const initialProfile = useMemo(() => {
    const storedProfile = getStoredObject(
      "taskflow_settings_profile",
      {}
    );

    return {
      ...DEFAULT_PROFILE,
      ...(authUser || {}),
      ...storedProfile,
      name:
        storedProfile.name ||
        authUser?.name ||
        authUser?.username ||
        DEFAULT_PROFILE.name,
      email:
        storedProfile.email ||
        authUser?.email ||
        DEFAULT_PROFILE.email,
      role:
        storedProfile.role ||
        authUser?.role ||
        DEFAULT_PROFILE.role,
    };
  }, [authUser]);


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [activeSection, setActiveSection] = useState("account");

  const [profile, setProfile] = useState(initialProfile);

  const [draftProfile, setDraftProfile] = useState(initialProfile);

  const [settings, setSettings] = useState(() =>
    getStoredObject(
      "taskflow_settings_preferences",
      DEFAULT_SETTINGS
    )
  );

  const [draftSettings, setDraftSettings] = useState(() =>
    getStoredObject(
      "taskflow_settings_preferences",
      DEFAULT_SETTINGS
    )
  );


  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });


  /* -------------------------------------------------------
     EFFECTS
  ------------------------------------------------------- */

  useEffect(() => {
    document.body.classList.toggle(
      "settings-dark-mode",
      draftSettings.darkMode
    );

    return () => {
      document.body.classList.remove(
        "settings-dark-mode"
      );
    };
  }, [draftSettings.darkMode]);


  /* -------------------------------------------------------
     ACTIVE SECTION
  ------------------------------------------------------- */

  const activeItem = SETTINGS_ITEMS.find(
    (item) => item.id === activeSection
  );


  /* -------------------------------------------------------
     PROFILE HANDLERS
  ------------------------------------------------------- */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setDraftProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleEditProfile = () => {
    setDraftProfile(profile);
    setIsEditingProfile(true);
  };


  const handleCancelProfileEdit = () => {
    setDraftProfile(profile);
    setIsEditingProfile(false);
  };


  const handleSaveProfile = () => {
    if (!draftProfile.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!draftProfile.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    const updatedProfile = {
      ...profile,
      name: draftProfile.name.trim(),
      email: draftProfile.email.trim(),
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "taskflow_settings_profile",
      JSON.stringify(updatedProfile)
    );

    setIsEditingProfile(false);

    toast.success("Profile information saved successfully.");
  };


  /* -------------------------------------------------------
     SETTINGS HANDLERS
  ------------------------------------------------------- */

  const updateSetting = (key, value) => {
    setDraftSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };


  const handleSaveSettings = () => {
    setSettings(draftSettings);

    localStorage.setItem(
      "taskflow_settings_preferences",
      JSON.stringify(draftSettings)
    );

    toast.success("Settings saved successfully.");
  };


  const handleResetSettings = () => {
    setDraftSettings(settings);
    setDraftProfile(profile);

    toast.info("Unsaved changes have been reset.");
  };


  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage({
      type: "",
      text: "",
    });
  };


  const handlePasswordUpdate = (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;


    if (!currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please enter your current password.",
      });

      return;
    }


    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });

      return;
    }


    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });

      return;
    }


    /*
      IMPORTANT:
      This is frontend validation only.

      Connect this handler to your backend password
      endpoint when your password API is ready.
    */

    setPasswordMessage({
      type: "success",
      text: "Password validation completed successfully.",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Security settings updated.");
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="settings-page">

      {/* ===================================================
          PREMIUM BACKGROUND
      =================================================== */}

      <div className="settings-background">
        <div className="settings-bg-grid" />

        <div className="settings-bg-orb settings-bg-orb-one" />
        <div className="settings-bg-orb settings-bg-orb-two" />
        <div className="settings-bg-orb settings-bg-orb-three" />

        <div className="settings-bg-glow settings-bg-glow-one" />
        <div className="settings-bg-glow settings-bg-glow-two" />
      </div>


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar />


      {/* ===================================================
          MAIN APPLICATION AREA
      =================================================== */}

      <div className="settings-app">

        {/* YOUR EXISTING NAVBAR */}
        <Navbar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="settings-main">

          {/* ------------------------------------------------
              PAGE HEADER
          ------------------------------------------------ */}

          <section className="settings-page-header">

            <div className="settings-header-left">

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


            <div className="workspace-secure-badge">
              <span className="secure-dot" />
              <FaShieldAlt />
              <span>Workspace secure</span>
            </div>

          </section>


          {/* =================================================
              MAIN SETTINGS CARD
          ================================================= */}

          <section className="settings-card">

            {/* ===============================================
                SETTINGS SIDEBAR
            =============================================== */}

            <aside className="settings-navigation">

              <div className="settings-nav-title">
                SETTINGS
              </div>


              <div className="settings-nav-list">

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


                      <span className="settings-nav-copy">

                        <strong>
                          {item.label}
                        </strong>

                        <small>
                          {item.description}
                        </small>

                      </span>


                      <FaChevronRight className="settings-nav-arrow" />

                    </button>
                  );
                })}

              </div>


              {/* ------------------------------------------------
                  NAVIGATION SECURITY CARD
              ------------------------------------------------ */}

              <div className="navigation-security-card">

                <div className="security-card-icon">
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

                <FaCheckCircle className="security-card-check" />

              </div>

            </aside>


            {/* ===============================================
                SETTINGS CONTENT
            =============================================== */}

            <section className="settings-content">

              {/* ---------------------------------------------
                  CONTENT HEADER
              --------------------------------------------- */}

              <header className="settings-content-header">

                <div>

                  <span className="content-eyebrow">
                    {activeItem?.label.toUpperCase()}
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
                    {activeSection === "account" &&
                      "Manage your personal identity and TaskFlow workspace information."}

                    {activeSection === "appearance" &&
                      "Customize the way TaskFlow looks and behaves on your device."}

                    {activeSection === "notifications" &&
                      "Choose which notifications and updates you want to receive."}

                    {activeSection === "security" &&
                      "Manage your password and keep your TaskFlow account protected."}

                    {activeSection === "application" &&
                      "Information about your TaskFlow application and current environment."}
                  </p>

                </div>


                <div className="content-header-icon">

                  {activeSection === "account" && <FaUser />}

                  {activeSection === "appearance" && <FaPalette />}

                  {activeSection === "notifications" && <FaBell />}

                  {activeSection === "security" && <FaLock />}

                  {activeSection === "application" && <FaCog />}

                </div>

              </header>


              {/* =================================================
                  ACCOUNT
              ================================================= */}

              {activeSection === "account" && (
                <div className="settings-section">

                  {/* PROFILE HERO */}

                  <div className="profile-hero">

                    <div className="profile-avatar">
                      {getInitials(profile.name)}
                      <span className="avatar-online" />
                    </div>


                    <div className="profile-identity">

                      <div className="profile-name-row">

                        <h3>
                          {profile.name}
                        </h3>

                        <span className="admin-badge">
                          {profile.role}
                        </span>

                      </div>


                      <p>
                        {profile.email}
                      </p>


                      <div className="profile-status-row">

                        <span>
                          <FaCircle />
                          Active account
                        </span>

                        <span>
                          <FaShieldAlt />
                          Protected workspace
                        </span>

                      </div>

                    </div>


                    {!isEditingProfile && (
                      <button
                        className="profile-edit-button"
                        type="button"
                        onClick={handleEditProfile}
                      >
                        <FaEdit />
                        Edit profile
                      </button>
                    )}

                  </div>


                  {/* EDIT PROFILE */}

                  {isEditingProfile && (
                    <div className="edit-profile-panel">

                      <div className="panel-heading">

                        <div>
                          <span>
                            PROFILE
                          </span>

                          <h3>
                            Edit your information
                          </h3>
                        </div>

                        <button
                          type="button"
                          className="close-edit-button"
                          onClick={handleCancelProfileEdit}
                        >
                          <FaTimes />
                        </button>

                      </div>


                      <div className="form-grid">

                        <div className="form-group">

                          <label>
                            FULL NAME
                          </label>

                          <div className="input-with-icon">
                            <FaUser />

                            <input
                              type="text"
                              name="name"
                              value={draftProfile.name}
                              onChange={handleProfileChange}
                              placeholder="Enter your full name"
                            />
                          </div>

                        </div>


                        <div className="form-group">

                          <label>
                            EMAIL ADDRESS
                          </label>

                          <div className="input-with-icon">
                            <FaEnvelope />

                            <input
                              type="email"
                              name="email"
                              value={draftProfile.email}
                              onChange={handleProfileChange}
                              placeholder="Enter your email"
                            />
                          </div>

                        </div>

                      </div>


                      <div className="edit-actions">

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={handleCancelProfileEdit}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={handleSaveProfile}
                        >
                          <FaSave />
                          Save profile
                        </button>

                      </div>

                    </div>
                  )}


                  {/* ACCOUNT INFORMATION */}

                  <div className="information-grid">

                    <div className="information-box">

                      <div className="information-icon purple">
                        <FaUser />
                      </div>

                      <div>
                        <span>
                          FULL NAME
                        </span>

                        <strong>
                          {profile.name}
                        </strong>
                      </div>

                    </div>


                    <div className="information-box">

                      <div className="information-icon blue">
                        <FaEnvelope />
                      </div>

                      <div>
                        <span>
                          EMAIL ADDRESS
                        </span>

                        <strong>
                          {profile.email}
                        </strong>
                      </div>

                    </div>


                    <div className="information-box">

                      <div className="information-icon purple">
                        <FaShieldAlt />
                      </div>

                      <div>
                        <span>
                          ROLE
                        </span>

                        <strong>
                          {profile.role}
                        </strong>
                      </div>

                    </div>


                    <div className="information-box">

                      <div className="information-icon green">
                        <FaCheckCircle />
                      </div>

                      <div>
                        <span>
                          ACCOUNT STATUS
                        </span>

                        <strong className="active-text">
                          Active
                        </strong>
                      </div>

                    </div>

                  </div>


                  {/* PROTECTED WORKSPACE */}

                  <div className="protected-workspace">

                    <div className="protected-icon">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <strong>
                        Protected workspace
                      </strong>

                      <p>
                        Your TaskFlow account information is securely
                        associated with your workspace.
                      </p>

                    </div>

                    <FaCheckCircle className="protected-check" />

                  </div>

                </div>
              )}


              {/* =================================================
                  APPEARANCE
              ================================================= */}

              {activeSection === "appearance" && (
                <div className="settings-section">

                  <div className="appearance-preview">

                    <div className="preview-text">

                      <span>
                        THEME PREVIEW
                      </span>

                      <h3>
                        Make TaskFlow feel like yours.
                      </h3>

                      <p>
                        Choose the visual experience that works
                        best for your workspace.
                      </p>

                    </div>

                    <div className="preview-window">

                      <div className="preview-window-top">
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="preview-window-body">

                        <div className="preview-sidebar" />

                        <div className="preview-content">

                          <div />
                          <div />
                          <div />

                        </div>

                      </div>

                    </div>

                  </div>


                  <div className="preference-title">
                    Theme preferences
                  </div>


                  <div className="option-grid">

                    <button
                      type="button"
                      className={`theme-option ${
                        !draftSettings.darkMode
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateSetting("darkMode", false)
                      }
                    >

                      <div className="theme-icon light">
                        <FaSun />
                      </div>

                      <div>
                        <strong>
                          Light mode
                        </strong>

                        <span>
                          Clean and bright workspace
                        </span>
                      </div>

                      {!draftSettings.darkMode && (
                        <FaCheckCircle />
                      )}

                    </button>


                    <button
                      type="button"
                      className={`theme-option ${
                        draftSettings.darkMode
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateSetting("darkMode", true)
                      }
                    >

                      <div className="theme-icon dark">
                        <FaMoon />
                      </div>

                      <div>
                        <strong>
                          Dark mode
                        </strong>

                        <span>
                          Comfortable low-light experience
                        </span>
                      </div>

                      {draftSettings.darkMode && (
                        <FaCheckCircle />
                      )}

                    </button>

                  </div>


                  <div className="toggle-list">

                    <ToggleRow
                      icon={FaDesktop}
                      title="Compact workspace"
                      description="Reduce spacing across TaskFlow for a denser workspace."
                      checked={draftSettings.compactMode}
                      onChange={(value) =>
                        updateSetting("compactMode", value)
                      }
                    />

                  </div>

                </div>
              )}


              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}

              {activeSection === "notifications" && (
                <div className="settings-section">

                  <div className="notification-intro">

                    <div className="notification-intro-icon">
                      <FaBell />
                    </div>

                    <div>
                      <h3>
                        Stay informed without the noise.
                      </h3>

                      <p>
                        Control which TaskFlow events should
                        generate notifications.
                      </p>
                    </div>

                  </div>


                  <div className="toggle-list">

                    <ToggleRow
                      icon={FaEnvelope}
                      title="Email notifications"
                      description="Receive important TaskFlow updates through email."
                      checked={draftSettings.emailNotifications}
                      onChange={(value) =>
                        updateSetting(
                          "emailNotifications",
                          value
                        )
                      }
                    />


                    <ToggleRow
                      icon={FaCheckCircle}
                      title="Task notifications"
                      description="Get notified when tasks are assigned, completed or updated."
                      checked={draftSettings.taskNotifications}
                      onChange={(value) =>
                        updateSetting(
                          "taskNotifications",
                          value
                        )
                      }
                    />


                    <ToggleRow
                      icon={FaCode}
                      title="Project notifications"
                      description="Receive updates about projects and workspace activity."
                      checked={draftSettings.projectNotifications}
                      onChange={(value) =>
                        updateSetting(
                          "projectNotifications",
                          value
                        )
                      }
                    />


                    <ToggleRow
                      icon={FaShieldAlt}
                      title="Security notifications"
                      description="Always receive important account and security alerts."
                      checked={draftSettings.securityNotifications}
                      onChange={(value) =>
                        updateSetting(
                          "securityNotifications",
                          value
                        )
                      }
                      locked
                    />

                  </div>

                </div>
              )}


              {/* =================================================
                  SECURITY
              ================================================= */}

              {activeSection === "security" && (
                <div className="settings-section">

                  <div className="security-summary">

                    <div className="security-score-icon">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <span>
                        SECURITY STATUS
                      </span>

                      <h3>
                        Your account is protected
                      </h3>

                      <p>
                        Keep your password strong and unique
                        to maintain account security.
                      </p>

                    </div>

                    <div className="security-status">
                      <FaCheckCircle />
                      Secure
                    </div>

                  </div>


                  <form
                    className="password-form"
                    onSubmit={handlePasswordUpdate}
                  >

                    <div className="password-form-heading">

                      <div className="password-heading-icon">
                        <FaKey />
                      </div>

                      <div>
                        <h3>
                          Change password
                        </h3>

                        <p>
                          Update your TaskFlow account password.
                        </p>
                      </div>

                    </div>


                    <PasswordField
                      label="CURRENT PASSWORD"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      visible={showCurrentPassword}
                      setVisible={setShowCurrentPassword}
                    />


                    <div className="password-grid">

                      <PasswordField
                        label="NEW PASSWORD"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        visible={showNewPassword}
                        setVisible={setShowNewPassword}
                      />


                      <PasswordField
                        label="CONFIRM PASSWORD"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        visible={showConfirmPassword}
                        setVisible={setShowConfirmPassword}
                      />

                    </div>


                    {passwordMessage.text && (
                      <div
                        className={`password-message ${
                          passwordMessage.type
                        }`}
                      >
                        {passwordMessage.type ===
                        "success" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaTimes />
                        )}

                        {passwordMessage.text}
                      </div>
                    )}


                    <div className="password-requirements">

                      <span>
                        Password requirements
                      </span>

                      <div>
                        <Requirement
                          valid={
                            passwordData.newPassword.length >=
                            6
                          }
                          text="At least 6 characters"
                        />

                        <Requirement
                          valid={
                            /[A-Z]/.test(
                              passwordData.newPassword
                            )
                          }
                          text="One uppercase letter"
                        />

                        <Requirement
                          valid={
                            /[0-9]/.test(
                              passwordData.newPassword
                            )
                          }
                          text="One number"
                        />

                      </div>

                    </div>


                    <div className="password-actions">

                      <button
                        type="submit"
                        className="primary-button"
                      >
                        <FaLock />
                        Update password
                      </button>

                    </div>

                  </form>

                </div>
              )}


              {/* =================================================
                  APPLICATION
              ================================================= */}

              {activeSection === "application" && (
                <div className="settings-section">

                  <div className="application-hero">

                    <div className="taskflow-logo-box">
                      TF
                    </div>

                    <div>

                      <span>
                        PROJECT MANAGEMENT PLATFORM
                      </span>

                      <h3>
                        TaskFlow
                      </h3>

                      <p>
                        A modern workspace for managing
                        projects, tasks, teams and productivity.
                      </p>

                    </div>

                    <div className="version-box">

                      <span>
                        VERSION
                      </span>

                      <strong>
                        1.0.0
                      </strong>

                    </div>

                  </div>


                  <div className="application-grid">

                    <ApplicationInfo
                      icon={FaGlobe}
                      label="PLATFORM"
                      value="Web Application"
                    />

                    <ApplicationInfo
                      icon={FaServer}
                      label="ENVIRONMENT"
                      value="Production"
                    />

                    <ApplicationInfo
                      icon={FaCode}
                      label="BACKEND"
                      value="Node.js / Express"
                    />

                    <ApplicationInfo
                      icon={FaDatabase}
                      label="DATABASE"
                      value="MongoDB"
                    />

                    <ApplicationInfo
                      icon={FaCode}
                      label="FRONTEND"
                      value="React + Vite"
                    />

                    <ApplicationInfo
                      icon={FaShieldAlt}
                      label="SYSTEM STATUS"
                      value="Operational"
                      status
                    />

                  </div>


                  <div className="application-about">

                    <div className="application-about-icon">
                      <FaInfoCircle />
                    </div>

                    <div>

                      <strong>
                        About TaskFlow
                      </strong>

                      <p>
                        TaskFlow is designed to provide a
                        centralized, organized and secure
                        environment for modern project
                        management.
                      </p>

                    </div>

                    <span className="operational-badge">
                      <FaCheckCircle />
                      Operational
                    </span>

                  </div>

                </div>
              )}


              {/* =================================================
                  FOOTER ACTIONS
              ================================================= */}

              <footer className="settings-footer">

                <div className="changes-status">

                  <span className="changes-dot" />

                  <div>

                    <strong>
                      All changes are currently saved
                    </strong>

                    <span>
                      Your workspace preferences stay organized
                      and protected.
                    </span>

                  </div>

                </div>


                <div className="footer-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleResetSettings}
                  >
                    <FaUndo />
                    Reset
                  </button>


                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleSaveSettings}
                  >
                    <FaSave />
                    Save changes
                  </button>

                </div>

              </footer>

            </section>

          </section>


          {/* =================================================
              SECURITY BANNER
          ================================================= */}

          <section className="settings-security-banner">

            <div className="security-banner-icon">
              <FaShieldAlt />
            </div>

            <div className="security-banner-content">

              <strong>
                Your preferences are stored securely
              </strong>

              <p>
                TaskFlow keeps your workspace settings
                organized and protected.
              </p>

            </div>

            <div className="secure-label">
              <FaCheckCircle />
              Secure
            </div>

          </section>

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   TOGGLE COMPONENT
========================================================= */

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  locked = false,
}) {
  return (
    <div className="toggle-row">

      <div className="toggle-row-icon">
        <Icon />
      </div>

      <div className="toggle-row-content">

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>


      <button
        type="button"
        className={`toggle-switch ${
          checked ? "checked" : ""
        } ${locked ? "locked" : ""}`}
        onClick={() => {
          if (!locked) {
            onChange(!checked);
          }
        }}
        aria-label={title}
        aria-pressed={checked}
      >

        <span />

      </button>

    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  setVisible,
}) {
  return (
    <div className="form-group">

      <label>
        {label}
      </label>

      <div className="password-input">

        <FaLock />

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={() =>
            setVisible((previous) => !previous)
          }
          aria-label="Toggle password visibility"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function Requirement({ valid, text }) {
  return (
    <span className={valid ? "valid" : ""}>
      {valid ? <FaCheck /> : <FaCircle />}
      {text}
    </span>
  );
}


/* =========================================================
   APPLICATION INFO
========================================================= */

function ApplicationInfo({
  icon: Icon,
  label,
  value,
  status = false,
}) {
  return (
    <div className="application-info-box">

      <div className="application-info-icon">
        <Icon />
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <FaCheckCircle
        className={
          status
            ? "application-status-icon"
            : "application-check"
        }
      />

    </div>
  );
}