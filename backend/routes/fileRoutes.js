const express = require(
  "express"
);

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const {
  uploadFile,
  getTaskFiles,
} = require(
  "../controllers/fileController"
);

const router =
  express.Router();

router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

router.get(
  "/:taskId",
  getTaskFiles
);

module.exports = router;