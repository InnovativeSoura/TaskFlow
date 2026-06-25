const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET_EXISTS:",!!process.env.RAZORPAY_KEY_SECRET);

// Create Order (Checkout Session equivalent)
const createOrder = async (req, res) => {
  try {
    console.log("Payment Request:", req.body);
    const { amount, currency = "INR", plan, userId } = req.body;

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        plan,
        userId,
      },
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

// Verify Payment Signature
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    const isValid =
      expectedSignature ===
      razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        isPro: true,
        subscriptionPlan: "PRO",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Payment verification failed",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};