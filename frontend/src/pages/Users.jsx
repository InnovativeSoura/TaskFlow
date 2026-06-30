import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./Users.css";

function Users() {

  const API_URL = import.meta.env.VITE_API_URL;

  //--------------------------------------------------
  // STATES
  //--------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [users, setUsers] = useState([]);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [userForm, setUserForm] =
    useState({

      name: "",

      email: "",

      password: "",

      role: "Member",

    });

  //--------------------------------------------------
  // FETCH USERS
  //--------------------------------------------------

  const fetchUsers = async () => {

    try {

      if (!refreshing)
        setLoading(true);

      setRefreshing(true);

      const res = await axios.get(
        `${API_URL}/api/users`
      );

      setUsers(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to fetch users.");

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };

  useEffect(() => {

    fetchUsers();

  }, []);

  //--------------------------------------------------
  // FILTER USERS
  //--------------------------------------------------

  const filteredUsers = users.filter((user) => {

    const searchMatch =
      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "All"
        ? true
        : user.role === roleFilter;

    return searchMatch && roleMatch;

  });

  //--------------------------------------------------
  // RESET FORM
  //--------------------------------------------------

  const resetForm = () => {

    setEditingUser(null);

    setUserForm({

      name: "",

      email: "",

      password: "",

      role: "Member",

    });

  };

  //--------------------------------------------------
  // OPEN MODALS
  //--------------------------------------------------

  const openCreateModal = () => {

    resetForm();

    setShowModal(true);

  };

  const openEditModal = (user) => {

    setEditingUser(user);

    setUserForm({

      name: user.name,

      email: user.email,

      password: "",

      role: user.role,

    });

    setShowModal(true);

  };

  //--------------------------------------------------
  // CREATE / UPDATE USER
  //--------------------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingUser) {

        await axios.put(

          `${API_URL}/api/users/${editingUser._id}`,

          userForm

        );

      } else {

        await axios.post(

          `${API_URL}/api/users`,

          userForm

        );

      }

      setShowModal(false);

      resetForm();

      fetchUsers();

    } catch (err) {

      console.error(err);

      alert("Failed to save user.");

    }

  };

  //--------------------------------------------------
  // DELETE USER
  //--------------------------------------------------

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?"))
      return;

    try {

      await axios.delete(

        `${API_URL}/api/users/${id}`

      );

      fetchUsers();

    } catch (err) {

      console.error(err);

      alert("Failed to delete user.");

    }

  };
    //--------------------------------------------------
  // LOADING SCREEN
  //--------------------------------------------------

  if (loading) {

    return (

      <div className="loading-screen">

        <h2>Loading Users...</h2>

      </div>

    );

  }

  //--------------------------------------------------
  // STATISTICS
  //--------------------------------------------------

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const managerUsers = users.filter(
    (user) => user.role === "Manager"
  ).length;

  const memberUsers = users.filter(
    (user) => user.role === "Member"
  ).length;

  //--------------------------------------------------
  // JSX
  //--------------------------------------------------

  return (

    <div className="user-page">

      <Sidebar />

      <div className="user-main">

        <Navbar />

        <div className="user-container">

          {/* ======================================
                    HEADER
          ====================================== */}

          <div className="user-header">

            <div>

              <h1>User Management</h1>

              <p>

                Manage your project team members

              </p>

            </div>

            <button
              className="create-btn"
              onClick={openCreateModal}
            >

              + Add User

            </button>

          </div>

          {/* ======================================
                    TOOLBAR
          ====================================== */}

          <div className="user-toolbar">

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >

              <option value="All">
                All Roles
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Manager">
                Manager
              </option>

              <option value="Member">
                Member
              </option>

            </select>

            <button
              className="refresh-btn"
              onClick={fetchUsers}
            >

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

          {/* ======================================
                    STATISTICS
          ====================================== */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <h2>{totalUsers}</h2>

              <p>Total Users</p>

            </div>

            <div className="stat-card red">

              <h2>{adminUsers}</h2>

              <p>Admins</p>

            </div>

            <div className="stat-card purple">

              <h2>{managerUsers}</h2>

              <p>Managers</p>

            </div>

            <div className="stat-card green">

              <h2>{memberUsers}</h2>

              <p>Members</p>

            </div>

          </div>

          {/* ======================================
                    USERS GRID
          ====================================== */}

          <div className="users-grid">

            {filteredUsers.length === 0 ? (

              <div className="empty-state">

                <h2>No Users Found</h2>

                <p>

                  Try another search or create a new user.

                </p>

              </div>

            ) : (

              filteredUsers.map((user) => (

                <div
                  className="user-card"
                  key={user._id}
                >
                                    {/* USER AVATAR */}

                  <div className="user-avatar">

                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                  {/* USER DETAILS */}

                  <div className="user-details">

                    <h2>{user.name}</h2>

                    <p>{user.email}</p>

                  </div>

                  {/* ROLE */}

                  <div className="user-role">

                    <span
                      className={`role-badge ${user.role
                        ?.replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {user.role}
                    </span>

                  </div>

                  {/* USER INFORMATION */}

                  <div className="user-info">

                    <div className="info-row">

                      <strong>User ID</strong>

                      <span>

                        {user._id
                          ? user._id.slice(-8)
                          : "N/A"}

                      </span>

                    </div>

                    <div className="info-row">

                      <strong>Joined</strong>

                      <span>

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "N/A"}

                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="user-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditModal(user)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(user._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* END USERS GRID */}
                    {/* ======================================
                CREATE / EDIT USER MODAL
          ====================================== */}

          {showModal && (

            <div className="modal-overlay">

              <div className="modal">

                <div className="modal-header">

                  <h2>

                    {editingUser
                      ? "Edit User"
                      : "Create User"}

                  </h2>

                  <button
                    className="close-btn"
                    onClick={() => {

                      setShowModal(false);

                      resetForm();

                    }}
                  >
                    ×
                  </button>

                </div>

                <form
                  className="user-form"
                  onSubmit={handleSubmit}
                >

                  <label>

                    Full Name

                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          name: e.target.value,
                        })
                      }
                    />

                  </label>

                  <label>

                    Email Address

                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          email: e.target.value,
                        })
                      }
                    />

                  </label>

                  <label>

                    Password

                    <input
                      type="password"
                      placeholder={
                        editingUser
                          ? "Leave blank to keep existing password"
                          : "Enter password"
                      }
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          password: e.target.value,
                        })
                      }
                    />

                  </label>

                  <label>

                    Role

                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          role: e.target.value,
                        })
                      }
                    >

                      <option value="Admin">
                        Admin
                      </option>

                      <option value="Manager">
                        Manager
                      </option>

                      <option value="Member">
                        Member
                      </option>

                    </select>

                  </label>

                  <div className="modal-actions">

                    <button
                      type="submit"
                      className="save-btn"
                    >

                      {editingUser
                        ? "Update User"
                        : "Create User"}

                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {

                        setShowModal(false);

                        resetForm();

                      }}
                    >

                      Cancel

                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

        </div>
        {/* user-container */}

      </div>
      {/* user-main */}

    </div>
  //user-page

  );

}

export default Users;