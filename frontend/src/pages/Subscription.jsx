import axios from "axios";
import { useState } from "react";

function Subscription() {
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/payment/create-checkout`
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to start payment process"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b)",
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
        <h1 style={{ marginBottom: "20px" }}>
          Upgrade to TaskFlow Pro 🚀
        </h1>

        <p style={{ marginBottom: "30px" }}>
          Unlock premium features,
          advanced analytics, unlimited
          projects and team collaboration.
        </p>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {loading
            ? "Processing..."
            : "Upgrade Now 💳"}
        </button>
      </div>
    </div>
  );
}

export default Subscription;