import api from "./axios";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await api.get(`/users/search?query=${query}`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data;
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/users/${id}/toggle-status`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
