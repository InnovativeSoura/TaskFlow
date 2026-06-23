const API_URL = import.meta.env.VITE_API_URL;

const handleUpgrade = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/api/payment/create-checkout`
    );

    window.location.href = res.data.url;
  } catch (error) {
    console.error("Payment Error:", error);

    alert("Unable to start payment process");
  }
};

return (
  <div>
    <h1>Upgrade to TaskFlow Pro</h1>

    <button onClick={handleUpgrade}>
      Upgrade Now 💳
    </button>
  </div>
);