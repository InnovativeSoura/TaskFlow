const Subscription = require("../models/Subscription");

const requirePro = async (req, res, next) => {
  const sub = await Subscription.findOne({
    user: req.user.id,
    status: "active",
  });

  if (!sub || sub.plan === "free") {
    return res.status(403).json({
      success: false,
      message: "Upgrade to Pro to access this feature",
    });
  }

  next();
};

module.exports = { requirePro };