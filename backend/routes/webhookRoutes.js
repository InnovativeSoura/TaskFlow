const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Subscription = require("../models/Subscription");

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, plan } = session.metadata;

      await Subscription.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          plan,
          status: "active",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        },
        { upsert: true }
      );
    }

    res.json({ received: true });
  }
);

module.exports = router;