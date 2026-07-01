import api from "./axios";

/* ==========================================
   DASHBOARD STATS (USERS / PROJECTS / TASKS)
========================================== */

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};