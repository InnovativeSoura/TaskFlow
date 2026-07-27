// src/services/userService.js

import api from "../api/axios";

/* ==========================================
   GET ALL USERS
========================================== */

export const getUsers = async () => {
  const res = await api.get("/users");

  return {
    success: true,
    data:
      res.data.users ??
      res.data.data ??
      res.data ??
      [],
  };
};

/* ==========================================
   GET USER BY ID
========================================== */

export const getUser = async (id) => {
  const res = await api.get(
    `/users/${id}`
  );

  return {
    success: true,
    data:
      res.data.user ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   CREATE USER
========================================== */

export const createUser = async (data) => {
  const res = await api.post(
    "/users",
    data
  );

  return {
    success: true,
    data:
      res.data.user ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   UPDATE USER
========================================== */

export const updateUser = async (
  id,
  data
) => {
  const res = await api.put(
    `/users/${id}`,
    data
  );

  return {
    success: true,
    data:
      res.data.user ??
      res.data.data ??
      res.data,
  };
};

/* ==========================================
   DELETE USER
========================================== */

export const deleteUser = async (id) => {
  return await api.delete(
    `/users/${id}`
  );
};

/* ==========================================
   GET LOGGED-IN USER PROFILE
========================================== */

export const getProfile = async () => {
  const res = await api.get(
    "/users/profile"
  );

  return {
    success: Boolean(
      res.data?.success
    ),

    data:
      res.data?.user ??
      res.data?.data ??
      null,
  };
};

/* ==========================================
   UPDATE LOGGED-IN USER PROFILE
========================================== */

export const updateProfile = async (
  data
) => {
  const res = await api.put(
    "/users/profile",
    data
  );

  return {
    success: Boolean(
      res.data?.success
    ),

    data:
      res.data?.user ??
      res.data?.data ??
      null,

    message:
      res.data?.message ||
      "Profile updated successfully.",
  };
};