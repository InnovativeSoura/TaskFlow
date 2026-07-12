import { authorizeRoles } from "./roleMiddleware.js";

/* ==========================================
   PREDEFINED ROLE GUARDS
========================================== */

// Only Admin
export const isAdmin = authorizeRoles("Admin");

// Admin + Manager
export const isAdminOrManager = authorizeRoles("Admin", "Manager", "Team Member");

// All authenticated users (role already validated separately if needed)
export const isAnyRole = authorizeRoles("Admin", "Manager", "Team Member");