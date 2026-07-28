// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

/* =========================================================
   APP
========================================================= */

import App from "./App";

/* =========================================================
   CONTEXT PROVIDERS
========================================================= */

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  UserProvider,
} from "./context/UserContext";

import {
  NotificationProvider,
} from "./context/NotificationContext";

import {
  ProjectProvider,
} from "./context/ProjectContext";

import {
  TaskProvider,
} from "./context/TaskContext";

/* =========================================================
   TOAST
========================================================= */

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

/* =========================================================
   GLOBAL STYLES
========================================================= */

import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";
import "./styles/Landing.css";

/* =========================================================
   STARTUP
========================================================= */

console.log(
  "===================================="
);

console.log(
  "🚀 TaskFlow Client Started"
);

console.log(
  "===================================="
);

/* =========================================================
   ROOT
========================================================= */

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

/* =========================================================
   APPLICATION
========================================================= */

root.render(
  <React.StrictMode>

    <BrowserRouter>

      {/* ==========================================
          GLOBAL THEME PROVIDER

          IMPORTANT:
          This must wrap every component that
          uses useTheme().
      ========================================== */}

      <ThemeProvider>

        {/* ========================================
            AUTH
        ======================================== */}

        <AuthProvider>

          {/* ======================================
              USER
          ====================================== */}

          <UserProvider>

            {/* ====================================
                NOTIFICATIONS
            ==================================== */}

            <NotificationProvider>

              {/* ==================================
                  PROJECTS
              ================================== */}

              <ProjectProvider>

                {/* ================================
                    TASKS
                ================================== */}

                <TaskProvider>

                  <App />

                  {/* ==============================
                      TOAST
                  ============================== */}

                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                  />

                </TaskProvider>

              </ProjectProvider>

            </NotificationProvider>

          </UserProvider>

        </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);