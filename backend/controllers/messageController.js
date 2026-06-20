const Message = require("../models/Message");

const getMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await Message.find({
        project:
          req.params.projectId,
      })
        .populate(
          "sender",
          "name profileImage"
        )
        .sort({
          createdAt: 1,
        });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {
  getMessages,
};