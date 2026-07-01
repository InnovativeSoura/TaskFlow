import api from "./axios";

/* ==========================================
   REGISTER
========================================== */
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* ==========================================
   LOGIN
========================================== */
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Save token
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

/* ==========================================
   GET PROFILE
========================================== */
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

/* ==========================================
   LOGOUT
========================================== */
export const logoutUser = () => {
  localStorage.removeItem("token");
};