import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

import "../styles/User.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      setUsers(
        res.data.users ||
        res.data.data ||
        res.data ||
        []
      );
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Team Members</h1>

        <button className="primary-btn">
          + Invite Member
        </button>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No Members Found" />
      ) : (
        <div className="users-grid">

          {users.map((user) => (

            <div
              className="user-card"
              key={user._id}
            >

              <div className="avatar">

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  user.name
                    ?.substring(0, 2)
                    .toUpperCase()
                )}

              </div>

              <h3>{user.name}</h3>

              <p>{user.email}</p>

              <span className="role">
                {user.role}
              </span>

              <div className="status">

                <span
                  className={
                    user.status === "Active"
                      ? "active"
                      : "inactive"
                  }
                >
                  {user.status}
                </span>

              </div>

            </div>

          ))}

        </div>
      )}
    </MainLayout>
  );
};

export default Users;