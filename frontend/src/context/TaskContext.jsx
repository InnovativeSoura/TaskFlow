import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await getTasks();

      const data = res.data.tasks || res.data.data || res.data || [];

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      fetchTasks();
    }
  }, [fetchTasks, authLoading]);

  const addTask = async (task) => {
    const res = await createTask(task);

    const newTask = res.data.task || res.data.data || res.data;

    setTasks((prev) => [newTask, ...prev]);

    return newTask;
  };

  const editTask = async (id, task) => {
    const res = await updateTask(id, task);

    const updated = res.data.task || res.data.data || res.data;

    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));

    return updated;
  };

  const removeTask = async (id) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((t) => t._id !== id));
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

export default TaskContext;
