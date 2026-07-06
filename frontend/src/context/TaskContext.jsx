import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; 

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

export const TaskProvider = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const addTask = async (data) => {
    const res = await createTask(data);

    await fetchTasks();

    return res.data;
  };

  const editTask = async (id, data) => {
    const res = await updateTask(id, data);

    await fetchTasks();

    return res.data;
  };

  const removeTask = async (id) => {
    await deleteTask(id);

    await fetchTasks();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);