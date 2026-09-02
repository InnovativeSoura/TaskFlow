import api from "../api/axios";


export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getCurrentUser = () =>
  api.get("/auth/me");