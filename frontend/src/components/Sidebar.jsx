// src/components/Sidebar.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";


const Sidebar = () => {


  const [collapsed, setCollapsed] = useState(false);


  const navigate = useNavigate();


  const { user, logout } = useAuth();



  const username =
    user?.name ||
    user?.username ||
    "Souradipta Patra";



  const role =
    user?.role ||
    "Administrator";




  // =========================
  // AUTO PROFILE INITIALS
  // =========================

  const getInitials = (name) => {

    if (!name) return "U";


    const words =
      name
        .trim()
        .split(" ")
        .filter(Boolean);



    if (words.length === 1) {

      return words[0]
        .charAt(0)
        .toUpperCase();

    }



    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    )
    .toUpperCase();

  };



  const avatarInitials =
    getInitials(username);




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

          {avatarInitials}

        </div>




        {!collapsed && (

          <div className="profile-content">


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
          NAVIGATION MENU
      ========================== */}


      <nav className="sidebar-navigation">


        {
          menuItems.map((item) => (

            <NavLink

              key={item.name}

              to={item.path}


              className={({ isActive }) =>

                isActive

                  ? "sidebar-link active"

                  : "sidebar-link"

              }


            >


              <span className="sidebar-icon">

                {item.icon}

              </span>



              {!collapsed && (

                <span className="sidebar-label">

                  {item.name}

                </span>

              )}



            </NavLink>


          ))
        }


      </nav>
            {/* =========================
          FOOTER
          LOGOUT SECTION
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

            <span className="sidebar-label">

              Logout

            </span>

          )}



        </button>


      </div>



    </aside>

  );

};


export default Sidebar;