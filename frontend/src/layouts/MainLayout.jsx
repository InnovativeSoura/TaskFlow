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
          MAIN APPLICATION AREA
      ========================================== */}
      <section className="taskflow-main">

        {/* FIXED TOP NAVBAR */}
        <header className="taskflow-navbar">
          <Navbar />
        </header>

        {/* SCROLLABLE PAGE AREA */}
        <main className="taskflow-page-content">
          {children}
        </main>

      </section>

    </div>
  );
};

export default MainLayout;