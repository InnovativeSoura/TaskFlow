// src/layouts/MainLayout.jsx

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

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
          onToggle={() =>
            setSidebarCollapsed((prev) => !prev)
          }
        />
      </aside>


      {/* ==========================================
          MAIN APPLICATION
      ========================================== */}

      <section className="taskflow-main">

        {/* ========================================
            FIXED / STICKY NAVBAR
        ======================================== */}

        <header className="taskflow-navbar">
          <Navbar
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() =>
              setSidebarCollapsed((prev) => !prev)
            }
          />
        </header>


        {/* ========================================
            PAGE CONTENT
        ======================================== */}

        <main className="taskflow-page-content">
          {children}
        </main>

      </section>

    </div>
  );
};

export default MainLayout;