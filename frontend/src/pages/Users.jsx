import { useEffect, useState } from "react";
import {
  fetchUsers,
  searchUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from "../api/usersApi";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "Admin";

  /* ==========================================
     LOAD USERS
  ========================================== */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     SEARCH USERS
  ========================================== */
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      loadUsers();
      return;
    }

    try {
      const data = await searchUsers(value);
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ==========================================
     ROLE CHANGE
  ========================================== */
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  /* ==========================================
     STATUS TOGGLE
  ========================================== */
  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  /* ==========================================
     DELETE USER
  ========================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users Management</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "15px", width: "300px" }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>

                {/* ROLE */}
                <td>
                  {isAdmin ? (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value)
                      }
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Member</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>

                {/* STATUS */}
                <td>
                  <span
                    style={{
                      color: u.status === "Active" ? "green" : "red",
                      cursor: isAdmin ? "pointer" : "default",
                    }}
                    onClick={() => isAdmin && handleToggleStatus(u._id)}
                  >
                    {u.status}
                  </span>
                </td>

                {/* ACTIONS */}
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{ background: "red", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;