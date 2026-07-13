import api from "../api/axios";

/* ==========================================
   GET TASKS
========================================== */

export const getTasks = async () => {
  const res = await api.get("/tasks");

  return {
    success: true,
    data:
      res.data.tasks ??
      res.data.data ??
      res.data ??
      [],
  };
};

/* ==========================================
   CREATE TASK
========================================== */

export const createTask = async (data) => {
  const res = await api.post("/tasks", data);

  return {
    success: true,
    data:
      res.data.task ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   UPDATE TASK
========================================== */

export const updateTask = async (
  id,
  data
) => {
  const res = await api.put(
    `/tasks/${id}`,
    data
  );

  return {
    success: true,
    data:
      res.data.task ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   DELETE TASK
========================================== */

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};