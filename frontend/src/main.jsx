import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";

import { AuthProvider } from "./context/AuthContext";

import { UserProvider } from "./context/UserContext";

import { NotificationProvider } from "./context/NotificationContext";

import { ProjectProvider } from "./context/ProjectContext";

import { TaskProvider } from "./context/TaskContext";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";
import "./styles/Landing.css";

console.log("====================================");

console.log("🚀 TaskFlow Client Started");

console.log("====================================");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <NotificationProvider>
              <ProjectProvider>
                <TaskProvider>
                  <App />

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
  </React.StrictMode>,
);
