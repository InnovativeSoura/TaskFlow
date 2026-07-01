import api from "./axios";

/* ==========================================
   GET PROJECTS
========================================== */
export const fetchProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

/* ==========================================
   CREATE PROJECT
========================================== */
export const createProject = async (data) => {
  const res = await api.post("/projects", data);
  return res.data;
};

/* ==========================================
   ADD MEMBER
========================================== */
export const addProjectMember = async (projectId, userId) => {
  const res = await api.patch(`/projects/${projectId}/add-member`, {
    userId,
  });
  return res.data;
};

/* ==========================================
   UPDATE PROJECT
========================================== */
export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
};

/* ==========================================
   DELETE PROJECT
========================================== */
export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};