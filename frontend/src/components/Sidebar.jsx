// src/components/Sidebar.jsx

import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

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
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";


const Sidebar = () => {

  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const { user, logout } = useAuth();


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



  const handleLogout = () => {

    logout();

    navigate("/");

  };



  const username =
    user?.name ||
    user?.username ||
    "Souradipta Patra";


  const role =
    user?.role ||
    "Administrator";



  return (

    <aside
      className={`sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >


      {/* =========================
          HEADER
      ========================== */}

      <div className="sidebar-header">


        <button
          className="sidebar-brand-button"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >

          <div className="brand-logo">

            <span>
              TF
            </span>

          </div>



          {!collapsed && (

            <div className="brand-content">

              <strong>
                TaskFlow
              </strong>

              <span>
                Workspace
              </span>

            </div>

          )}



          {!collapsed && (

            <div className="collapse-arrow">

              <FaChevronLeft />

            </div>

          )}


        </button>


      </div>

            {/* =========================
          PROFILE SECTION
      ========================== */}

      <div className="sidebar-profile">


        <div className="profile-avatar">

          {
            username
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0,2)
              .toUpperCase()
          }

        </div>



        {!collapsed && (

          <div className="profile-details">

            <h4>
              {username}
            </h4>


            <span>
              {role}
            </span>


          </div>

        )}


      </div>




      {/* =========================
          MENU SECTION
      ========================== */}

      <nav className="sidebar-menu">


        {
          menuItems.map((item)=>(

            <NavLink

              key={item.name}

              to={item.path}

              className={({isActive}) =>
                isActive
                ? "sidebar-link active"
                : "sidebar-link"
              }

            >


              <span className="sidebar-icon">

                {item.icon}

              </span>



              {!collapsed && (

                <span className="sidebar-text">

                  {item.name}

                </span>

              )}


            </NavLink>


          ))
        }


      </nav>
            {/* =========================
          SIDEBAR FOOTER
      ========================== */}

      <div className="sidebar-footer">


        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <span className="sidebar-icon">

            <FaSignOutAlt />

          </span>



          {!collapsed && (

            <span className="sidebar-text">

              Logout

            </span>

          )}


        </button>


      </div>


    </aside>

  );

};


export default Sidebar;