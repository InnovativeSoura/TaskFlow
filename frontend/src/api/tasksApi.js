import api from "./axios";

export const fetchTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const updateTaskStatus = async (id, status) => {
  const res = await api.patch(`/tasks/${id}/status`, { status });
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post("/tasks", data);
  return res.data;
};
