import { authorizeRoles } from "./roleMiddleware.js";

export const isAdmin = authorizeRoles("Admin");

export const isAdminOrManager = authorizeRoles("Admin", "Manager");

export const isAnyRole = authorizeRoles("Admin", "Manager", "Team Member");
