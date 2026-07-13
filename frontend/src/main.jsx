import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";

import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";

ReactDOM.createRoot(document.getElementById("root")).render(
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