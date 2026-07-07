export const getSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      settings: {
        theme: "light",
        notifications: true,
        language: "en",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};