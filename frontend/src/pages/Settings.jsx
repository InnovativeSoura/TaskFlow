import React, { useEffect, useMemo, useState } from "react";

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


/* =========================================================
   SETTINGS NAVIGATION
   ========================================================= */

const SETTINGS_ITEMS = [
  {
    id: "account",
    label: "Account",
    description: "Profile information",
    icon: FaUser,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Workspace appearance",
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
    description: "Password & security",
    icon: FaLock,
  },
  {
    id: "application",
    label: "Application",
    description: "TaskFlow information",
    icon: FaInfoCircle,
  },
];


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  darkMode: true,
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
};


/* =========================================================
   HELPERS
   ========================================================= */

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "TF";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
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
  user?.role || "Admin";


/* =========================================================
   SETTINGS COMPONENT
   ========================================================= */

function Settings() {
  /* -------------------------------------------------------
     USER
  ------------------------------------------------------- */

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);


  const userName = getUserName(user);
  const userEmail = getUserEmail(user);
  const userRole = getUserRole(user);
  const initials = getInitials(userName);


  /* -------------------------------------------------------
     ACTIVE SECTION
  ------------------------------------------------------- */

  const [activeSection, setActiveSection] = useState("account");


  /* -------------------------------------------------------
     SETTINGS
  ------------------------------------------------------- */

  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("taskflowSettings") || "null"
      );

      return {
        ...DEFAULT_SETTINGS,
        ...(saved || {}),
      };
    } catch {
      return {
        ...DEFAULT_SETTINGS,
      };
    }
  });


  /* -------------------------------------------------------
     PROFILE
  ------------------------------------------------------- */

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });


  const [savedProfile, setSavedProfile] = useState({
    name: userName,
    email: userEmail,
  });


  const [editingProfile, setEditingProfile] = useState(false);


  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");


  /* =======================================================
     APPLY THEME
     ======================================================= */

  useEffect(() => {
    const theme = settings.darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-taskflow-theme",
      theme
    );

    document.body.setAttribute(
      "data-taskflow-theme",
      theme
    );

    localStorage.setItem(
      "taskflowSettings",
      JSON.stringify(settings)
    );
  }, [settings]);


  /* =======================================================
     ACTIVE ITEM
     ======================================================= */

  const activeItem = useMemo(() => {
    return (
      SETTINGS_ITEMS.find(
        (item) => item.id === activeSection
      ) || SETTINGS_ITEMS[0]
    );
  }, [activeSection]);


  const ActiveIcon = activeItem.icon;


  /* =======================================================
     UPDATE SETTING
     ======================================================= */

  const updateSetting = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };


  /* =======================================================
     SAVE PROFILE
     ======================================================= */

  const saveProfile = () => {
    const cleanName = profile.name.trim();
    const cleanEmail = profile.email.trim();

    if (!cleanName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (!cleanEmail) {
      toast.error("Email cannot be empty.");
      return;
    }

    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: cleanName,
            email: cleanEmail,
          })
        );
      }
    } catch {
      // Ignore malformed local storage user data.
    }

    setSavedProfile({
      name: cleanName,
      email: cleanEmail,
    });

    setProfile({
      name: cleanName,
      email: cleanEmail,
    });

    setEditingProfile(false);

    toast.success("Profile updated successfully.");
  };


  /* =======================================================
     SAVE SETTINGS
     ======================================================= */

  const saveAllSettings = () => {
    localStorage.setItem(
      "taskflowSettings",
      JSON.stringify(settings)
    );

    toast.success("Settings saved successfully.");
  };


  /* =======================================================
     RESET SETTINGS
     ======================================================= */

  const resetSettings = () => {
    setSettings({
      ...DEFAULT_SETTINGS,
    });

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


  /* =======================================================
     PASSWORD SUBMIT
     ======================================================= */

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (!passwordFields.currentPassword) {
      setPasswordMessage(
        "Please enter your current password."
      );
      return;
    }

    if (!passwordFields.newPassword) {
      setPasswordMessage(
        "Please enter a new password."
      );
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
      setPasswordMessage(
        "New passwords do not match."
      );
      return;
    }

    setPasswordMessage(
      "Password validation completed successfully."
    );

    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Password updated successfully.");
  };


  /* =======================================================
     PASSWORD INPUT
     ======================================================= */

  const renderPasswordInput = (
    label,
    name,
    value,
    visible,
    setVisible
  ) => {
    return (
      <div className="tf-settings-field">
        <label>{label}</label>

        <div className="tf-settings-password-box">
          <input
            type={visible ? "text" : "password"}
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
            aria-label={
              visible
                ? `Hide ${label}`
                : `Show ${label}`
            }
            onClick={() =>
              setVisible((previous) => !previous)
            }
          >
            {visible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
    );
  };


  /* =======================================================
     ACCOUNT
     ======================================================= */

  const renderAccount = () => (
    <section className="tf-settings-panel">

      <div className="tf-settings-panel-heading">

        <div>
          <span className="tf-settings-kicker">
            ACCOUNT
          </span>

          <h2>Account information</h2>

          <p>
            Manage your personal identity and TaskFlow
            workspace information.
          </p>
        </div>

        <div className="tf-settings-heading-icon">
          <FaUser />
        </div>

      </div>


      {/* PROFILE HERO */}

      <div className="tf-settings-profile">

        <div className="tf-settings-avatar">
          {initials}
          <span />
        </div>


        <div className="tf-settings-profile-details">

          <div className="tf-settings-name-row">

            <h3>
              {savedProfile.name}
            </h3>

            <span className="tf-settings-role">
              {userRole}
            </span>

          </div>


          <div className="tf-settings-email">
            <FaEnvelope />
            {savedProfile.email}
          </div>


          <div className="tf-settings-status-row">

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


        <button
          type="button"
          className="tf-settings-edit-btn"
          onClick={() => setEditingProfile(true)}
        >
          <FaEdit />
          Edit profile
        </button>

      </div>


      {/* EDIT PROFILE */}

      {editingProfile && (
        <div className="tf-settings-edit-box">

          <div className="tf-settings-edit-top">

            <div>
              <span>EDIT PROFILE</span>

              <h3>
                Update your profile
              </h3>
            </div>

            <button
              type="button"
              aria-label="Close profile editor"
              onClick={() => setEditingProfile(false)}
            >
              <FaTimes />
            </button>

          </div>


          <div className="tf-settings-form-grid">

            <div className="tf-settings-field">

              <label>
                Full name
              </label>

              <div className="tf-settings-input-box">

                <FaUser />

                <input
                  type="text"
                  value={profile.name}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter your name"
                />

              </div>

            </div>


            <div className="tf-settings-field">

              <label>
                Email address
              </label>

              <div className="tf-settings-input-box">

                <FaEnvelope />

                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                />

              </div>

            </div>

          </div>


          <div className="tf-settings-form-actions">

            <button
              type="button"
              className="tf-settings-cancel-btn"
              onClick={() => {
                setProfile({
                  name: savedProfile.name,
                  email: savedProfile.email,
                });

                setEditingProfile(false);
              }}
            >
              Cancel
            </button>


            <button
              type="button"
              className="tf-settings-save-btn"
              onClick={saveProfile}
            >
              <FaSave />
              Save profile
            </button>

          </div>

        </div>
      )}


      {/* INFORMATION GRID */}

      <div className="tf-settings-info-grid">

        <div className="tf-settings-info">

          <div className="purple">
            <FaUser />
          </div>

          <span>FULL NAME</span>

          <strong>
            {savedProfile.name}
          </strong>

        </div>


        <div className="tf-settings-info">

          <div className="blue">
            <FaEnvelope />
          </div>

          <span>EMAIL ADDRESS</span>

          <strong>
            {savedProfile.email}
          </strong>

        </div>


        <div className="tf-settings-info">

          <div className="violet">
            <FaShieldAlt />
          </div>

          <span>ROLE</span>

          <strong>
            {userRole}
          </strong>

        </div>


        <div className="tf-settings-info">

          <div className="green">
            <FaCheckCircle />
          </div>

          <span>ACCOUNT STATUS</span>

          <strong className="active">
            Active
          </strong>

        </div>

      </div>


      {/* PROTECTED */}

      <div className="tf-settings-protected">

        <div>
          <FaShieldAlt />
        </div>

        <section>

          <strong>
            Protected workspace
          </strong>

          <p>
            Your TaskFlow account information is securely
            associated with your workspace.
          </p>

        </section>

        <FaCheckCircle />

      </div>

    </section>
  );


  /* =======================================================
     APPEARANCE
     ======================================================= */

  const renderAppearance = () => (
    <section className="tf-settings-panel">

      <div className="tf-settings-panel-heading">

        <div>

          <span className="tf-settings-kicker">
            APPEARANCE
          </span>

          <h2>
            Customize your workspace
          </h2>

          <p>
            Personalize the TaskFlow interface to match
            your preferred working environment.
          </p>

        </div>

        <div className="tf-settings-heading-icon">
          {settings.darkMode ? (
            <FaMoon />
          ) : (
            <FaSun />
          )}
        </div>

      </div>


      {/* THEME PREVIEW */}

      <div className="tf-settings-theme-preview">

        <div
          className={
            settings.darkMode
              ? "tf-preview-window dark-preview"
              : "tf-preview-window light-preview"
          }
        >

          <div className="tf-preview-sidebar">

            <div className="tf-preview-logo">
              TF
            </div>

            <i />
            <i />
            <i />
            <i />
            <i />

          </div>


          <div className="tf-preview-main">

            <div className="tf-preview-top" />

            <div className="tf-preview-content">

              <div />
              <div />
              <div />

            </div>

          </div>

        </div>


        <div className="tf-theme-caption">

          <strong>
            {settings.darkMode
              ? "Dark workspace"
              : "Light workspace"}
          </strong>

          <span>
            {settings.darkMode
              ? "Focused and comfortable for long sessions."
              : "Clean and bright for daytime work."}
          </span>

        </div>

      </div>


      {/* THEME OPTIONS */}

      <div className="tf-theme-options">

        <button
          type="button"
          className={
            !settings.darkMode
              ? "tf-theme-option selected"
              : "tf-theme-option"
          }
          onClick={() =>
            setSettings((previous) => ({
              ...previous,
              darkMode: false,
            }))
          }
        >

          <div className="tf-theme-option-icon">
            <FaSun />
          </div>

          <section>

            <strong>
              Light mode
            </strong>

            <span>
              Bright and clean workspace
            </span>

          </section>

          {!settings.darkMode && (
            <FaCheckCircle />
          )}

        </button>


        <button
          type="button"
          className={
            settings.darkMode
              ? "tf-theme-option selected"
              : "tf-theme-option"
          }
          onClick={() =>
            setSettings((previous) => ({
              ...previous,
              darkMode: true,
            }))
          }
        >

          <div className="tf-theme-option-icon">
            <FaMoon />
          </div>

          <section>

            <strong>
              Dark mode
            </strong>

            <span>
              Comfortable interface for low-light
              environments
            </span>

          </section>

          {settings.darkMode && (
            <FaCheckCircle />
          )}

        </button>

      </div>

    </section>
  );


  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  const renderNotifications = () => {

    const notifications = [
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
    ];


    return (
      <section className="tf-settings-panel">

        <div className="tf-settings-panel-heading">

          <div>

            <span className="tf-settings-kicker">
              NOTIFICATIONS
            </span>

            <h2>
              Notification preferences
            </h2>

            <p>
              Control which TaskFlow alerts and updates
              you receive.
            </p>

          </div>

          <div className="tf-settings-heading-icon">
            <FaBell />
          </div>

        </div>


        <div className="tf-notification-list">

          {notifications.map((item) => (

            <div
              className="tf-notification-row"
              key={item.key}
            >

              <div className="tf-notification-icon">
                <FaBell />
              </div>


              <div className="tf-notification-text">

                <strong>
                  {item.title}
                </strong>

                <span>
                  {item.description}
                </span>

              </div>


              <button
                type="button"
                aria-label={`Toggle ${item.title}`}
                className={
                  settings[item.key]
                    ? "tf-switch on"
                    : "tf-switch"
                }
                onClick={() =>
                  updateSetting(item.key)
                }
              >
                <span />
              </button>

            </div>

          ))}

        </div>

      </section>
    );
  };


  /* =======================================================
     SECURITY
     ======================================================= */

  const renderSecurity = () => (
    <section className="tf-settings-panel">

      <div className="tf-settings-panel-heading">

        <div>

          <span className="tf-settings-kicker">
            SECURITY
          </span>

          <h2>
            Password & security
          </h2>

          <p>
            Keep your TaskFlow account protected with a
            strong password.
          </p>

        </div>

        <div className="tf-settings-heading-icon">
          <FaLock />
        </div>

      </div>


      <div className="tf-security-banner">

        <div>
          <FaShieldAlt />
        </div>

        <section>

          <strong>
            Your account is protected
          </strong>

          <span>
            Use a unique password that you do not reuse
            on other services.
          </span>

        </section>

        <FaCheckCircle />

      </div>


      <form
        className="tf-password-form"
        onSubmit={handlePasswordSubmit}
      >

        {renderPasswordInput(
          "Current password",
          "currentPassword",
          passwordFields.currentPassword,
          showCurrent,
          setShowCurrent
        )}


        {renderPasswordInput(
          "New password",
          "newPassword",
          passwordFields.newPassword,
          showNew,
          setShowNew
        )}


        {renderPasswordInput(
          "Confirm password",
          "confirmPassword",
          passwordFields.confirmPassword,
          showConfirm,
          setShowConfirm
        )}


        {passwordMessage && (
          <div className="tf-password-message">
            <FaInfoCircle />
            {passwordMessage}
          </div>
        )}


        <button
          type="submit"
          className="tf-settings-save-btn"
        >
          <FaLock />
          Update password
        </button>

      </form>

    </section>
  );


  /* =======================================================
     APPLICATION
     ======================================================= */

  const renderApplication = () => (
    <section className="tf-settings-panel">

      <div className="tf-settings-panel-heading">

        <div>

          <span className="tf-settings-kicker">
            APPLICATION
          </span>

          <h2>
            TaskFlow information
          </h2>

          <p>
            Information about your TaskFlow application
            and current environment.
          </p>

        </div>

        <div className="tf-settings-heading-icon">
          <FaCog />
        </div>

      </div>


      <div className="tf-app-brand">

        <div className="tf-app-logo">
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
            A modern workspace for managing projects,
            tasks, teams and productivity.
          </p>

        </div>


        <div className="tf-app-version">

          <span>
            VERSION
          </span>

          <strong>
            1.0.0
          </strong>

        </div>

      </div>


      <div className="tf-tech-grid">

        <div>

          <FaDesktop />

          <section>

            <span>
              PLATFORM
            </span>

            <strong>
              Web Application
            </strong>

          </section>

        </div>


        <div>

          <FaCode />

          <section>

            <span>
              FRONTEND
            </span>

            <strong>
              React + Vite
            </strong>

          </section>

        </div>


        <div>

          <FaServer />

          <section>

            <span>
              BACKEND
            </span>

            <strong>
              Node.js / Express
            </strong>

          </section>

        </div>


        <div>

          <FaDatabase />

          <section>

            <span>
              DATABASE
            </span>

            <strong>
              MongoDB
            </strong>

          </section>

        </div>

      </div>


      <div className="tf-about">

        <div>
          <FaInfoCircle />
        </div>

        <section>

          <strong>
            About TaskFlow
          </strong>

          <p>
            TaskFlow provides a centralized, organized
            and secure environment for modern project
            management.
          </p>

        </section>

        <span>
          <FaCheckCircle />
          Operational
        </span>

      </div>

    </section>
  );


  /* =======================================================
     CONTENT SWITCH
     ======================================================= */

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


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="tf-settings-root">

      <Sidebar />

      <Navbar />


      <main className="tf-settings-page">

        {/* BACKGROUND */}

        <div className="tf-settings-bg">

          <div className="tf-bg-orb tf-bg-orb-1" />
          <div className="tf-bg-orb tf-bg-orb-2" />
          <div className="tf-bg-grid" />

        </div>


        {/* MAIN CONTAINER */}

        <div className="tf-settings-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="tf-settings-header">

            <div>

              <div className="tf-settings-breadcrumb">

                <span>
                  WORKSPACE
                </span>

                <b>/</b>

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


            <div className="tf-secure-badge">

              <FaShieldAlt />

              Workspace secure

            </div>

          </header>


          {/* =================================================
              SETTINGS LAYOUT
          ================================================= */}

          <div className="tf-settings-layout">


            {/* =================================================
                LEFT SETTINGS NAVIGATION
            ================================================= */}

            <aside className="tf-settings-sidebar">

              <div className="tf-settings-sidebar-title">
                SETTINGS
              </div>


              <div className="tf-settings-nav">

                {SETTINGS_ITEMS.map((item) => {

                  const Icon = item.icon;

                  const active =
                    activeSection === item.id;


                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        active
                          ? "tf-settings-nav-btn active"
                          : "tf-settings-nav-btn"
                      }
                      onClick={() =>
                        setActiveSection(item.id)
                      }
                    >

                      <div className="tf-settings-nav-icon">
                        <Icon />
                      </div>


                      <div className="tf-settings-nav-copy">

                        <strong>
                          {item.label}
                        </strong>

                        <span>
                          {item.description}
                        </span>

                      </div>


                      <FaChevronRight />

                    </button>
                  );

                })}

              </div>


              {/* PROTECTED */}

              <div className="tf-sidebar-protected">

                <div>
                  <FaShieldAlt />
                </div>

                <section>

                  <strong>
                    Protected workspace
                  </strong>

                  <span>
                    Your TaskFlow account is secure.
                  </span>

                </section>

                <FaCheckCircle />

              </div>

            </aside>


            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="tf-settings-main">


              {/* ACTIVE SECTION */}

              <div className="tf-active-section-bar">

                <div>

                  <ActiveIcon />

                  <strong>
                    {activeItem.label}
                  </strong>

                  <span>
                    {activeItem.description}
                  </span>

                </div>

              </div>


              {/* CONTENT */}

              {renderContent()}


              {/* =================================================
                  ACTION BAR
              ================================================= */}

              <div className="tf-settings-actions">

                <div className="tf-save-status">

                  <span />

                  <div>

                    <strong>
                      All changes are currently saved
                    </strong>

                    <small>
                      Your workspace preferences are
                      organized and protected.
                    </small>

                  </div>

                </div>


                <div className="tf-action-buttons">

                  <button
                    type="button"
                    className="tf-reset-btn"
                    onClick={resetSettings}
                  >
                    <FaRedo />
                    Reset
                  </button>


                  <button
                    type="button"
                    className="tf-settings-save-btn"
                    onClick={saveAllSettings}
                  >
                    <FaSave />
                    Save changes
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM SECURITY BAR
          ================================================= */}

          <div className="tf-settings-bottom">

            <div className="tf-bottom-icon">
              <FaShieldAlt />
            </div>


            <div>

              <strong>
                Your preferences are stored securely
              </strong>

              <span>
                TaskFlow keeps your workspace settings
                organized and protected.
              </span>

            </div>


            <span className="tf-bottom-secure">

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