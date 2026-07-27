import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`layout ${
        sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
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

      <div className="main-content">
        {/* ===================================================
            TOP NAVBAR
        =================================================== */}

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="page-content">
          <div className="page-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;