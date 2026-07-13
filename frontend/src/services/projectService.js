import api from "../api/axios";

/* ==========================================
   GET PROJECTS
========================================== */

export const getProjects = async () => {
  const res = await api.get("/projects");

  return {
    success: true,
    data:
      res.data.projects ??
      res.data.data ??
      res.data ??
      [],
  };
};

/* ==========================================
   GET PROJECT
========================================== */

export const getProject = async (id) => {
  const res = await api.get(`/projects/${id}`);

  return {
    success: true,
    data:
      res.data.project ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   CREATE PROJECT
========================================== */

export const createProject = async (data) => {
  const res = await api.post("/projects", data);

  return {
    success: true,
    data:
      res.data.project ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   UPDATE PROJECT
========================================== */

export const updateProject = async (
  id,
  data
) => {
  const res = await api.put(
    `/projects/${id}`,
    data
  );

  return {
    success: true,
    data:
      res.data.project ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   DELETE PROJECT
========================================== */

export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};