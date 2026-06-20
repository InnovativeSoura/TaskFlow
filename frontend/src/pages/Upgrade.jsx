const handleUpgrade = async () => {
  const res = await axios.post("http://localhost:5000/api/payment/create-checkout");
  window.location.href = res.data.url;
};const handleUpgrade = async () => {
  const res = await axios.post(
    "http://localhost:5000/api/payment/create-checkout"
  );

  window.location.href = res.data.url;
};

return (
  <div>
    <h1>Upgrade to TaskFlow Pro</h1>

    <button onClick={handleUpgrade}>
      Upgrade Now 💳
    </button>
  </div>
);