import { createContext, useContext, useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await getTasks();

      setTasks(res.data.tasks || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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