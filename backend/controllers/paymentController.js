const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "team" ? "TaskFlow Team" : "TaskFlow Pro",
            },
            unit_amount: plan === "team" ? 1999 : 999,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],

      metadata: {
        userId,
        plan,
      },

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCheckoutSession };const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "team" ? "TaskFlow Team" : "TaskFlow Pro",
            },
            unit_amount: plan === "team" ? 1999 : 999,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],

      metadata: {
        userId,
        plan,
      },

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCheckoutSession };