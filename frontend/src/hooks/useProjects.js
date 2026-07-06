import { useCallback, useEffect, useState } from "react";

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

      const res = await getProjects();

      const data =
        res.data.projects ||
        res.data.data ||
        res.data ||
        [];

      setProjects(data);

      setError(null);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to load projects."
      );

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
      ADD PROJECT
  ========================== */

  const addProject = async (projectData) => {

    try {

      const res =
        await createProject(projectData);

      const newProject =
        res.data.project ||
        res.data.data ||
        res.data;

      setProjects((prev) => [
        newProject,
        ...prev,
      ]);

      return newProject;

    } catch (err) {

      console.error(err);

      throw err;

    }

  };

  /* ==========================
      UPDATE PROJECT
  ========================== */

  const editProject = async (
    id,
    projectData
  ) => {

    try {

      const res =
        await updateProject(
          id,
          projectData
        );

      const updatedProject =
        res.data.project ||
        res.data.data ||
        res.data;

      setProjects((prev) =>

        prev.map((project) =>

          project._id === id
            ? updatedProject
            : project

        )

      );

      return updatedProject;

    } catch (err) {

      console.error(err);

      throw err;

    }

  };

  /* ==========================
      DELETE PROJECT
  ========================== */

  const removeProject = async (id) => {

    try {

      await deleteProject(id);

      setProjects((prev) =>

        prev.filter(

          (project) =>
            project._id !== id

        )

      );

    } catch (err) {

      console.error(err);

      throw err;

    }

  };

  /* ==========================
      REFRESH
  ========================== */

  const refreshProjects = async () => {

    await fetchProjects();

  };

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