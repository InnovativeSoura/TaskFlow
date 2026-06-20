import { useState } from "react";
import axios from "axios";
import "../styles/pricing.css";

function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  // Mock user plan (replace with real auth context)
  const userPlan = "free";

  const plans = {
    free: {
      name: "Free",
      monthly: 0,
      yearly: 0,
      features: [
        "Basic Task Management",
        "Kanban Board",
        "Basic Dashboard",
      ],
      disabled: true,
    },

    pro: {
      name: "Pro",
      monthly: 9.99,
      yearly: 99,
      features: [
        "AI Task Assistant",
        "PDF & Excel Export",
        "Advanced Analytics",
        "Real-time Notifications",
        "Priority Support",
      ],
      disabled: false,
      stripePriceId: "price_pro_monthly",
    },

    team: {
      name: "Team",
      monthly: 19.99,
      yearly: 199,
      features: [
        "Everything in Pro",
        "Multi-Workspace",
        "Role Management",
        "Team Activity Logs",
      ],
      disabled: false,
      stripePriceId: "price_team_monthly",
    },
  };

  const handleUpgrade = async (plan) => {
  const res = await axios.post(
    "http://localhost:5000/api/payment/create-checkout",
    {
      userId: user._id,
      plan: plan,
    }
  );

  window.location.href = res.data.url;
};

  return (
    <div className="pricing-container">
      <h1 className="title">Choose Your Plan</h1>
      <p className="subtitle">
        Upgrade your productivity with TaskFlow
      </p>

      {/* TOGGLE */}
      <div className="toggle">
        <span className={!isYearly ? "active" : ""}>
          Monthly
        </span>

        <label className="switch">
          <input
            type="checkbox"
            onChange={() => setIsYearly(!isYearly)}
          />
          <span className="slider"></span>
        </label>

        <span className={isYearly ? "active" : ""}>
          Yearly (Save 20%)
        </span>
      </div>

      {/* CARDS */}
      <div className="pricing-cards">

        {Object.keys(plans).map((key) => {
          const plan = plans[key];
          const price = isYearly
            ? plan.yearly
            : plan.monthly;

          const isCurrent = userPlan === key;

          return (
            <div
              key={key}
              className={`card ${
                key === "pro" ? "highlight" : ""
              }`}
            >
              <h2>{plan.name}</h2>

              <h3>
                {price === 0
                  ? "Free"
                  : `$${price}`}
                <span>
                  /{isYearly ? "year" : "month"}
                </span>
              </h3>

              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="btn-disabled">
                  Current Plan
                </button>
              ) : plan.disabled ? (
                <button className="btn-disabled">
                  Not Available
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => handleUpgrade(plan)}
                >
                  Upgrade to {plan.name} 🚀
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;