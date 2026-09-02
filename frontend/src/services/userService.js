import api from "../api/axios";

export const getUsers = async () => {
  const res = await api.get("/users");

  return {
    success: true,
    data: res.data.users ?? res.data.data ?? res.data ?? [],
  };
};

export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);

  return {
    success: true,
    data: res.data.user ?? res.data.data ?? res.data,
    statistics: res.data.statistics ?? null,
  };
};

export const getProfile = async () => {
  const res = await api.get("/users/profile");

  return {
    success: Boolean(res.data?.success),
    data: res.data?.user ?? res.data?.data ?? null,
    message: res.data?.message || "",
  };
};

export const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);

  return {
    success: Boolean(res.data?.success),
    data: res.data?.user ?? res.data?.data ?? null,
    message: res.data?.message || "",
  };
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);

  return {
    success: true,
    data: res.data.user ?? res.data.data ?? res.data,
  };
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);

  return {
    success: true,
    data: res.data.user ?? res.data.data ?? res.data,
  };
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

export const changeUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });

  return {
    success: Boolean(res.data?.success),
    data: res.data?.user ?? res.data?.data ?? null,
    message: res.data?.message || "",
  };
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/users/${id}/status`);

  return {
    success: Boolean(res.data?.success),
    data: res.data?.user ?? res.data?.data ?? null,
    message: res.data?.message || "",
  };
};
