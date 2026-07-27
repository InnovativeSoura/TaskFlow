import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaShieldAlt,
  FaDatabase,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaLock,
  FaSave,
  FaTimes,
  FaEdit,
  FaGlobe,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import api from "../api/axios";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useTheme,
} from "../context/ThemeContext";

import "../styles/Profile.css";

const INITIAL_FORM = {
  name: "",
  phone: "",
  designation: "",
  department: "",
  bio: "",
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatDateTime = (date) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

function Profile() {
  const {
    user,
    updateUser,
  } = useAuth();

  const {
    isDark,
  } = useTheme();

  const [profile, setProfile] =
    useState(user || null);

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ==========================================
     FETCH PROFILE
  ========================================== */

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/users/profile");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load profile."
        );
      }

      const currentUser =
        response.data.user;

      setProfile(currentUser);

      setForm({
        name:
          currentUser.name || "",
        phone:
          currentUser.phone || "",
        designation:
          currentUser.designation || "",
        department:
          currentUser.department || "",
        bio:
          currentUser.bio || "",
      });

      updateUser(currentUser);
    } catch (err) {
      console.error(
        "Profile Fetch Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ==========================================
     FORM HANDLER
  ========================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "bio"
          ? value.slice(0, 500)
          : value,
    }));

    setSuccess("");
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await api.put(
          "/users/profile",
          form
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to update profile."
        );
      }

      const updatedUser =
        response.data.user;

      setProfile(updatedUser);

      setForm({
        name:
          updatedUser.name || "",
        phone:
          updatedUser.phone || "",
        designation:
          updatedUser.designation || "",
        department:
          updatedUser.department || "",
        bio:
          updatedUser.bio || "",
      });

      updateUser(updatedUser);

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile Update Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     CANCEL
  ========================================== */

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      name:
        profile.name || "",
      phone:
        profile.phone || "",
      designation:
        profile.designation || "",
      department:
        profile.department || "",
      bio:
        profile.bio || "",
    });

    setError("");
    setSuccess("");
  };

  /* ==========================================
     INITIALS
  ========================================== */

  const initials = useMemo(() => {
    const name =
      profile?.name ||
      user?.name ||
      "TaskFlow";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]?.toUpperCase()
      )
      .join("");
  }, [profile, user]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="profile-layout">
        <Sidebar />

        <main className="profile-main">
          <Navbar />

          <div className="profile-loading">
            <div className="profile-loading-spinner" />

            <h2>
              Loading your profile
            </h2>

            <p>
              Fetching your TaskFlow account information...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================
     ERROR
  ========================================== */

  if (!profile) {
    return (
      <div className="profile-layout">
        <Sidebar />

        <main className="profile-main">
          <Navbar />

          <div className="profile-error">
            <div className="error-icon">
              !
            </div>

            <h2>
              Profile unavailable
            </h2>

            <p>
              {error ||
                "We could not load your profile."}
            </p>

            <button
              type="button"
              onClick={fetchProfile}
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`profile-layout ${
        isDark
          ? "profile-dark"
          : "profile-light"
      }`}
    >
      <Sidebar />

      <main className="profile-main">
        <Navbar />

        <div className="profile-content">

          {/* =====================================
              PAGE HEADER
          ===================================== */}

          <section className="profile-page-header">

            <div className="profile-heading">

              <div className="profile-breadcrumb">
                <span>
                  ACCOUNT
                </span>

                <i>/</i>

                <strong>
                  MY PROFILE
                </strong>
              </div>

              <h1>
                My Profile
                <span className="verified-title">
                  <FaCheckCircle />
                </span>
              </h1>

              <p>
                Manage your personal information
                and workspace profile.
              </p>

            </div>

            <div className="profile-header-actions">

              <button
                type="button"
                className="profile-cancel-top"
                onClick={handleCancel}
                disabled={saving}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                type="submit"
                form="profile-form"
                className="profile-save-top"
                disabled={saving}
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </section>

          {/* =====================================
              FEEDBACK
          ===================================== */}

          {success && (
            <div className="profile-alert success">
              <FaCheckCircle />

              <span>
                {success}
              </span>
            </div>
          )}

          {error && (
            <div className="profile-alert error">
              <span className="alert-symbol">
                !
              </span>

              <span>
                {error}
              </span>
            </div>
          )}

          {/* =====================================
              MAIN GRID
          ===================================== */}

          <div className="profile-grid">

            {/* =================================
                LEFT COLUMN
            ================================= */}

            <aside className="profile-sidebar">

              {/* PROFILE CARD */}

              <div className="profile-identity-card">

                <div className="profile-cover">

                  <div className="cover-orb orb-one" />
                  <div className="cover-orb orb-two" />

                  <div className="cover-grid" />

                </div>

                <div className="identity-content">

                  <div className="avatar-wrapper">

                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="profile-avatar-image"
                      />
                    ) : (
                      <div className="profile-avatar">
                        {initials}
                      </div>
                    )}

                    <span className="avatar-status" />

                    <button
                      type="button"
                      className="avatar-edit"
                      title="Profile picture"
                    >
                      <FaEdit />
                    </button>

                  </div>

                  <h2>
                    {profile.name}
                  </h2>

                  <span className="designation-pill">
                    {profile.designation ||
                      "Team Member"}
                  </span>

                  <div className="identity-details">

                    <div className="identity-row">
                      <span>
                        <FaShieldAlt />
                        Role
                      </span>

                      <strong>
                        {profile.role ||
                          "Team Member"}
                      </strong>
                    </div>

                    <div className="identity-row">
                      <span>
                        <FaCheckCircle />
                        Status
                      </span>

                      <strong className="active-value">
                        <i />
                        {profile.status ||
                          "Active"}
                      </strong>
                    </div>

                    <div className="identity-row">
                      <span>
                        <FaGlobe />
                        Provider
                      </span>

                      <strong>
                        {profile.provider ||
                          "local"}
                      </strong>
                    </div>

                    <div className="identity-row">
                      <span>
                        <FaBriefcase />
                        Workspace
                      </span>

                      <strong>
                        TaskFlow
                      </strong>
                    </div>

                  </div>

                  <div className="identity-divider" />

                  <div className="identity-footer">

                    <div>
                      <FaCalendarAlt />

                      <span>
                        <small>
                          Joined
                        </small>

                        <strong>
                          {formatDate(
                            profile.createdAt
                          )}
                        </strong>
                      </span>
                    </div>

                    <div>
                      <FaClock />

                      <span>
                        <small>
                          Last Login
                        </small>

                        <strong>
                          {formatDateTime(
                            profile.lastLogin
                          )}
                        </strong>
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* SECURITY CARD */}

              <div className="profile-security-card">

                <div className="security-heading">

                  <div className="security-icon">
                    <FaLock />
                  </div>

                  <div>
                    <h3>
                      Profile Security
                    </h3>

                    <p>
                      Your profile information is
                      securely stored in MongoDB.
                    </p>
                  </div>

                  <span className="secured-badge">
                    Secured
                  </span>

                </div>

                <div className="security-divider" />

                <div className="security-row">
                  <span>
                    <FaShieldAlt />
                    Authentication
                  </span>

                  <strong>
                    {profile.provider ===
                    "local"
                      ? "Local"
                      : profile.provider}
                  </strong>
                </div>

                <div className="security-row">
                  <span>
                    <FaDatabase />
                    Database
                  </span>

                  <strong>
                    MongoDB
                  </strong>
                </div>

              </div>

            </aside>

            {/* =================================
                RIGHT COLUMN
            ================================= */}

            <section className="profile-form-column">

              <form
                id="profile-form"
                className="profile-form-card"
                onSubmit={handleSubmit}
              >

                <div className="form-card-header">

                  <div className="form-heading-icon">
                    <FaUser />
                  </div>

                  <div>
                    <h2>
                      Personal Information
                    </h2>

                    <p>
                      Update your personal details
                      and how others see you in
                      TaskFlow.
                    </p>
                  </div>

                </div>

                <div className="form-divider" />

                {/* FORM GRID */}

                <div className="form-grid">

                  {/* NAME */}

                  <div className="field-group">

                    <label htmlFor="name">
                      Full Name
                    </label>

                    <div className="input-wrapper">
                      <FaUser />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={
                          handleChange
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="field-group">

                    <label htmlFor="email">
                      Email Address
                    </label>

                    <div className="input-wrapper disabled">
                      <FaEnvelope />

                      <input
                        id="email"
                        type="email"
                        value={
                          profile.email || ""
                        }
                        disabled
                      />
                    </div>

                    <small>
                      Email cannot be changed
                      from the profile page.
                    </small>

                  </div>

                  {/* PHONE */}

                  <div className="field-group">

                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <div className="input-wrapper">
                      <FaPhone />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={
                          handleChange
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                  </div>

                  {/* DESIGNATION */}

                  <div className="field-group">

                    <label htmlFor="designation">
                      Designation
                    </label>

                    <div className="input-wrapper">
                      <FaBriefcase />

                      <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={
                          form.designation
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Product Designer"
                      />
                    </div>

                  </div>

                  {/* DEPARTMENT */}

                  <div className="field-group">

                    <label htmlFor="department">
                      Department
                    </label>

                    <div className="input-wrapper">
                      <FaBuilding />

                      <input
                        id="department"
                        name="department"
                        type="text"
                        value={
                          form.department
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Engineering"
                      />
                    </div>

                  </div>

                  {/* ROLE */}

                  <div className="field-group">

                    <label htmlFor="role">
                      Workspace Role
                    </label>

                    <div className="input-wrapper disabled">
                      <FaShieldAlt />

                      <input
                        id="role"
                        type="text"
                        value={
                          profile.role ||
                          "Team Member"
                        }
                        disabled
                      />
                    </div>

                    <small>
                      Workspace roles are managed
                      by administrators.
                    </small>

                  </div>

                </div>

                {/* BIO */}

                <div className="bio-field">

                  <div className="bio-label-row">

                    <label htmlFor="bio">
                      About Me
                    </label>

                    <span>
                      {form.bio.length}/500
                    </span>

                  </div>

                  <div className="textarea-wrapper">
                    <FaUser />

                    <textarea
                      id="bio"
                      name="bio"
                      rows="6"
                      maxLength="500"
                      value={form.bio}
                      onChange={
                        handleChange
                      }
                      placeholder="Tell your team a little about yourself..."
                    />
                  </div>

                </div>

                {/* FORM ACTIONS */}

                <div className="form-actions">

                  <button
                    type="button"
                    className="form-cancel"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="form-save"
                    disabled={saving}
                  >
                    <FaSave />

                    {saving
                      ? "Saving Changes..."
                      : "Save Changes"}
                  </button>

                </div>

              </form>

              {/* =================================
                  BOTTOM INFO
              ================================= */}

              <div className="profile-bottom-card">

                <div className="bottom-info">

                  <div className="bottom-icon workspace">
                    <FaBriefcase />
                  </div>

                  <div>
                    <span>
                      Workspace
                    </span>

                    <strong>
                      TaskFlow
                    </strong>

                    <small>
                      Active Workspace
                    </small>
                  </div>

                </div>

                <div className="bottom-divider" />

                <div className="bottom-info">

                  <div className="bottom-icon verified">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <span>
                      Account
                    </span>

                    <strong className="green-text">
                      {profile.status ||
                        "Active"}
                    </strong>

                    <small>
                      {profile.isVerified
                        ? "Verified Account"
                        : "Active Account"}
                    </small>
                  </div>

                </div>

                <div className="bottom-divider" />

                <div className="bottom-info">

                  <div className="bottom-icon member">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <span>
                      Member Since
                    </span>

                    <strong>
                      {formatDate(
                        profile.createdAt
                      )}
                    </strong>

                    <small>
                      TaskFlow Member
                    </small>
                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Profile;