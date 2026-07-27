// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global Styles
import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";
import "./styles/Landing.css";

console.log("🚀 TaskFlow Client Started");

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ProjectProvider>
            <TaskProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </TaskProvider>
          </ProjectProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);