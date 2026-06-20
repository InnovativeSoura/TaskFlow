const express = require(
  "express"
);

const {
  getAdminStats,
  getUsers,
  updateRole,
  toggleUserStatus,
} = require(
  "../controllers/adminController"
);

const authorizeRoles =
  require(
    "../middleware/roleMiddleware"
  );

const router =
  express.Router();

router.get(
  "/stats",
  authorizeRoles(
    "admin"
  ),
  getAdminStats
);

router.get(
  "/users",
  authorizeRoles(
    "admin"
  ),
  getUsers
);

router.put(
  "/role/:id",
  authorizeRoles(
    "admin"
  ),
  updateRole
);

router.put(
  "/status/:id",
  authorizeRoles(
    "admin"
  ),
  toggleUserStatus
);

module.exports =
  router;