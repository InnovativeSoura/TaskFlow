import api from "./api";
// import API from "../utils/axiosConfig";

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getCurrentUser = () =>
  api.get("/auth/me");