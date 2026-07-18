/* ======================================================
   GET CURRENT LOGGED-IN USER
====================================================== */

export const getMe = async (req, res) => {
  try {
    /* ==========================================
       USER SET BY AUTH MIDDLEWARE
    ========================================== */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    /* ==========================================
       FETCH LATEST USER DATA
    ========================================== */

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* ==========================================
       SUCCESS
    ========================================== */

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });

  } catch (error) {

    console.error("GetMe Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};