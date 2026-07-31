// src/layouts/MainLayout.jsx

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      {/* FULL WIDTH NAVBAR */}

      <header className="taskflow-navbar">
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={toggleSidebar}
        />
      </header>

      {/* BODY */}

      <div className="taskflow-body">

        {/* SIDEBAR */}

        <aside className="taskflow-sidebar">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
        </aside>

        {/* PAGE */}

        <main className="taskflow-page-content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;