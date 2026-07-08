import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";

import "./index.css";
import "./styles/Global.css";
import "./styles/Auth.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
         <NotificationProvider>
          <ProjectProvider>
            <TaskProvider>
              <App />
            </TaskProvider>
          </ProjectProvider>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);