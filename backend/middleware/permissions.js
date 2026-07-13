import { authorizeRoles } from "./roleMiddleware.js";

/* ==========================================
   ROLE-BASED ACCESS CONTROL
========================================== */

// Admin only
export const isAdmin = authorizeRoles("Admin");

// Admin and Manager only
export const isAdminOrManager = authorizeRoles(
  "Admin",
  "Manager"
);

// Any authenticated user
export const isAnyRole = authorizeRoles(
  "Admin",
  "Manager",
  "Team Member"
);