const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify payment after success
router.post("/verify", verifyPayment);

module.exports = router;