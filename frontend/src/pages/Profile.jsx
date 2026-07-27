// src/pages/Profile.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
  FaSave,
  FaTimes,
  FaEdit,
  FaUser,
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
  /* =========================================================
     AUTH
  ========================================================= */

  const {
    user: authUser,
    updateUser: updateAuthUser,
  } = useAuth();

  /* =========================================================
     STATE
  ========================================================= */

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
  });

  /* =========================================================
     FETCH PROFILE
  ========================================================= */

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProfile();

      if (
        response.success &&
        response.data
      ) {
        const currentUser =
          response.data;

        setProfile(currentUser);

        setFormData({
          name:
            currentUser.name || "",

          email:
            currentUser.email || "",

          phone:
            currentUser.phone || "",

          designation:
            currentUser.designation ||
            "",

          department:
            currentUser.department ||
            "",

          bio:
            currentUser.bio || "",
        });

        /*
          Keep AuthContext/localStorage
          synchronized with MongoDB.
        */

        updateAuthUser(currentUser);
      } else {
        setError(
          "Unable to load your profile."
        );
      }
    } catch (err) {
      console.error(
        "Fetch Profile Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        designation:
          formData.designation.trim(),
        department:
          formData.department.trim(),
        bio: formData.bio.trim(),
      };

      const response =
        await updateProfile(payload);

      if (
        response.success &&
        response.data
      ) {
        const updatedUser =
          response.data;

        setProfile(updatedUser);

        setFormData({
          name:
            updatedUser.name || "",

          email:
            updatedUser.email || "",

          phone:
            updatedUser.phone || "",

          designation:
            updatedUser.designation ||
            "",

          department:
            updatedUser.department ||
            "",

          bio:
            updatedUser.bio || "",
        });

        /*
          Update AuthContext and
          localStorage.
        */

        updateAuthUser(updatedUser);

        setEditing(false);

        setSuccess(
          "Profile updated successfully."
        );

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      console.error(
        "Update Profile Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      designation:
        profile.designation || "",
      department:
        profile.department || "",
      bio: profile.bio || "",
    });

    setEditing(false);
    setError("");
  };

  /* =========================================================
     INITIALS
  ========================================================= */

  const getInitials = (name) => {
    if (!name) {
      return "TF";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (part) => part[0]
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar
          sidebarOpen={true}
        />

        <main className="profile-main">
          <Navbar />

          <div className="profile-loading">
            <div className="profile-spinner" />

            <h2>
              Loading Profile...
            </h2>

            <p>
              Fetching your information
              from the database.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (!profile) {
    return (
      <div className="profile-page">
        <Sidebar
          sidebarOpen={true}
        />

        <main className="profile-main">
          <Navbar />

          <div className="profile-error">
            <FaUserCircle />

            <h2>
              Unable to Load Profile
            </h2>

            <p>
              {error ||
                "No profile data was found."}
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

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="profile-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        sidebarOpen={true}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="profile-main">

        <Navbar />

        <section className="profile-container">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="profile-page-header">

            <div>
              <span className="profile-eyebrow">
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

            {!editing ? (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => {
                  setEditing(true);
                  setError("");
                  setSuccess("");
                }}
              >
                <FaEdit />

                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancel}
              >
                <FaTimes />

                Cancel
              </button>
            )}

          </div>

          {/* =================================================
              ALERTS
          ================================================= */}

          {error && (
            <div className="profile-alert error">
              {error}
            </div>
          )}

          {success && (
            <div className="profile-alert success">
              <FaCheckCircle />

              {success}
            </div>
          )}

          {/* =================================================
              PROFILE GRID
          ================================================= */}

          <div className="profile-grid">

            {/* ===============================================
                PROFILE CARD
            =============================================== */}

            <aside className="profile-card">

              <div className="profile-avatar-wrapper">

                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={
                      profile.name ||
                      "Profile"
                    }
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar profile-avatar-initials">
                    {getInitials(
                      profile.name
                    )}
                  </div>
                )}

                <span
                  className={`profile-status-dot ${
                    profile.status ===
                    "Active"
                      ? "active"
                      : "inactive"
                  }`}
                />
              </div>

              <h2>
                {profile.name ||
                  "User"}
              </h2>

              <p className="profile-designation">
                {profile.designation ||
                  "Team Member"}
              </p>

              <p className="profile-email">
                <FaEnvelope />

                {profile.email ||
                  "No email"}
              </p>

              <div className="profile-role">
                <FaShieldAlt />

                <span>
                  {profile.role ||
                    "Team Member"}
                </span>
              </div>

              <div
                className={`profile-account-status ${
                  profile.status ===
                  "Active"
                    ? "active"
                    : "inactive"
                }`}
              >
                <FaCheckCircle />

                {profile.status ||
                  "Active"}
              </div>

            </aside>

            {/* ===============================================
                DETAILS CARD
            =============================================== */}

            <section className="profile-details-card">

              <div className="profile-card-header">

                <div>
                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Your profile information
                    is stored securely in
                    MongoDB.
                  </p>
                </div>

                {!editing && (
                  <FaUser className="profile-header-icon" />
                )}

              </div>

              <form
                className="profile-form"
                onSubmit={handleSubmit}
              >

                {/* =========================================
                    NAME
                ========================================= */}

                <div className="profile-form-group">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <div className="profile-input-wrapper">

                    <FaUser />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      required
                    />

                  </div>

                </div>

                {/* =========================================
                    EMAIL
                ========================================= */}

                <div className="profile-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div className="profile-input-wrapper">

                    <FaEnvelope />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={
                        formData.email
                      }
                      disabled
                    />

                  </div>

                  <small>
                    Email cannot be changed
                    from the profile page.
                  </small>

                </div>

                {/* =========================================
                    PHONE
                ========================================= */}

                <div className="profile-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <div className="profile-input-wrapper">

                    <FaPhone />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                    />

                  </div>

                </div>

                {/* =========================================
                    DESIGNATION
                ========================================= */}

                <div className="profile-form-group">

                  <label htmlFor="designation">
                    Designation
                  </label>

                  <div className="profile-input-wrapper">

                    <FaBriefcase />

                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={
                        formData.designation
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                    />

                  </div>

                </div>

                {/* =========================================
                    DEPARTMENT
                ========================================= */}

                <div className="profile-form-group">

                  <label htmlFor="department">
                    Department
                  </label>

                  <div className="profile-input-wrapper">

                    <FaBuilding />

                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="e.g. Engineering"
                      value={
                        formData.department
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                    />

                  </div>

                </div>

                {/* =========================================
                    ROLE
                ========================================= */}

                <div className="profile-form-group">

                  <label>
                    Workspace Role
                  </label>

                  <div className="profile-readonly-field">

                    <FaShieldAlt />

                    <span>
                      {profile.role ||
                        "Team Member"}
                    </span>

                  </div>

                  <small>
                    Your workspace role is
                    managed by an administrator.
                  </small>

                </div>

                {/* =========================================
                    BIO
                ========================================= */}

                <div className="profile-form-group profile-full-width">

                  <label htmlFor="bio">
                    About Me
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    rows="6"
                    placeholder="Tell your team a little about yourself..."
                    value={
                      formData.bio
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                  />

                </div>

                {/* =========================================
                    ACTIONS
                ========================================= */}

                {editing && (
                  <div className="profile-form-actions">

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
                      className="profile-save-btn"
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
                )}

              </form>

            </section>

          </div>

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <section className="profile-account-card">

            <div>
              <span>
                ACCOUNT CREATED
              </span>

              <strong>
                {profile.createdAt
                  ? new Date(
                      profile.createdAt
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </strong>
            </div>

            <div>
              <span>
                LAST LOGIN
              </span>

              <strong>
                {profile.lastLogin
                  ? new Date(
                      profile.lastLogin
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Not available"}
              </strong>
            </div>

            <div>
              <span>
                AUTH PROVIDER
              </span>

              <strong>
                {profile.provider ||
                  "local"}
              </strong>
            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default Profile;