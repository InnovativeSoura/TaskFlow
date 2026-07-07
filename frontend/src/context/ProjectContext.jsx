import {
  createContext,
  useContext,
  useEffect,
  useState,
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
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!token) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await getProjects();

      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Fetch Projects Error:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const addProject = async (data) => {
    const res = await createProject(data);
    await fetchProjects();
    return res.data;
  };

  const editProject = async (id, data) => {
    const res = await updateProject(id, data);
    await fetchProjects();
    return res.data;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    await fetchProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
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