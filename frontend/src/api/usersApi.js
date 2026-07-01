import api from "./axios";

/* ==========================================
   GET USERS (FILTER + SEARCH HANDLED IN UI)
========================================== */
export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/* ==========================================
   SEARCH USERS
========================================== */
export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?query=${query}`);
  return res.data;
};

/* ==========================================
   UPDATE ROLE
========================================== */
export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data;
};

/* ==========================================
   TOGGLE STATUS
========================================== */
export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/users/${id}/toggle-status`);
  return res.data;
};

/* ==========================================
   DELETE USER
========================================== */
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};