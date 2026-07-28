// src/layouts/MainLayout.jsx

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./MainLayout.css";

const MainLayout = ({ children }) => {
  /*
  =========================================================
  SIDEBAR STATE
  =========================================================
  true  = expanded
  false = collapsed

  The state is controlled by the TaskFlow logo inside
  Sidebar.jsx.
  */

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`layout ${
        sidebarOpen
          ? "sidebar-expanded"
          : "sidebar-collapsed"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div
        className={`main-content ${
          sidebarOpen
            ? "sidebar-expanded"
            : "sidebar-collapsed"
        }`}
      >
        {/* ===================================================
            TOP NAVBAR

            IMPORTANT:
            Navbar no longer needs to control the sidebar.
            Do NOT add a hamburger/collapse button there.
        =================================================== */}

        <Navbar />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;