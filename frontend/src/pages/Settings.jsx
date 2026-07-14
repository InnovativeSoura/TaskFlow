import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

import "../styles/Settings.css";

const Settings = () => {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [notifications, setNotifications] = useState(true);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changeTheme = () => {
    const value = !darkMode;

    setDarkMode(value);

    localStorage.setItem(
      "theme",
      value ? "dark" : "light"
    );

    document.body.classList.toggle(
      "dark-theme",
      value
    );
  };

  const savePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.put("/users/change-password", password);

      alert("Password Updated");

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to update password"
      );
    }
  };

  return (
    <MainLayout>

      <div className="settings-page">

        <h1>Settings</h1>

        <div className="settings-grid">

          <div className="settings-card">

            <h2>Account</h2>

            <p>
              Logged in as
            </p>

            <h3>{user?.name}</h3>

            <span>{user?.email}</span>

          </div>

          <div className="settings-card">

            <h2>Appearance</h2>

            <label className="switch-row">

              <span>Dark Mode</span>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={changeTheme}
              />

            </label>

          </div>

          <div className="settings-card">

            <h2>Notifications</h2>

            <label className="switch-row">

              <span>Email Notifications</span>

              <input
                type="checkbox"
                checked={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
              />

            </label>

          </div>

          <div className="settings-card">

            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={password.currentPassword}
              onChange={(e)=>
                setPassword({
                  ...password,
                  currentPassword:e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={password.newPassword}
              onChange={(e)=>
                setPassword({
                  ...password,
                  newPassword:e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={password.confirmPassword}
              onChange={(e)=>
                setPassword({
                  ...password,
                  confirmPassword:e.target.value
                })
              }
            />

            <button onClick={savePassword}>
              Update Password
            </button>

          </div>

          <div className="settings-card">

            <h2>Application</h2>

            <p>
              <strong>Version</strong>
            </p>

            <span>TaskFlow v1.0</span>

            <p>
              MERN Stack • React • Node • MongoDB
            </p>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default Settings;