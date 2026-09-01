import "../styles/Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader-background">
        <div className="loader-orb loader-orb-one"></div>
        <div className="loader-orb loader-orb-two"></div>
      </div>

      <div className="loader-content">

        {/* TaskFlow Logo */}
        <div className="loader-logo">
          <span>TF</span>
          <div className="loader-logo-shine"></div>
        </div>

        {/* Animated Rings */}
        <div className="loader-ring ring-one"></div>
        <div className="loader-ring ring-two"></div>

        {/* Loading Indicator */}
        <div className="loader-spinner">
          <span></span>
        </div>

        {/* Brand */}
        <div className="loader-brand">
          <h2>TaskFlow</h2>
          <p>Loading workspace</p>
        </div>

        {/* Progress Dots */}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </div>
  );
};

export default Loader;