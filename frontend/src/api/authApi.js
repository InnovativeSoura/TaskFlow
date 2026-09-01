import api from "./axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Save token
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
