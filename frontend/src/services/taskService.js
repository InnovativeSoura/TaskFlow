import api from "../api/axios";

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res;
};

export const getTask = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res;
};

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res;
};

export const updateTask = async (id, taskData) => {
  const res = await api.put(`/tasks/${id}`, taskData);

  return res;
};

export const updateTaskStatus = async (id, status) => {
  const res = await api.patch(`/tasks/${id}/status`, { status });

  return res;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);

  return res;
};
