// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaColumns,
  FaUsers,
  FaChartBar,
  FaUserCircle,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";

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
    title: "Profile",
    icon: <FaUserCircle />,
    path: "/profile",
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

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "TF";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }

    // Extra safety
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  const closeMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}

      <AnimatePresence>
        {sidebarOpen && window.innerWidth <= 768 && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}

      <motion.aside
        className={`sidebar ${
          sidebarOpen ? "expanded" : "collapsed"
        }`}
        animate={{
          width:
            window.innerWidth <= 768
              ? sidebarOpen
                ? 270
                : 0
              : sidebarOpen
              ? 270
              : 85,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {/* Header */}

        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              TF
            </div>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
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
                  <small>Workspace</small>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {window.innerWidth <= 768 &&
            sidebarOpen && (
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

        {/* User */}

        <div className="sidebar-user-card">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar initials">
              {initials}
            </div>
          )}

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <h4>{user?.name || "User"}</h4>

                <span>
                  {user?.role || "Member"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}

        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{
                opacity: 0,
                x: -15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.04,
              }}
            >
              <NavLink
                to={item.path}
                title={item.title}
                onClick={closeMobile}
                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >
                <div className="sidebar-icon">
                  {item.icon}
                </div>

                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />

            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
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