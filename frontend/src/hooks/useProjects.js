import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const useProjects = () => {
  /* ==========================================
     STATE
  ========================================== */

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(null);

  /* ==========================================
     FETCH PROJECTS
  ========================================== */

  const fetchProjects = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getProjects();

        const data =
          res?.data?.projects ||
          res?.data?.data ||
          [];

        const sortedProjects = Array.isArray(
          data
        )
          ? [...data].sort(
              (a, b) =>
                new Date(
                  b.createdAt || 0
                ) -
                new Date(
                  a.createdAt || 0
                )
            )
          : [];

        setProjects(sortedProjects);

        return sortedProjects;
      } catch (err) {
        console.error(
          "Fetch Projects Error:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Unable to load projects.";

        setError(message);
        setProjects([]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /* ==========================================
     CLEAR ERROR
  ========================================== */

  const clearError = () => {
    setError(null);
  };

  /* ==========================================
     GET PROJECT BY ID
  ========================================== */

  const getProjectById = (id) => {
    return (
      projects.find(
        (project) =>
          project._id === id
      ) || null
    );
  };

  /* ==========================================
     REFRESH PROJECTS
  ========================================== */

  const refreshProjects = async () => {
    return fetchProjects();
  };


  /* ==========================================
     CREATE PROJECT
  ========================================== */

  const addProject = async (projectData) => {
    try {
      setSaving(true);
      setError(null);

      const res = await createProject(projectData);

      const project =
        res?.data?.project ||
        res?.data?.data;

      if (project) {
        setProjects((prev) => {
          const exists = prev.some(
            (item) => item._id === project._id
          );

          if (exists) return prev;

          return [project, ...prev];
        });
      }

      return project;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create project.";

      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     UPDATE PROJECT
  ========================================== */

  const editProject = async (
    id,
    projectData
  ) => {
    try {
      setSaving(true);
      setError(null);

      const res = await updateProject(
        id,
        projectData
      );

      const updated =
        res?.data?.project ||
        res?.data?.data;

      if (updated) {
        setProjects((prev) =>
          prev.map((project) =>
            project._id === id
              ? updated
              : project
          )
        );
      }

      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to update project.";

      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     DELETE PROJECT
  ========================================== */

  const removeProject = async (id) => {
    try {
      setSaving(true);
      setError(null);

      await deleteProject(id);

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project._id !== id
        )
      );

      return true;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to delete project.";

      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     RETURN
  ========================================== */

  return {
    projects,
    loading,
    saving,
    error,

    fetchProjects,
    refreshProjects,
    clearError,
    getProjectById,

    addProject,
    editProject,
    removeProject,
  };
};

export default useProjects;

