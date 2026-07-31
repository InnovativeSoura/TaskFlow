import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();


  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      name: "Projects",
      icon: <FaProjectDiagram />,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: <FaTasks />,
      path: "/tasks",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/users",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
    >

      {/* Collapse Button */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>


      {/* Profile Section */}
      <div className="sidebar-profile">

        <div className="profile-avatar">
          SP
        </div>

        {!collapsed && (
          <div className="profile-info">
            <h3>
              Souradipta
            </h3>

            <span>
              Admin
            </span>
          </div>
        )}

      </div>



      {/* Workspace */}
      {!collapsed && (
        <div className="workspace-section">

          <p className="section-title">
            WORKSPACE
          </p>

        </div>
      )}



      {/* Navigation */}
      <nav className="sidebar-menu">

        {
          menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({isActive}) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <span className="menu-icon">
                {item.icon}
              </span>


              {!collapsed && (
                <span className="menu-text">
                  {item.name}
                </span>
              )}

            </NavLink>
          ))
        }

      </nav>



      {/* Logout Bottom */}
      <div className="sidebar-bottom">

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>


    </aside>
  );
};


export default Sidebar;