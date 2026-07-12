import api from "../api/axios";

/**
 * Get all notifications
 */
export const getNotifications = async () => {
  return await api.get("/notifications");
};

/**
 * Mark one notification as read
 */
export const markNotificationAsRead = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  return await api.put("/notifications/read-all");
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id) => {
  return await api.delete(`/notifications/${id}`);
};