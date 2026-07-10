import api from "../api/axios";

/* ===========================
   AUTH
=========================== */

export const login = (data) => api.post("/auth/login", data);

export const register = (data) => api.post("/auth/register", data);

export const getProfile = () => api.get("/auth/me");

/* ===========================
   USERS
=========================== */

export const getUsers = () => api.get("/users");

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);

/* ===========================
   PROJECTS
=========================== */

export const getProjects = () => api.get("/projects");

export const getProject = (id) =>
  api.get(`/projects/${id}`);

export const createProject = (data) =>
  api.post("/projects", data);

export const updateProject = (id, data) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
  api.delete(`/projects/${id}`);

/* ===========================
   TASKS
=========================== */

export const getTasks = () => api.get("/tasks");

export const getTask = (id) =>
  api.get(`/tasks/${id}`);

export const createTask = (data) =>
  api.post("/tasks", data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

/* ===========================
   SETTINGS
=========================== */

export const getSettings = () =>
  api.get("/settings");

export const updateSettings = (data) =>
  api.put("/settings", data);

/* ===========================
   NOTIFICATIONS
=========================== */

export const getNotifications = () =>
  api.get("/notifications");

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

export default api;