import api from "../api/axios";

export const getProjects = async (params = {}) => {
  try {
    return await api.get("/projects", {
      params,
    });
  } catch (error) {
    console.error("Get Projects Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getProject = async (id) => {
  try {
    return await api.get(`/projects/${id}`);
  } catch (error) {
    console.error("Get Project Error:", error.response?.data || error.message);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    return await api.post("/projects", projectData);
  } catch (error) {
    console.error(
      "Create Project Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    return await api.put(`/projects/${id}`, projectData);
  } catch (error) {
    console.error(
      "Update Project Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    return await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error(
      "Delete Project Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getProjectStats = async () => {
  try {
    return await api.get("/projects/stats");
  } catch (error) {
    console.error(
      "Project Stats Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
