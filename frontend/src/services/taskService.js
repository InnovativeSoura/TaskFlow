import api from "../api/axios";

/* ==========================================
   GET ALL TASKS
========================================== */

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res;
};

/* ==========================================
   GET SINGLE TASK
========================================== */

export const getTask = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res;
};

/* ==========================================
   CREATE TASK
========================================== */

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res;
};

/* ==========================================
   UPDATE TASK
========================================== */

export const updateTask = async (
  id,
  taskData
) => {
  const res = await api.put(
    `/tasks/${id}`,
    taskData
  );

  return res;
};

/* ==========================================
   UPDATE TASK STATUS
========================================== */

export const updateTaskStatus = async (
  id,
  status
) => {
  const res = await api.patch(
    `/tasks/${id}/status`,
    { status }
  );

  return res;
};

/* ==========================================
   DELETE TASK
========================================== */

export const deleteTask = async (id) => {
  const res = await api.delete(
    `/tasks/${id}`
  );

  return res;
};