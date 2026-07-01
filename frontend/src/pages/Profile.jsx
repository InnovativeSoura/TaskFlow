import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Profile.css";

function Profile() {

  const API_URL = import.meta.env.VITE_API_URL;

  //----------------------------------
  // STATES
  //----------------------------------

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [profile, setProfile] =
    useState({

      name: "",

      email: "",

      phone: "",

      role: "",

      address: "",

      joinedAt: "",

      avatar: "",

    });

  const [passwords, setPasswords] =
    useState({

      currentPassword: "",

      newPassword: "",

      confirmPassword: "",

    });

  //----------------------------------
  // FETCH PROFILE
  //----------------------------------

  const fetchProfile = async () => {

    try {

      setLoading(true);

      const res = await axios.get(

        `${API_URL}/api/profile`

      );

      setProfile(res.data);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  useEffect(() => {

    fetchProfile();

  }, []);

  //----------------------------------
  // UPDATE PROFILE
  //----------------------------------

  const updateProfile = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      await axios.put(

        `${API_URL}/api/profile`,

        profile

      );

      alert("Profile updated successfully.");

    } catch (err) {

      console.error(err);

      alert("Unable to update profile.");

    }

    setSaving(false);

  };

  //----------------------------------
  // CHANGE PASSWORD
  //----------------------------------

  const changePassword = async (e) => {

    e.preventDefault();

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {

      alert("Passwords do not match.");

      return;

    }

    try {

      await axios.put(

        `${API_URL}/api/profile/password`,

        passwords

      );

      alert("Password updated.");

      setPasswords({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });

    } catch (err) {

      console.error(err);

      alert("Unable to update password.");

    }

  };

  //----------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>Loading Profile...</h2>

      </div>

    );

  }

  //----------------------------------

  return (

    <div className="profile-page">

      <Sidebar />

      <div className="profile-main">

        <Navbar />

        <div className="profile-container">

          {/* HEADER */}

          <div className="profile-header">

            <h1>My Profile</h1>

            <p>

              Manage your account information.

            </p>

          </div>
                    {/* ===============================
                  PROFILE INFORMATION
          =============================== */}

          <div className="profile-grid">

            <div className="profile-card">

              <div className="avatar-section">

                <div className="avatar">

                  {profile.avatar ? (

                    <img
                      src={profile.avatar}
                      alt={profile.name}
                    />

                  ) : (

                    <span>

                      {profile.name
                        ?.charAt(0)
                        .toUpperCase()}

                    </span>

                  )}

                </div>

                <h2>{profile.name}</h2>

                <p>{profile.role}</p>

              </div>

            </div>

            {/* ===============================
                    PROFILE FORM
            =============================== */}

            <div className="profile-card">

              <h2>
                Personal Information
              </h2>

              <form
                className="profile-form"
                onSubmit={updateProfile}
              >

                <label>

                  Full Name

                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                  />

                </label>

                <label>

                  Email Address

                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                  />

                </label>

                <label>

                  Phone Number

                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                  />

                </label>

                <label>

                  Address

                  <textarea
                    rows="4"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address:
                          e.target.value,
                      })
                    }
                  />

                </label>

                <label>

                  Role

                  <input
                    type="text"
                    value={profile.role}
                    disabled
                  />

                </label>

                <label>

                  Joined Date

                  <input
                    type="text"
                    value={
                      profile.joinedAt
                        ? new Date(
                            profile.joinedAt
                          ).toLocaleDateString()
                        : ""
                    }
                    disabled
                  />

                </label>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </form>

            </div>

          </div>
                    {/* ===============================
                  CHANGE PASSWORD
          =============================== */}

          <div className="profile-grid">

            <div className="profile-card">

              <h2>
                Change Password
              </h2>

              <form
                className="profile-form"
                onSubmit={changePassword}
              >

                <label>

                  Current Password

                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword:
                          e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <label>

                  New Password

                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword:
                          e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <label>

                  Confirm Password

                  <input
                    type="password"
                    value={
                      passwords.confirmPassword
                    }
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword:
                          e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <button
                  type="submit"
                  className="save-btn"
                >

                  Update Password

                </button>

              </form>

            </div>

            {/* ===============================
                    ACCOUNT SUMMARY
            =============================== */}

            <div className="profile-card">

              <h2>
                Account Summary
              </h2>

              <div className="summary-grid">

                <div className="summary-item">

                  <h3>
                    {profile.role || "Member"}
                  </h3>

                  <p>
                    Current Role
                  </p>

                </div>

                <div className="summary-item">

                  <h3>

                    {profile.email
                      ? "Verified"
                      : "Unknown"}

                  </h3>

                  <p>
                    Email Status
                  </p>

                </div>

                <div className="summary-item">

                  <h3>

                    {profile.phone
                      ? "Added"
                      : "Not Added"}

                  </h3>

                  <p>
                    Phone Number
                  </p>

                </div>

                <div className="summary-item">

                  <h3>

                    {profile.address
                      ? "Updated"
                      : "Missing"}

                  </h3>

                  <p>
                    Address
                  </p>

                </div>

              </div>

            </div>

          </div>
                    {/* ===============================
                  ACCOUNT INFORMATION
          =============================== */}

          <div className="profile-card">

            <h2>
              Account Information
            </h2>

            <div className="info-list">

              <div className="info-item">

                <span>
                  Account Type
                </span>

                <strong>
                  {profile.role || "Member"}
                </strong>

              </div>

              <div className="info-item">

                <span>
                  Registered Email
                </span>

                <strong>
                  {profile.email}
                </strong>

              </div>

              <div className="info-item">

                <span>
                  Phone
                </span>

                <strong>
                  {profile.phone || "Not Provided"}
                </strong>

              </div>

              <div className="info-item">

                <span>
                  Member Since
                </span>

                <strong>

                  {profile.joinedAt
                    ? new Date(
                        profile.joinedAt
                      ).toLocaleDateString()
                    : "N/A"}

                </strong>

              </div>

            </div>

          </div>

        </div>
        {/* profile-container */}

      </div>
      {/* profile-main */}

    </div>
    // profile-page 

  );

}

export default Profile;