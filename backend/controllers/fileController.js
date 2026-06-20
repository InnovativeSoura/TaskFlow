const Attachment =
  require(
    "../models/Attachment"
  );

const uploadFile =
  async (req, res) => {
    try {
      const attachment =
        await Attachment.create(
          {
            task:
              req.body.taskId,

            uploadedBy:
              req.body.userId,

            fileName:
              req.file
                .originalname,

            filePath:
              req.file.path,

            fileType:
              req.file
                .mimetype,

            fileSize:
              req.file.size,
          }
        );

      res.status(201).json({
        success: true,
        attachment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getTaskFiles =
  async (req, res) => {
    try {
      const files =
        await Attachment.find(
          {
            task:
              req.params.taskId,
          }
        );

      res.status(200).json(
        files
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  uploadFile,
  getTaskFiles,
};