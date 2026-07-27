// src/pages/Profile.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcase,
  FaBuilding,
  FaShieldAlt,
  FaDatabase,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaTimes,
  FaLock,
  FaGlobe,
  FaSpinner,
  FaUserCircle,
  FaPen,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  updateProfile,
} from "../services/userService";

import "../styles/Profile.css";

function Profile() {
  const {
    user: authUser,
    updateUser: updateAuthUser,
  } = useAuth();

  /* ==========================================
     STATE
  ========================================== */

  const [profile, setProfile] = useState(
    authUser || null
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================
     LOAD PROFILE
  ========================================== */

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProfile();

      if (!result.success || !result.data) {
        throw new Error(
          result.message || "Unable to load profile."
        );
      }

      const currentUser = result.data;

      setProfile(currentUser);

      setForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        designation:
          currentUser.designation || "",
        department:
          currentUser.department || "",
        bio: currentUser.bio || "",
      });
    } catch (err) {
      console.error(
        "Profile Load Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }

    if (error) {
      setError("");
    }
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const result = await updateProfile(form);

      if (!result.success || !result.data) {
        throw new Error(
          result.message ||
            "Unable to update profile."
        );
      }

      const updatedUser = result.data;

      setProfile(updatedUser);

      setForm({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        designation:
          updatedUser.designation || "",
        department:
          updatedUser.department || "",
        bio: updatedUser.bio || "",
      });

      /* Update global auth state + localStorage */
      updateAuthUser(updatedUser);

      setMessage(
        "Your profile has been updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Profile Update Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     RESET FORM
  ========================================== */

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      designation:
        profile.designation || "",
      department:
        profile.department || "",
      bio: profile.bio || "",
    });

    setMessage("");
    setError("");
  };

  /* ==========================================
     AVATAR INITIALS
  ========================================== */

  const initials = useMemo(() => {
    const name =
      profile?.name ||
      authUser?.name ||
      "User";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  }, [profile, authUser]);

  /* ==========================================
     DATE FORMATTER
  ========================================== */

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ==========================================
     LAST LOGIN
  ========================================== */

  const lastLogin =
    profile?.lastLogin ||
    profile?.updatedAt ||
    profile?.createdAt;

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="profile-layout">
        <Sidebar />

        <div className="profile-main">
          <Navbar />

          <main className="profile-content">
            <div className="profile-skeleton">
              <div className="skeleton-title" />

              <div className="skeleton-grid">
                <div className="skeleton-card large" />
                <div className="skeleton-card large" />
              </div>

              <div className="skeleton-card wide" />
            </div>
          </main>
        </div>
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

        <div className="profile-main">
          <Navbar />

          <main className="profile-content">
            <div className="profile-error-state">
              <div className="error-icon">
                <FaUserCircle />
              </div>

              <h2>
                Unable to load profile
              </h2>

              <p>
                {error ||
                  "Something went wrong while loading your account."}
              </p>

              <button
                className="profile-primary-btn"
                onClick={loadProfile}
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <Sidebar />

      <div className="profile-main">
        <Navbar />

        <main className="profile-content">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <section className="profile-page-header">

            <div className="profile-breadcrumb">
              <span>ACCOUNT</span>
              <span className="breadcrumb-arrow">
                /
              </span>
              <strong>MY PROFILE</strong>
            </div>

            <div className="profile-header-row">

              <div>
                <div className="profile-title-row">
                  <h1>My Profile</h1>

                  <span className="verified-title">
                    <FaShieldAlt />
                  </span>
                </div>

                <p>
                  Manage your personal information
                  and workspace profile.
                </p>
              </div>

              <div className="profile-header-actions">

                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  form="profile-form"
                  className="profile-primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>

              </div>
            </div>

            {message && (
              <div className="profile-alert success">
                <FaCheckCircle />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="profile-alert error">
                <FaTimes />
                <span>{error}</span>
              </div>
            )}

          </section>

          {/* ==========================================
              PROFILE GRID
          ========================================== */}

          <section className="profile-grid">

            {/* ==========================================
                LEFT COLUMN
            ========================================== */}

            <div className="profile-left-column">

              {/* Identity Card */}

              <article className="identity-card">

                <div className="identity-cover">
                  <div className="cover-orb orb-one" />
                  <div className="cover-orb orb-two" />
                  <div className="cover-grid" />
                </div>

                <div className="identity-body">

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

                    <span className="online-indicator" />

                    <button
                      type="button"
                      className="avatar-edit-btn"
                      title="Avatar"
                    >
                      <FaPen />
                    </button>
                  </div>

                  <h2>
                    {profile.name ||
                      "TaskFlow User"}
                  </h2>

                  <span className="identity-designation">
                    {profile.designation ||
                      "Team Member"}
                  </span>

                  <div className="identity-meta">

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
                        {profile.provider
                          ? profile.provider
                              .charAt(0)
                              .toUpperCase() +
                            profile.provider.slice(
                              1
                            )
                          : "Local"}
                      </strong>
                    </div>

                    <div className="identity-row">
                      <span>
                        <FaBriefcase />
                        Workspace
                      </span>

                      <strong>
                        {profile.role ||
                          "Team Member"}
                      </strong>
                    </div>

                  </div>

                  <div className="identity-divider" />

                  <div className="identity-dates">

                    <div>
                      <span>
                        <FaCalendarAlt />
                        Joined
                      </span>

                      <strong>
                        {formatDate(
                          profile.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        <FaClock />
                        Last Login
                      </span>

                      <strong>
                        {formatDate(
                          lastLogin
                        )}
                      </strong>
                    </div>

                  </div>

                </div>
              </article>

              {/* Security Card */}

              <article className="security-card">

                <div className="security-header">

                  <div className="security-icon">
                    <FaLock />
                  </div>

                  <div>
                    <h3>
                      Profile Security
                    </h3>

                    <p>
                      Your profile information
                      is securely stored in
                      MongoDB.
                    </p>
                  </div>

                  <span className="secured-badge">
                    Secured
                  </span>

                </div>

                <div className="security-divider" />

                <div className="security-item">

                  <span>
                    <FaShieldAlt />
                    Authentication
                  </span>

                  <strong>
                    {profile.provider ===
                    "google"
                      ? "Google"
                      : profile.provider ===
                        "github"
                      ? "GitHub"
                      : "Local"}
                  </strong>

                </div>

                <div className="security-item">

                  <span>
                    <FaDatabase />
                    Database
                  </span>

                  <strong>
                    MongoDB
                  </strong>

                </div>

              </article>

            </div>

            {/* ==========================================
                RIGHT COLUMN
            ========================================== */}

            <div className="profile-right-column">

              <article className="information-card">

                <div className="information-header">

                  <div className="information-icon">
                    <FaUser />
                  </div>

                  <div>
                    <h2>
                      Personal Information
                    </h2>

                    <p>
                      Update your personal
                      details and how others
                      see you in TaskFlow.
                    </p>
                  </div>

                </div>

                <div className="form-divider" />

                <form
                  id="profile-form"
                  onSubmit={handleSubmit}
                  className="profile-form"
                >

                  {/* Name */}

                  <div className="form-field">

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
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                      />

                    </div>

                  </div>

                  {/* Email */}

                  <div className="form-field">

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
                        readOnly
                      />

                    </div>

                    <small>
                      Email cannot be changed
                      from the profile page.
                    </small>

                  </div>

                  {/* Phone */}

                  <div className="form-field">

                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <div className="input-wrapper">

                      <FaPhoneAlt />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        autoComplete="tel"
                      />

                    </div>

                  </div>

                  {/* Designation */}

                  <div className="form-field">

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
                        onChange={handleChange}
                        placeholder="e.g. Product Designer"
                      />

                    </div>

                  </div>

                  {/* Department */}

                  <div className="form-field">

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
                        onChange={handleChange}
                        placeholder="e.g. Engineering"
                      />

                    </div>

                  </div>

                  {/* Workspace Role */}

                  <div className="form-field">

                    <label htmlFor="workspace-role">
                      Workspace Role
                    </label>

                    <div className="input-wrapper disabled">

                      <FaShieldAlt />

                      <input
                        id="workspace-role"
                        type="text"
                        value={
                          profile.role ||
                          "Team Member"
                        }
                        disabled
                        readOnly
                      />

                    </div>

                    <small>
                      Workspace roles are managed
                      by administrators.
                    </small>

                  </div>

                  {/* Bio */}

                  <div className="form-field full-width">

                    <div className="label-row">

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
                        value={form.bio}
                        onChange={(event) => {
                          const value =
                            event.target
                              .value
                              .slice(
                                0,
                                500
                              );

                          setForm(
                            (previous) => ({
                              ...previous,
                              bio: value,
                            })
                          );

                          setMessage("");
                          setError("");
                        }}
                        placeholder="Tell your team a little about yourself..."
                        maxLength={500}
                        rows={5}
                      />

                    </div>

                  </div>

                  {/* Form Buttons */}

                  <div className="form-actions full-width">

                    <button
                      type="button"
                      className="profile-secondary-btn form-cancel"
                      onClick={
                        handleCancel
                      }
                      disabled={saving}
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-primary-btn form-save"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>

                  </div>

                </form>

              </article>

              {/* ==========================================
                  STATISTICS
              ========================================== */}

              <div className="profile-stat-card">

                <div className="profile-stat">

                  <div className="stat-icon purple">
                    <FaBriefcase />
                  </div>

                  <div>
                    <strong>Workspace</strong>
                    <span>
                      TaskFlow
                    </span>
                  </div>

                </div>

                <div className="stat-separator" />

                <div className="profile-stat">

                  <div className="stat-icon blue">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <strong>Account</strong>
                    <span>
                      {profile.status ||
                        "Active"}
                    </span>
                  </div>

                </div>

                <div className="stat-separator" />

                <div className="profile-stat">

                  <div className="stat-icon green">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <strong>Verified</strong>
                    <span>
                      {profile.isVerified
                        ? "Verified"
                        : "Active Account"}
                    </span>
                  </div>

                </div>

                <div className="stat-separator" />

                <div className="profile-stat">

                  <div className="stat-icon orange">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <strong>Member Since</strong>
                    <span>
                      {formatDate(
                        profile.createdAt
                      )}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Profile;