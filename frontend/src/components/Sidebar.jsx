// src/components/Sidebar.jsx

import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaThLarge,
  FaFolder,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const username =
    user?.name ||
    user?.username ||
    "Souradipta Patra";

  const role =
    user?.role ||
    "Administrator";

  const avatarInitials = useMemo(() => {
    const name = username?.trim();

    if (!name) return "TF";

    const words = name
      .split(" ")
      .filter(Boolean);

    if (words.length === 1)
      return words[0][0].toUpperCase();

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  }, [username]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaThLarge />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaFolder />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      name: "Kanban",
      path: "/kanban",
      icon: <FaColumns />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FaBell />,
    },
  ];

  const sidebarVariants = {
    expanded: {
      width: 290,
      transition: {
        duration: 0.35,
        ease: "easeInOut",
      },
    },

    collapsed: {
      width: 92,
      transition: {
        duration: 0.35,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: -15,
    },

    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      <div className="sidebar-inner">
                {/* =========================================
                    WORKSPACE CARD
        ========================================= */}

        <motion.div
          className="workspace-card"
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
        >
          <button
            className="workspace-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            {/* Logo */}

            <div className="workspace-left">

              <div className="workspace-logo">

                <span>TF</span>

                <div className="workspace-status"></div>

              </div>

              <AnimatePresence mode="wait">

                {!collapsed && (

                  <motion.div
                    className="workspace-content"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >

                    <h3>TaskFlow</h3>

                    <p>Workspace</p>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            <AnimatePresence>

              {!collapsed && (

                <motion.div
                  className="workspace-arrow"
                  initial={{
                    opacity: 0,
                    rotate: -180,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -180,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >

                  <FaChevronLeft />

                </motion.div>

              )}

            </AnimatePresence>

            {collapsed && (

              <motion.div
                className="workspace-arrow collapsed-arrow"
                initial={{
                  opacity: 0,
                  rotate: 180,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                <FaChevronRight />

              </motion.div>

            )}

          </button>

        </motion.div>
                {/* =========================================
                    PROFILE CARD
        ========================================= */}

        <motion.div
          className="profile-card"
          initial={false}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
        >

          <div className="profile-left">

            <div className="profile-avatar">

              <span>{avatarInitials}</span>

              <div className="profile-online"></div>

            </div>

            <AnimatePresence mode="wait">

              {!collapsed && (

                <motion.div
                  className="profile-info"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >

                  <h4>{username}</h4>

                  <span>{role}</span>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        </motion.div>



        {/* =========================================
                    MENU TITLE
        ========================================= */}

        <AnimatePresence>

          {!collapsed && (

            <motion.div
              className="menu-title"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >

              MENU

            </motion.div>

          )}

        </AnimatePresence>



        {/* =========================================
                    NAVIGATION
        ========================================= */}

        <nav className="sidebar-navigation">

          {menuItems.map((item) => {

            const active =
              location.pathname === item.path;

            return (

              <NavLink
                key={item.name}
                to={item.path}
                className={`sidebar-link ${
                  active ? "active" : ""
                }`}
              >

                {active && (

                  <motion.div
                    layoutId="activeIndicator"
                    className="active-indicator"
                  />

                )}

                <span className="sidebar-icon">

                  {item.icon}

                </span>

                <AnimatePresence>

                  {!collapsed && (

                    <motion.span
                      className="sidebar-label"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >

                      {item.name}

                    </motion.span>

                  )}

                </AnimatePresence>

              </NavLink>

            );

          })}

        </nav>
                {/* =========================================
                    FOOTER
        ========================================= */}

        <div className="sidebar-footer">

          <motion.button
            className="logout-button"
            onClick={handleLogout}
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >

            <span className="sidebar-icon">

              <FaSignOutAlt />

            </span>

            <AnimatePresence mode="wait">

              {!collapsed && (

                <motion.span
                  className="sidebar-label"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >

                  Logout

                </motion.span>

              )}

            </AnimatePresence>

          </motion.button>

        </div>

      </div>

    </motion.aside>

  );

};

export default Sidebar;