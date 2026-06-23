import axios from "axios";

function Subscription() {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleUpgrade = async (
    amount,
    plan
  ) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const { data } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          amount,
          currency: "INR",
          plan,
          userId: user?._id,
        }
      );

      const options = {
        key: data.key,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "TaskFlow",

        description: `${plan} Subscription`,

        order_id: data.order.id,

        handler: async function (
          response
        ) {
          try {
            const verifyRes =
              await axios.post(
                `${API_URL}/api/payment/verify`,
                {
                  ...response,
                  userId: user?._id,
                }
              );

            if (
              verifyRes.data.success
            ) {
              alert(
                "🎉 Payment Successful!"
              );

              window.location.href =
                "/dashboard";
            }
          } catch (error) {
            console.error(error);

            alert(
              "Payment Verification Failed"
            );
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Payment Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-5xl font-bold mb-4">
        Choose Your Plan
      </h1>

      <p className="text-slate-400 mb-12">
        Upgrade your productivity with
        TaskFlow Pro
      </p>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* FREE PLAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Free
          </h2>

          <h3 className="text-4xl font-bold mb-6">
            ₹0
          </h3>

          <ul className="space-y-3 text-slate-300 mb-8">
            <li>
              ✓ Basic Project
              Management
            </li>
            <li>
              ✓ Task Tracking
            </li>
            <li>
              ✓ Team Collaboration
            </li>
            <li>
              ✗ Analytics
            </li>
            <li>
              ✗ AI Features
            </li>
          </ul>

          <button
            className="w-full bg-slate-700 py-3 rounded-lg"
            disabled
          >
            Current Plan
          </button>
        </div>

        {/* PRO MONTHLY */}
        <div className="bg-indigo-600 rounded-2xl p-8 shadow-xl scale-105">
          <h2 className="text-2xl font-bold mb-4">
            Pro Monthly
          </h2>

          <h3 className="text-4xl font-bold mb-6">
            ₹1
            <span className="text-lg">
              /month
            </span>
          </h3>

          <ul className="space-y-3 mb-8">
            <li>
              ✓ Unlimited Projects
            </li>
            <li>
              ✓ Unlimited Tasks
            </li>
            <li>
              ✓ AI Assistant
            </li>
            <li>
              ✓ Analytics Dashboard
            </li>
            <li>
              ✓ Priority Support
            </li>
          </ul>

          <button
            onClick={() =>
              handleUpgrade(
                1,
                "PRO_MONTHLY"
              )
            }
            className="w-full bg-white text-indigo-700 py-3 rounded-lg font-bold"
          >
            Choose Monthly
          </button>
        </div>

        {/* PRO YEARLY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Pro Yearly
          </h2>

          <h3 className="text-4xl font-bold mb-6">
            ₹2
            <span className="text-lg">
              /year
            </span>
          </h3>

          <ul className="space-y-3 text-slate-300 mb-8">
            <li>
              ✓ Unlimited Projects
            </li>
            <li>
              ✓ Unlimited Tasks
            </li>
            <li>
              ✓ AI Assistant
            </li>
            <li>
              ✓ Analytics Dashboard
            </li>
            <li>
              ✓ Priority Support
            </li>
          </ul>

          <button
            onClick={() =>
              handleUpgrade(
                2,
                "PRO_YEARLY"
              )
            }
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold"
          >
            Choose Yearly
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
```
