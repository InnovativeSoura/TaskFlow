import { useState, useEffect, useCallback } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../services/taskService";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getTasks();

      const data = res?.data?.tasks || res?.data?.data || res?.data || [];

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);

      setError(err.response?.data?.message || "Unable to load tasks.");

      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    const res = await createTask(taskData);

    const task = res?.data?.task || res?.data?.data || res?.data;

    if (task) {
      setTasks((prev) => [task, ...prev]);
    }

    return task;
  };

  const editTask = async (id, taskData) => {
    const res = await updateTask(id, taskData);

    const updated = res?.data?.task || res?.data?.data || res?.data;

    if (updated) {
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updated : task)),
      );
    }

    return updated;
  };

  const changeTaskStatus = async (id, status) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((task) =>
        task._id === id
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );

    try {
      const res = await updateTaskStatus(id, status);

      const updated = res?.data?.task || res?.data?.data || res?.data;

      if (updated) {
        setTasks((prev) =>
          prev.map((task) => (task._id === id ? updated : task)),
        );
      }

      return updated;
    } catch (err) {
      setTasks(previousTasks);

      throw err;
    }
  };

  const removeTask = async (id) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const refreshTasks = () => fetchTasks();

  return {
    tasks,
    loading,
    error,

    fetchTasks,
    refreshTasks,

    addTask,
    editTask,
    removeTask,

    changeTaskStatus,
  };
};

export default useTasks;
