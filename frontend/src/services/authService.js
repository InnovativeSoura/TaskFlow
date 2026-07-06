import API from "../utils/axiosConfig";

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const getCurrentUser = () =>
  API.get("/auth/me");