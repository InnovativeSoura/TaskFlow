import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const ProjectContext = createContext();

export const TaskProvider = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
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