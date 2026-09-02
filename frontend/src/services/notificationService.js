import api from "../api/axios";

export const getNotifications = async () => {
  return await api.get("/notifications");
};

export const markNotificationAsRead = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return await api.put("/notifications/read-all");
};

export const deleteNotification = async (id) => {
  return await api.delete(`/notifications/${id}`);
};
