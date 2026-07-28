// src/layouts/MainLayout.jsx

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="taskflow-layout">

      {/* =====================================================
          SIDEBAR
          Fixed independently.
          Collapse / expand is controlled from Sidebar logo.
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="taskflow-main">

        {/* =================================================
            NAVBAR

            Navbar belongs INSIDE the main area so it
            never overlaps the sidebar.
        ================================================= */}

        <Navbar />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="taskflow-page-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;