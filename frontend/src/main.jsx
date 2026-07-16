// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";


import App from "./App";


// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";


// Toast
import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";


// Global Styles
import "./styles/index.css";
import "./styles/Global.css";
import "./styles/Auth.css";



/* ==========================================
   APPLICATION STARTUP
========================================== */


console.log(
  "🚀 TaskFlow Client Started"
);



const rootElement =
  document.getElementById("root");


if (!rootElement) {

  throw new Error(
    "Root element not found"
  );

}



ReactDOM
.createRoot(rootElement)
.render(

  <React.StrictMode>


    <BrowserRouter>


      <AuthProvider>


        <UserProvider>


          <NotificationProvider>


            <ProjectProvider>


              <TaskProvider>


                <App />


                <ToastContainer

                  position="top-right"

                  autoClose={3000}

                  newestOnTop={true}

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