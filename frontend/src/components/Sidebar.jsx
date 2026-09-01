import React, {
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

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


 

  const {
    user,
    logout,
  } = useAuth();


  

  const username =
    user?.name ||
    user?.username ||
    "Souradipta Patra";

  const role =
    user?.role ||
    "Administrator";


  

  const avatarInitials = useMemo(() => {

    if (!username) {
      return "TF";
    }

    const words = username
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();

  }, [username]);


  

  const handleLogout = async () => {

    try {

      if (typeof logout === "function") {
        await logout();
      }

    } catch (error) {

      console.error(
        "Logout Error:",
        error
      );

    } finally {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/");

    }
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

      width: 280,

      transition: {
        duration: 0.35,
        ease: "easeInOut",
      },

    },

    collapsed: {

      width: 90,

      transition: {
        duration: 0.35,
        ease: "easeInOut",
      },

    },

  };


  

  const textVariants = {

    hidden: {

      opacity: 0,
      x: -10,

    },

    visible: {

      opacity: 1,
      x: 0,

      transition: {
        duration: 0.2,
      },

    },

    exit: {

      opacity: 0,
      x: -10,

      transition: {
        duration: 0.15,
      },

    },

  };


 

  return (

    <motion.aside
      className={`sidebar ${
        collapsed ? "collapsed" : ""
      }`}

      variants={sidebarVariants}

      animate={
        collapsed
          ? "collapsed"
          : "expanded"
      }

      initial={false}
    >

      <div className="sidebar-inner">


        

        <motion.div
          className="workspace-card"

          whileHover={{
            y: -2,
          }}

          transition={{
            duration: 0.2,
          }}
        >

          <button
            type="button"
            className="workspace-button"

            onClick={() =>
              setCollapsed(
                (previous) =>
                  !previous
              )
            }

            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >

            <div className="workspace-left">

              

              <div className="workspace-logo">

                <span className="workspace-logo-text">
                  TF
                </span>

              </div>


             

              <AnimatePresence mode="wait">

                {!collapsed && (

                  <motion.div
                    className="workspace-content"

                    variants={textVariants}

                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >

                    <h3>
                      TaskFlow
                    </h3>

                    <p>
                      Workspace
                    </p>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>


            

            <AnimatePresence mode="wait">

              {!collapsed ? (

                <motion.div
                  key="expanded"
                  className="workspace-arrow"

                  initial={{
                    opacity: 0,
                    rotate: -90,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: -90,
                  }}
                >

                  <FaChevronLeft />

                </motion.div>

              ) : (

                <motion.div
                  key="collapsed"
                  className="workspace-arrow"

                  initial={{
                    opacity: 0,
                    rotate: 90,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: 90,
                  }}
                >

                  <FaChevronRight />

                </motion.div>

              )}

            </AnimatePresence>

          </button>

        </motion.div>


        

        <motion.div
          className="profile-card"

          whileHover={{
            y: -2,
          }}

          transition={{
            duration: 0.2,
          }}
        >

          <div className="profile-left">

            

            <div className="profile-avatar">

              {avatarInitials}

              <span className="profile-online" />

            </div>


            

            <AnimatePresence mode="wait">

              {!collapsed && (

                <motion.div
                  className="profile-info"

                  variants={textVariants}

                  initial="hidden"

                  animate="visible"

                  exit="exit"
                >

                  <h4 title={username}>
                    {username}
                  </h4>

                  <p>
                    {role}
                  </p>

                </motion.div>

              )}

            </AnimatePresence>

          </div>


          

          <AnimatePresence>

            {!collapsed && (

              <motion.div
                className="profile-arrow"

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

                <FaChevronRight />

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>


        

        <AnimatePresence>

          {!collapsed && (

            <motion.div
              className="menu-title"

              variants={textVariants}

              initial="hidden"

              animate="visible"

              exit="exit"
            >

              Workspace

            </motion.div>

          )}

        </AnimatePresence>


       

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >

          {menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;


            return (

              <NavLink
                key={item.name}

                to={item.path}

                className={`sidebar-link ${
                  isActive
                    ? "active"
                    : ""
                }`}
              >

                

                <AnimatePresence>

                  {isActive && (

                    <motion.span
                      layoutId="sidebar-active-pill"

                      className="active-indicator"

                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />

                  )}

                </AnimatePresence>


                

                <div className="sidebar-icon">

                  {item.icon}

                </div>


                

                <AnimatePresence mode="wait">

                  {!collapsed && (

                    <motion.span
                      className="sidebar-label"

                      variants={textVariants}

                      initial="hidden"

                      animate="visible"

                      exit="exit"
                    >

                      {item.name}

                    </motion.span>

                  )}

                </AnimatePresence>


                

                <AnimatePresence>

                  {isActive &&
                    !collapsed && (

                    <motion.span
                      className="active-glow"

                      initial={{
                        opacity: 0,
                      }}

                      animate={{
                        opacity: 1,
                      }}

                      exit={{
                        opacity: 0,
                      }}
                    />

                  )}

                </AnimatePresence>

              </NavLink>

            );

          })}

        </nav>


       

        <div className="sidebar-footer">

          <motion.button
            type="button"

            className="logout-button"

            onClick={handleLogout}

            whileHover={{
              scale: 1.02,
              y: -2,
            }}

            whileTap={{
              scale: 0.98,
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

                  exit="exit"
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