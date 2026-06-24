import axios from "axios";

function Subscription() {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleUpgrade = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/payment/create-order`
      );

      console.log("Order Created:", res.data);

      alert(
        "Order created successfully. Razorpay integration can be opened here."
      );

      // Later:
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.id,
        name: "TaskFlow Pro",
        description: "Premium Subscription",
      };
      
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create order"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          color: "white",
          width: "400px",
        }}
      >
        <h1>TaskFlow Pro 🚀</h1>

        <p
          style={{
            marginTop: "15px",
            color: "#cbd5e1",
          }}
        >
          Upgrade to Pro and unlock premium
          collaboration features.
        </p>

        <h2
          style={{
            marginTop: "20px",
          }}
        >
          ₹499 / Month
        </h2>

        <button
          onClick={handleUpgrade}
          style={{
            marginTop: "25px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Upgrade Now 💳
        </button>
      </div>
    </div>
  );
}

export default Subscription;