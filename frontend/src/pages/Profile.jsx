import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaPhoneAlt,
  FaSave,
  FaShieldAlt,
  FaTimes,
  FaUser,
  FaUserCircle,
  FaBuilding,
  FaBriefcase,
  FaClock,
  FaFingerprint,
  FaEdit,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import "../styles/Profile.css";

const EMPTY_FORM = {
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

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Profile() {
  const { user: authUser, updateUser } = useAuth();

  /* ==========================================
     STATE
  ========================================== */

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* ==========================================
     FETCH PROFILE
  ========================================== */

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      const data = response.data;

      if (!data?.success || !data?.user) {
        throw new Error(
          data?.message || "Unable to load profile."
        );
      }

      const currentUser = data.user;

      setProfile(currentUser);

      setForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        designation: currentUser.designation || "",
        department: currentUser.department || "",
        bio: currentUser.bio || "",
      });

      /*
       * Keep AuthContext / localStorage synchronized
       * with MongoDB.
       */
      updateUser(currentUser);
    } catch (err) {
      console.error(
        "Profile Fetch Error:",
        err.response?.data || err.message
      );

      /*
       * Fallback to AuthContext user if the profile
       * endpoint temporarily fails.
       */
      if (authUser) {
        setProfile(authUser);

        setForm({
          name: authUser.name || "",
          phone: authUser.phone || "",
          designation: authUser.designation || "",
          department: authUser.department || "",
          bio: authUser.bio || "",
        });
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, [authUser, updateUser]);

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/users/profile",
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          designation: form.designation.trim(),
          department: form.department.trim(),
          bio: form.bio.trim(),
        }
      );

      const data = response.data;

      if (!data?.success || !data?.user) {
        throw new Error(
          data?.message ||
            "Unable to update your profile."
        );
      }

      const updatedUser = data.user;

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

      updateUser(updatedUser);

      setSuccess(
        "Your profile has been updated successfully."
      );

      setEditing(false);

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(
        "Profile Update Error:",
        err.response?.data || err.message
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
     CANCEL EDIT
  ========================================== */

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      designation: profile.designation || "",
      department: profile.department || "",
      bio: profile.bio || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  /* ==========================================
     INITIALS
  ========================================== */

  const initials = useMemo(() => {
    const name = profile?.name || "TaskFlow";

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }, [profile?.name]);

  /* ==========================================
     ROLE
  ========================================== */

  const roleLabel =
    profile?.role || "Team Member";

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
            <div className="profile-loader">
              <div className="profile-loader-ring" />
              <FaUserCircle />
            </div>

            <h2>Loading your profile</h2>

            <p>
              Retrieving your account information...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================
     JSX
  ========================================== */

  return (
    <div className="profile-layout">
      <Sidebar />

      <main className="profile-main">
        <Navbar />

        <section className="profile-content">
          {/* =====================================
              HEADER
          ===================================== */}

          <div className="profile-page-header">
            <div>
              <div className="profile-eyebrow">
                <span className="eyebrow-dot" />
                ACCOUNT
              </div>

              <h1>
                My Profile
                <span className="verified-icon">
                  <FaCheckCircle />
                </span>
              </h1>

              <p>
                Manage your personal information and
                workspace profile details.
              </p>
            </div>

            <div className="profile-header-actions">
              {!editing && (
                <button
                  className="profile-edit-button"
                  onClick={() => {
                    setEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}

              {editing && (
                <button
                  className="profile-cancel-top"
                  onClick={handleCancel}
                >
                  <FaTimes />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* =====================================
              ALERTS
          ===================================== */}

          {error && (
            <div className="profile-alert profile-alert-error">
              <FaTimes />

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="profile-alert profile-alert-success">
              <FaCheckCircle />

              <span>{success}</span>
            </div>
          )}

          {/* =====================================
              MAIN PROFILE GRID
          ===================================== */}

          <div className="profile-grid">
            {/* ===================================
                PROFILE CARD
            =================================== */}

            <aside className="profile-card">
              <div className="profile-card-cover">
                <div className="cover-glow glow-one" />
                <div className="cover-glow glow-two" />

                <div className="profile-orbit orbit-one" />
                <div className="profile-orbit orbit-two" />
              </div>

              <div className="profile-card-body">
                {/* Avatar */}

                <div className="profile-avatar-wrapper">
                  {profile?.avatar ? (
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

                  <span
                    className={`profile-online-dot ${
                      profile?.status === "Inactive"
                        ? "inactive"
                        : ""
                    }`}
                  />
                </div>

                <div className="profile-card-name">
                  {profile?.name || "TaskFlow User"}
                </div>

                <div className="profile-card-role">
                  {profile?.designation ||
                    roleLabel}
                </div>

                <div className="profile-role-pill">
                  <FaShieldAlt />
                  {roleLabel}
                </div>

                <div className="profile-divider" />

                {/* Profile metadata */}

                <div className="profile-meta-list">
                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <FaEnvelope />
                    </span>

                    <div>
                      <small>Email</small>
                      <strong>
                        {profile?.email ||
                          "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <FaPhoneAlt />
                    </span>

                    <div>
                      <small>Phone</small>
                      <strong>
                        {profile?.phone ||
                          "Not added yet"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <FaBuilding />
                    </span>

                    <div>
                      <small>Department</small>
                      <strong>
                        {profile?.department ||
                          "Not assigned"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <FaBriefcase />
                    </span>

                    <div>
                      <small>Workspace Role</small>
                      <strong>{roleLabel}</strong>
                    </div>
                  </div>

                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <span
                        className={`status-dot ${
                          profile?.status ===
                          "Inactive"
                            ? "inactive"
                            : ""
                        }`}
                      />
                    </span>

                    <div>
                      <small>Account Status</small>
                      <strong>
                        {profile?.status ||
                          "Active"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-meta-item">
                    <span className="meta-icon">
                      <FaCalendarAlt />
                    </span>

                    <div>
                      <small>Joined</small>
                      <strong>
                        {formatDate(
                          profile?.createdAt
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ===================================
                INFORMATION CARD
            =================================== */}

            <section className="profile-information-card">
              <div className="information-header">
                <div>
                  <div className="information-title">
                    <span className="information-icon">
                      <FaUser />
                    </span>

                    <div>
                      <h2>
                        Personal Information
                      </h2>

                      <p>
                        Your profile information is
                        stored securely in MongoDB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="secure-badge">
                  <FaLock />
                  Secure
                </div>
              </div>

              <div className="information-divider" />

              <form
                className="profile-form"
                onSubmit={handleSubmit}
              >
                {/* Row 1 */}

                <div className="form-grid">
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
                        placeholder="Your full name"
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <div className="input-wrapper disabled-input">
                      <FaEnvelope />

                      <input
                        id="email"
                        type="email"
                        value={
                          profile?.email || ""
                        }
                        placeholder="Your email"
                        disabled
                      />
                    </div>

                    <span className="field-help">
                      Email cannot be changed from
                      the profile page.
                    </span>
                  </div>
                </div>

                {/* Row 2 */}

                <div className="form-grid">
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
                        placeholder="+91 XXXXX XXXXX"
                        disabled={!editing}
                      />
                    </div>
                  </div>

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
                        placeholder="e.g. Frontend Developer"
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}

                <div className="form-grid">
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
                        value={form.department}
                        onChange={handleChange}
                        placeholder="e.g. Engineering"
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="role">
                      Workspace Role
                    </label>

                    <div className="input-wrapper disabled-input">
                      <FaShieldAlt />

                      <input
                        id="role"
                        type="text"
                        value={roleLabel}
                        disabled
                      />
                    </div>

                    <span className="field-help">
                      Your workspace role is managed
                      by an administrator.
                    </span>
                  </div>
                </div>

                {/* Bio */}

                <div className="form-field form-field-full">
                  <div className="bio-label-row">
                    <label htmlFor="bio">
                      About Me
                    </label>

                    <span>
                      {form.bio.length}/500
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    name="bio"
                    maxLength={500}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell your team a little about yourself..."
                    disabled={!editing}
                  />
                </div>

                {/* Actions */}

                {editing && (
                  <div className="profile-form-actions">
                    <button
                      type="button"
                      className="profile-secondary-button"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-primary-button"
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

          {/* =====================================
              ACCOUNT INFORMATION
          ===================================== */}

          <section className="account-info-bar">
            <div className="account-info-item">
              <span className="account-info-icon">
                <FaCalendarAlt />
              </span>

              <div>
                <small>Account Created</small>

                <strong>
                  {formatDate(
                    profile?.createdAt
                  )}
                </strong>

                <span>
                  {formatTime(
                    profile?.createdAt
                  )}
                </span>
              </div>
            </div>

            <div className="account-info-item">
              <span className="account-info-icon">
                <FaClock />
              </span>

              <div>
                <small>Last Login</small>

                <strong>
                  {formatDate(
                    profile?.lastLogin
                  )}
                </strong>

                <span>
                  {formatTime(
                    profile?.lastLogin
                  )}
                </span>
              </div>
            </div>

            <div className="account-info-item">
              <span className="account-info-icon">
                <FaShieldAlt />
              </span>

              <div>
                <small>Auth Provider</small>

                <strong>
                  {profile?.provider
                    ? profile.provider
                        .charAt(0)
                        .toUpperCase() +
                      profile.provider.slice(1)
                    : "Local"}
                </strong>

                <span>
                  {profile?.provider === "google"
                    ? "Google Authentication"
                    : profile?.provider ===
                      "github"
                    ? "GitHub Authentication"
                    : "Email & Password"}
                </span>
              </div>
            </div>

            <div className="account-info-item">
              <span className="account-info-icon">
                <FaFingerprint />
              </span>

              <div>
                <small>User ID</small>

                <strong className="user-id">
                  {profile?._id
                    ? `USR-${profile._id
                        .slice(-8)
                        .toUpperCase()}`
                    : "Not available"}
                </strong>

                <span>
                  Unique account identifier
                </span>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Profile;