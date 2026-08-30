// src/layouts/MainLayout.jsx

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`taskflow-layout ${
        sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* =========================
          Sidebar
      ========================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =========================
          Main Area
      ========================== */}

      <div className="taskflow-main">

        {/* Navbar */}

        <Navbar
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
        />

        {/* Page */}

        <main className="taskflow-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;