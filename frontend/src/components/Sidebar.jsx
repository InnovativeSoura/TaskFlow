// src/components/Sidebar.jsx

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

/* =========================================================
   CONSTANTS
========================================================= */

const SIDEBAR_EXPANDED_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 76;
const MOBILE_BREAKPOINT = 768;

/* =========================================================
   MENU ITEMS
========================================================= */

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    path: "/dashboard",
  },
  {
    title: "Projects",
    icon: <FaProjectDiagram />,
    path: "/projects",
  },
  {
    title: "Tasks",
    icon: <FaTasks />,
    path: "/tasks",
  },
  {
    title: "Kanban",
    icon: <FaColumns />,
    path: "/kanban",
  },
  {
    title: "Users",
    icon: <FaUsers />,
    path: "/users",
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    path: "/notifications",
  },
];

/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

const Sidebar = ({
  sidebarOpen: controlledSidebarOpen,
  setSidebarOpen: controlledSetSidebarOpen,
}) => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  /* =======================================================
     INTERNAL STATE
  ======================================================= */

  const [
    internalSidebarOpen,
    setInternalSidebarOpen,
  ] = useState(true);

  const sidebarOpen =
    typeof controlledSidebarOpen === "boolean"
      ? controlledSidebarOpen
      : internalSidebarOpen;

  const setSidebarOpen = (value) => {
    if (
      typeof controlledSetSidebarOpen === "function"
    ) {
      controlledSetSidebarOpen(value);
    } else {
      setInternalSidebarOpen(value);
    }
  };

  /* =======================================================
     MOBILE
  ======================================================= */

  const [
    isMobile,
    setIsMobile,
  ] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= MOBILE_BREAKPOINT
      : false
  );
    /* =======================================================
     PUBLISH SIDEBAR STATE
  ======================================================= */

  useEffect(() => {

    const width = isMobile
      ? sidebarOpen
        ? SIDEBAR_EXPANDED_WIDTH
        : 0
      : sidebarOpen
      ? SIDEBAR_EXPANDED_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH;

    document.documentElement.style.setProperty(
      "--taskflow-sidebar-width",
      `${width}px`
    );

    window.dispatchEvent(
      new CustomEvent(
        "taskflow-sidebar-change",
        {
          detail: {
            open: sidebarOpen,
            collapsed: !sidebarOpen,
            width,
            mobile: isMobile,
          },
        }
      );

  }, [sidebarOpen, isMobile]);

  /* =======================================================
     RESPONSIVE
  ======================================================= */

  useEffect(() => {

    const handleResize = () => {

      const mobile =
        window.innerWidth <= MOBILE_BREAKPOINT;

      setIsMobile(mobile);

      if (mobile) {

        setSidebarOpen(false);

      }

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  /* =======================================================
     USER INITIALS
  ======================================================= */

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((item) => item[0])
      ?.join("")
      ?.substring(0, 2)
      ?.toUpperCase() || "TF";

  /* =======================================================
     HELPERS
  ======================================================= */

  const toggleSidebar = () => {

    setSidebarOpen(!sidebarOpen);

  };

  const closeMobile = () => {

    if (isMobile) {

      setSidebarOpen(false);

    }

  };

  const handleProfileClick = () => {

    navigate("/profile");

    closeMobile();

  };

  const handleLogout = async () => {

    try {

      if (typeof logout === "function") {

        await logout();

      }

    } catch (err) {

      console.error(err);

    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });

  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      <AnimatePresence>

        {isMobile && sidebarOpen && (

          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        )}

      </AnimatePresence>

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen
            ? "expanded"
            : "collapsed"
        } ${
          isMobile
            ? "mobile"
            : ""
        }`}
        animate={{
          width: isMobile
            ? sidebarOpen
              ? SIDEBAR_EXPANDED_WIDTH
              : 0
            : sidebarOpen
            ? SIDEBAR_EXPANDED_WIDTH
            : SIDEBAR_COLLAPSED_WIDTH,
        }}
        transition={{
          duration: 0.28,
        }}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="sidebar-header">

          <button
            type="button"
            className="sidebar-brand-button"
            onClick={toggleSidebar}
          >

            {/* LOGO */}

            <div className="brand-logo">

              TF

            </div>

            {/* BRAND */}

            <AnimatePresence>

              {sidebarOpen && (

                <motion.div
                  className="brand-content"
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                  }}
                >

                  <h2>TaskFlow</h2>

                  <span>
                    Workspace
                  </span>

                </motion.div>

              )}

            </AnimatePresence>

            {!isMobile && (

              <div className="sidebar-collapse-icon">

                {sidebarOpen ? (
                  <FaChevronLeft />
                ) : (
                  <FaChevronRight />
                )}

              </div>

            )}

          </button>

          {isMobile && sidebarOpen && (

            <button
              className="close-sidebar"
              onClick={() =>
                setSidebarOpen(false)
              }
            >
              <FaTimes />
            </button>

          )}

        </div>

        <div className="sidebar-divider" />

        {/* ==========================================
            PROFILE
        ========================================== */}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-user-card ${
              isActive
                ? "profile-active"
                : ""
            }`
          }
          onClick={handleProfileClick}
        >

          <div className="sidebar-avatar-wrapper">

            {user?.avatar ? (

              <img
                src={user.avatar}
                alt=""
                className="sidebar-avatar"
              />

            ) : (

              <div className="sidebar-avatar initials">

                {initials}

              </div>

            )}

            <span className="profile-online-dot" />

          </div>

          <AnimatePresence>

            {sidebarOpen && (

              <motion.div
                className="sidebar-user-info"
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -8,
                }}
              >

                <strong>

                  {user?.name || "User"}

                </strong>

                <span>

                  {user?.role || "Member"}

                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {sidebarOpen && (

            <FaChevronRight
              className="profile-arrow"
            />

          )}

        </NavLink>
                {/* =================================================
            BOTTOM SECTION
        ================================================= */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title={
              !sidebarOpen
                ? "Logout"
                : undefined
            }
          >

            <span className="logout-icon">
              <FaSignOutAlt />
            </span>

            <AnimatePresence>

              {sidebarOpen && (

                <motion.span
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  Logout
                </motion.span>

              )}

            </AnimatePresence>

          </button>

        </div>

      </motion.aside>

    </>
  );
};

export default Sidebar;