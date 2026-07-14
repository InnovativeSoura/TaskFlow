import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import "../styles/Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
    department: user?.department || "",
    bio: user?.bio || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await api.put(
        `/users/${user._id}`,
        form
      );

      const updated =
        res.data.user ||
        res.data.data ||
        res.data;

      updateUser(updated);

      alert("Profile Updated Successfully");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>

      <div className="profile-page">

        <div className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                />
              ) : (
                user?.name
                  ?.substring(0,2)
                  .toUpperCase()
              )}

            </div>

            <div>

              <h2>{user?.name}</h2>

              <p>{user?.role}</p>

            </div>

          </div>

          <div className="profile-form">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />

            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Designation"
            />

            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
            />

            <textarea
              rows="5"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
            />

            <button
              onClick={saveProfile}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default Profile;