// src/layouts/MainLayout.jsx

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`taskflow-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      }`}
    >
      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="taskflow-sidebar">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </aside>

      {/* ==========================================
          MAIN APPLICATION
      ========================================== */}

      <section className="taskflow-main">

        {/* ======================================
            NAVBAR
        ====================================== */}

        <header className="taskflow-navbar">
          <Navbar
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={toggleSidebar}
          />
        </header>

        {/* ======================================
            PAGE CONTENT
        ====================================== */}

        <main className="taskflow-page-content">
          {children}
        </main>

      </section>

    </div>
  );
};

export default MainLayout;