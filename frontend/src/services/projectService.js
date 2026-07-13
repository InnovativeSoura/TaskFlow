import api from "../api/axios";

/* ==========================================
   GET ALL PROJECTS
========================================== */

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response;
};

/* ==========================================
   GET PROJECT BY ID
========================================== */

export const getProject = async (id) => {
  if (!id) {
    throw new Error("Project ID is required");
  }

  const response = await api.get(`/projects/${id}`);

  return response;
};

/* ==========================================
   CREATE PROJECT
========================================== */

export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response;
};

/* ==========================================
   UPDATE PROJECT
========================================== */

export const updateProject = async (
  id,
  projectData
) => {
  if (!id) {
    throw new Error("Project ID is required");
  }

  const response = await api.put(
    `/projects/${id}`,
    projectData
  );

  return response;
};

/* ==========================================
   DELETE PROJECT
========================================== */

export const deleteProject = async (id) => {
  if (!id) {
    throw new Error("Project ID is required");
  }

  const response = await api.delete(
    `/projects/${id}`
  );

  return response;
};