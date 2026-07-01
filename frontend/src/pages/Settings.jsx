import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Settings.css";

function Settings() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [settings, setSettings] =
    useState({

      darkMode: false,

      emailNotifications: true,

      pushNotifications: true,

      profileVisibility: "Public",

      language: "English",

      timezone: "Asia/Kolkata",

      autoSave: true,

    });

  //---------------------------------
  // FETCH SETTINGS
  //---------------------------------

  const fetchSettings = async () => {

    try {

      setLoading(true);

      const res = await axios.get(

        `${API_URL}/api/settings`

      );

      setSettings(res.data);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  useEffect(() => {

    fetchSettings();

  }, []);

  //---------------------------------
  // SAVE SETTINGS
  //---------------------------------

  const saveSettings = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      await axios.put(

        `${API_URL}/api/settings`,

        settings

      );

      alert("Settings saved successfully.");

    } catch (err) {

      console.error(err);

      alert("Unable to save settings.");

    }

    setSaving(false);

  };

  //---------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>
          Loading Settings...
        </h2>

      </div>

    );

  }

  //---------------------------------

  return (

    <div className="settings-page">

      <Sidebar />

      <div className="settings-main">

        <Navbar />

        <div className="settings-container">

          <div className="settings-header">

            <h1>
              Settings
            </h1>

            <p>

              Customize your TaskFlow
              experience.

            </p>

          </div>

          <form
            className="settings-form"
            onSubmit={saveSettings}
          >
                        {/* ======================================
                    APPEARANCE SETTINGS
            ====================================== */}

            <div className="settings-card">

              <h2>Appearance</h2>

              <div className="setting-item">

                <div>

                  <h3>Dark Mode</h3>

                  <p>
                    Enable dark theme for the application.
                  </p>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        darkMode: e.target.checked,
                      })
                    }
                  />

                  <span className="slider"></span>

                </label>

              </div>

            </div>

            {/* ======================================
                  NOTIFICATION SETTINGS
            ====================================== */}

            <div className="settings-card">

              <h2>Notifications</h2>

              <div className="setting-item">

                <div>

                  <h3>Email Notifications</h3>

                  <p>
                    Receive updates via email.
                  </p>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications:
                          e.target.checked,
                      })
                    }
                  />

                  <span className="slider"></span>

                </label>

              </div>

              <div className="setting-item">

                <div>

                  <h3>Push Notifications</h3>

                  <p>
                    Receive browser notifications.
                  </p>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pushNotifications:
                          e.target.checked,
                      })
                    }
                  />

                  <span className="slider"></span>

                </label>

              </div>

            </div>

            {/* ======================================
                    PRIVACY SETTINGS
            ====================================== */}

            <div className="settings-card">

              <h2>Privacy</h2>

              <label>

                Profile Visibility

                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profileVisibility:
                        e.target.value,
                    })
                  }
                >

                  <option value="Public">
                    Public
                  </option>

                  <option value="Private">
                    Private
                  </option>

                  <option value="Team Only">
                    Team Only
                  </option>

                </select>

              </label>

            </div>

            {/* ======================================
                LANGUAGE & TIMEZONE
            ====================================== */}

            <div className="settings-card">

              <h2>
                Regional Settings
              </h2>

              <label>

                Language

                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      language:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    English
                  </option>

                  <option>
                    Hindi
                  </option>

                  <option>
                    Bengali
                  </option>

                </select>

              </label>

              <label>

                Time Zone

                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timezone:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Asia/Kolkata
                  </option>

                  <option>
                    UTC
                  </option>

                  <option>
                    America/New_York
                  </option>

                  <option>
                    Europe/London
                  </option>

                </select>

              </label>

            </div>

            {/* ======================================
                  AUTO SAVE
            ====================================== */}

            <div className="settings-card">

              <div className="setting-item">

                <div>

                  <h3>
                    Auto Save
                  </h3>

                  <p>

                    Automatically save changes while editing.

                  </p>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoSave:
                          e.target.checked,
                      })
                    }
                  />

                  <span className="slider"></span>

                </label>

              </div>

            </div>
                        {/* ======================================
                    ACTION BUTTONS
            ====================================== */}

            <div className="settings-actions">

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Settings"}
              </button>

              <button
                type="button"
                className="reset-btn"
                onClick={fetchSettings}
              >
                Reset Changes
              </button>

            </div>

          </form>

          {/* ======================================
                  SETTINGS SUMMARY
          ====================================== */}

          <div className="settings-card">

            <h2>
              Current Preferences
            </h2>

            <div className="summary-grid">

              <div className="summary-item">

                <h3>
                  {settings.darkMode
                    ? "Enabled"
                    : "Disabled"}
                </h3>

                <p>Dark Mode</p>

              </div>

              <div className="summary-item">

                <h3>
                  {settings.emailNotifications
                    ? "Enabled"
                    : "Disabled"}
                </h3>

                <p>Email Alerts</p>

              </div>

              <div className="summary-item">

                <h3>
                  {settings.profileVisibility}
                </h3>

                <p>Profile Visibility</p>

              </div>

              <div className="summary-item">

                <h3>
                  {settings.language}
                </h3>

                <p>Language</p>

              </div>

              <div className="summary-item">

                <h3>
                  {settings.timezone}
                </h3>

                <p>Time Zone</p>

              </div>

              <div className="summary-item">

                <h3>
                  {settings.autoSave
                    ? "Enabled"
                    : "Disabled"}
                </h3>

                <p>Auto Save</p>

              </div>

            </div>

          </div>

        </div>
        {/* settings-container */}

      </div>
      {/* settings-main */}

    </div>
    // settings-page 

  );

}

export default Settings;