import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!token) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await getProjects();

      const data = res.data.projects || res.data.data || res.data || [];

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Projects Error:", error);

      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      fetchProjects();
    }
  }, [fetchProjects, authLoading]);

  const addProject = async (projectData) => {
    const res = await createProject(projectData);

    const project = res.data.project || res.data.data || res.data;

    setProjects((prev) => [project, ...prev]);

    return project;
  };

  const editProject = async (id, projectData) => {
    const res = await updateProject(id, projectData);

    const updatedProject = res.data.project || res.data.data || res.data;

    setProjects((prev) =>
      prev.map((project) => (project._id === id ? updatedProject : project)),
    );

    return updatedProject;
  };

  const removeProject = async (id) => {
    await deleteProject(id);

    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
        refreshProjects,
        addProject,
        editProject,
        removeProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);

export default ProjectContext;
