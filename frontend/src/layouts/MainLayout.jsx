// src/layouts/MainLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="taskflow-layout">

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <aside className="taskflow-sidebar">
        <Sidebar />
      </aside>

      {/* ==========================================
          APPLICATION AREA
      ========================================== */}
      <div className="taskflow-main">

        {/* ========================================
            TOP NAVBAR
        ======================================== */}
        <header className="taskflow-navbar">
          <Navbar />
        </header>

        {/* ========================================
            PAGE CONTENT
        ======================================== */}
        <main className="taskflow-page-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;