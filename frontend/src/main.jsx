// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

/* =========================================================
   CONTEXT PROVIDERS
========================================================= */

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";

/* =========================================================
   TOAST
========================================================= */

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

/* =========================================================
   GLOBAL STYLES
========================================================= */

import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";
import "./styles/Landing.css";


/* =========================================================
   TASKFLOW CLIENT STARTUP
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
   INITIAL THEME
========================================================= */

/*
  Navbar controls the theme after the application
  has loaded.

  We initialize the HTML element here so there
  is no visible flash between themes.
*/

const initializeTheme = () => {

  try {

    const savedTheme =
      localStorage.getItem("theme");


    /* -----------------------------------------
       SAVED DARK THEME
    ----------------------------------------- */

    if (savedTheme === "dark") {

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      document.documentElement.classList.add(
        "dark-theme"
      );

      document.documentElement.classList.remove(
        "light-theme"
      );

      document.body?.classList.add(
        "dark-theme"
      );

      document.body?.classList.remove(
        "light-theme"
      );

      return;

    }


    /* -----------------------------------------
       SAVED LIGHT THEME
    ----------------------------------------- */

    if (savedTheme === "light") {

      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );

      document.documentElement.classList.add(
        "light-theme"
      );

      document.documentElement.classList.remove(
        "dark-theme"
      );

      document.body?.classList.add(
        "light-theme"
      );

      document.body?.classList.remove(
        "dark-theme"
      );

      return;

    }


    /* -----------------------------------------
       SYSTEM PREFERENCE
    ----------------------------------------- */

    const prefersDark =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;


    const theme =
      prefersDark
        ? "dark"
        : "light";


    document.documentElement.setAttribute(
      "data-theme",
      theme
    );


    document.documentElement.classList.toggle(
      "dark-theme",
      prefersDark
    );


    document.documentElement.classList.toggle(
      "light-theme",
      !prefersDark
    );


    document.body?.classList.toggle(
      "dark-theme",
      prefersDark
    );


    document.body?.classList.toggle(
      "light-theme",
      !prefersDark
    );


  } catch (error) {

    console.warn(
      "⚠️ Theme initialization failed:",
      error
    );

  }

};


/* =========================================================
   APPLY INITIAL THEME
========================================================= */

initializeTheme();


/* =========================================================
   ROOT
========================================================= */

const rootElement =
  document.getElementById("root");


if (!rootElement) {

  throw new Error(
    "❌ TaskFlow root element (#root) was not found."
  );

}


const root =
  ReactDOM.createRoot(
    rootElement
  );


/* =========================================================
   APPLICATION
========================================================= */

root.render(

  <React.StrictMode>

    <BrowserRouter>

      {/* =================================================
          AUTH PROVIDER
      ================================================= */}

      <AuthProvider>

        {/* ===============================================
            USER PROVIDER
        =============================================== */}

        <UserProvider>

          {/* =============================================
              NOTIFICATION PROVIDER
          ============================================= */}

          <NotificationProvider>

            {/* ===========================================
                PROJECT PROVIDER
            =========================================== */}

            <ProjectProvider>

              {/* =========================================
                  TASK PROVIDER
              ========================================= */}

              <TaskProvider>

                {/* =======================================
                    MAIN APPLICATION
                ======================================= */}

                <App />


                {/* =======================================
                    GLOBAL TOAST
                ======================================= */}

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

    </BrowserRouter>

  </React.StrictMode>

);