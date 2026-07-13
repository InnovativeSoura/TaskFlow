import { useState, useEffect, useCallback } from "react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ==========================
      FETCH PROJECTS
  ========================== */

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getProjects();

      const data =
        res?.data?.projects ||
        res?.data?.data ||
        [];

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Projects Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );

      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================
      INITIAL LOAD
  ========================== */

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /* ==========================
      CREATE PROJECT
  ========================== */

  const addProject = async (projectData) => {
    const res = await createProject(projectData);

    const project =
      res?.data?.project ||
      res?.data?.data;

    if (project) {
      setProjects((prev) => [project, ...prev]);
    }

    return project;
  };

  /* ==========================
      UPDATE PROJECT
  ========================== */

  const editProject = async (
    id,
    projectData
  ) => {
    const res = await updateProject(
      id,
      projectData
    );

    const updated =
      res?.data?.project ||
      res?.data?.data;

    if (updated) {
      setProjects((prev) =>
        prev.map((item) =>
          item._id === id ? updated : item
        )
      );
    }

    return updated;
  };

  /* ==========================
      DELETE PROJECT
  ========================== */

  const removeProject = async (id) => {
    await deleteProject(id);

    setProjects((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  /* ==========================
      REFRESH
  ========================== */

  const refreshProjects = () => fetchProjects();

  return {
    projects,
    loading,
    error,

    fetchProjects,
    refreshProjects,

    addProject,
    editProject,
    removeProject,
  };
};

export default useProjects;