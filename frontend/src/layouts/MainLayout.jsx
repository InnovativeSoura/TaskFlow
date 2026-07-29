// src/layouts/MainLayout.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/MainLayout.css";


const MainLayout = ({ children }) => {

  /* =========================================================
     SIDEBAR STATE
  ========================================================= */

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(() => {

      try {

        return (
          localStorage.getItem(
            "taskflow-sidebar-collapsed"
          ) === "true"
        );

      } catch {

        return false;

      }

    });


  /* =========================================================
     SAVE SIDEBAR STATE
  ========================================================= */

  useEffect(() => {

    try {

      localStorage.setItem(
        "taskflow-sidebar-collapsed",
        String(sidebarCollapsed)
      );

    } catch {

      // Ignore storage errors

    }

  }, [sidebarCollapsed]);


  /* =========================================================
     TOGGLE SIDEBAR
  ========================================================= */

  const toggleSidebar = () => {

    setSidebarCollapsed(
      (current) => !current
    );

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div
      className={`taskflow-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="taskflow-sidebar">

        <Sidebar />

        {/* ================================================
            SIDEBAR COLLAPSE BUTTON
        ================================================= */}

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={toggleSidebar}
          aria-label={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >

          {sidebarCollapsed ? (
            <FaChevronRight />
          ) : (
            <FaChevronLeft />
          )}

        </button>

      </aside>


      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <section className="taskflow-main">

        {/* =================================================
            FIXED NAVBAR
        ================================================= */}

        <header className="taskflow-navbar">

          <Navbar />

        </header>


        {/* =================================================
            SCROLLABLE PAGE CONTENT
        ================================================= */}

        <main className="taskflow-page-content">

          {children}

        </main>

      </section>

    </div>

  );

};


export default MainLayout;