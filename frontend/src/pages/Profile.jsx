import {
  useEffect,
  useState,
} from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaShieldAlt,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaDatabase,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

import { useAuth } from "../context/AuthContext";

import "../styles/Profile.css";

function Profile() {
  const {
    user: authUser,
    updateUser,
  } = useAuth();

  /* ==========================================
     STATE
  ========================================== */

  const [profile, setProfile] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ==========================================
     LOAD PROFILE
     
     IMPORTANT:
     Do NOT put `profile` or `authUser`
     in this dependency array.
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getProfile();

        if (!mounted) return;

        if (!result.success || !result.data) {
          throw new Error(
            "Unable to load profile."
          );
        }

        const currentUser =
          result.data;

        setProfile(currentUser);

        setForm({
          name:
            currentUser.name || "",

          email:
            currentUser.email || "",

          phone:
            currentUser.phone || "",

          designation:
            currentUser.designation || "",

          department:
            currentUser.department || "",

          bio:
            currentUser.bio || "",
        });
      } catch (err) {
        console.error(
          "Profile Load Error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load profile."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const result =
        await updateProfile({
          name: form.name,
          phone: form.phone,
          designation:
            form.designation,
          department:
            form.department,
          bio: form.bio,
        });

      if (!result.success) {
        throw new Error(
          result.message ||
            "Profile update failed."
        );
      }

      const updatedUser =
        result.data;

      setProfile(updatedUser);

      setForm({
        name:
          updatedUser.name || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

        designation:
          updatedUser.designation || "",

        department:
          updatedUser.department || "",

        bio:
          updatedUser.bio || "",
      });

      /*
       * Update AuthContext only AFTER
       * successful save.
       *
       * This does NOT trigger the profile
       * fetch again because our useEffect
       * has [] dependencies.
       */

      updateUser(updatedUser);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile Update Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     CANCEL / RESET
  ========================================== */

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      name:
        profile.name || "",

      email:
        profile.email || "",

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
     AVATAR INITIALS
  ========================================== */

  const getInitials = (name = "") => {
    const parts =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
      return "TF";
    }

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  /* ==========================================
     DATE FORMAT
  ========================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="profile-layout">
        <Sidebar />

        <div className="profile-main">
          <Navbar />

          <div className="profile-loading">
            <div className="profile-loader" />

            <h2>
              Loading your profile
            </h2>

            <p>
              Fetching your information
              from TaskFlow...
            </p>
          </div>
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

          <div className="profile-error">
            <div className="error-icon">
              !
            </div>

            <h2>
              Unable to load profile
            </h2>

            <p>
              {error ||
                "Something went wrong while loading your profile."}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <div className="profile-layout">

      <Sidebar />

      <div className="profile-main">

        <Navbar />

        <main className="profile-content">

          {/* ==================================
              PAGE HEADER
          ================================== */}

          <section className="profile-heading">

            <div>
              <span className="eyebrow">
                ACCOUNT
              </span>

              <h1>
                My Profile
              </h1>

              <p>
                Manage your personal
                information and workspace
                profile.
              </p>
            </div>

            <div className="profile-header-actions">

              <button
                type="button"
                className="profile-cancel-top"
                onClick={handleCancel}
              >
                <FaTimes />
                Cancel
              </button>

            </div>

          </section>

          {/* ==================================
              ALERTS
          ================================== */}

          {error && (
            <div className="profile-alert error">
              {error}
            </div>
          )}

          {success && (
            <div className="profile-alert success">
              {success}
            </div>
          )}

          {/* ==================================
              PROFILE GRID
          ================================== */}

          <section className="profile-grid">

            {/* ================================
                IDENTITY CARD
            ================================= */}

            <aside className="identity-card">

              <div className="identity-glow" />

              <div className="avatar-wrapper">

                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {getInitials(
                      profile.name
                    )}
                  </div>
                )}

                <span className="online-dot" />

              </div>

              <div className="identity-info">

                <h2>
                  {profile.name ||
                    "TaskFlow User"}
                </h2>

                <p>
                  {profile.designation ||
                    "Team Member"}
                </p>

                <span className="role-pill">
                  <FaShieldAlt />
                  {profile.role ||
                    "Team Member"}
                </span>

              </div>

              <div className="identity-divider" />

              <div className="identity-meta">

                <div>
                  <span>
                    Status
                  </span>

                  <strong className="active-status">
                    <i />
                    {profile.status ||
                      "Active"}
                  </strong>
                </div>

                <div>
                  <span>
                    Provider
                  </span>

                  <strong>
                    {profile.provider ||
                      "local"}
                  </strong>
                </div>

              </div>

            </aside>

            {/* ================================
                FORM CARD
            ================================= */}

            <section className="profile-card">

              <div className="profile-card-header">

                <div>
                  <span className="section-label">
                    PROFILE DETAILS
                  </span>

                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Your profile information
                    is securely stored in
                    MongoDB.
                  </p>
                </div>

                <div className="database-badge">
                  <FaDatabase />
                  MongoDB
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="profile-form"
              >

                {/* NAME */}

                <div className="form-field">

                  <label>
                    Full Name
                  </label>

                  <div className="input-wrapper">

                    <FaUser />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      placeholder="Your full name"
                      required
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div className="form-field">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper disabled">

                    <FaEnvelope />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      readOnly
                    />

                  </div>

                  <small>
                    Email cannot be changed
                    from the profile page.
                  </small>

                </div>

                {/* PHONE */}

                <div className="form-field">

                  <label>
                    Phone Number
                  </label>

                  <div className="input-wrapper">

                    <FaPhone />

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter phone number"
                    />

                  </div>

                </div>

                {/* DESIGNATION */}

                <div className="form-field">

                  <label>
                    Designation
                  </label>

                  <div className="input-wrapper">

                    <FaBriefcase />

                    <input
                      type="text"
                      name="designation"
                      value={
                        form.designation
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Data Analyst"
                    />

                  </div>

                </div>

                {/* DEPARTMENT */}

                <div className="form-field">

                  <label>
                    Department
                  </label>

                  <div className="input-wrapper">

                    <FaBuilding />

                    <input
                      type="text"
                      name="department"
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

                <div className="form-field">

                  <label>
                    Workspace Role
                  </label>

                  <div className="input-wrapper disabled">

                    <FaShieldAlt />

                    <input
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
                    Workspace roles are
                    managed by administrators.
                  </small>

                </div>

                {/* BIO */}

                <div className="form-field full-width">

                  <label>
                    About Me
                  </label>

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={
                      handleChange
                    }
                    placeholder="Tell your team a little about yourself..."
                    rows="5"
                    maxLength={500}
                  />

                  <div className="character-count">
                    {form.bio.length}/500
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="form-actions full-width">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={
                      handleCancel
                    }
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                    disabled={saving}
                  >

                    {saving ? (
                      <>
                        <span className="button-spinner" />
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

            </section>

          </section>

          {/* ==================================
              ACCOUNT INFORMATION
          ================================== */}

          <section className="account-strip">

            <div className="account-item">

              <div className="account-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <span>
                  Account Created
                </span>

                <strong>
                  {formatDate(
                    profile.createdAt
                  )}
                </strong>
              </div>

            </div>

            <div className="account-item">

              <div className="account-icon">
                <FaClock />
              </div>

              <div>
                <span>
                  Last Login
                </span>

                <strong>
                  {formatDate(
                    profile.lastLogin
                  )}
                </strong>
              </div>

            </div>

            <div className="account-item">

              <div className="account-icon">
                <FaShieldAlt />
              </div>

              <div>
                <span>
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

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default Profile;