import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

// import "../styles/Landing.css";

const Home = () => {
  return (
    <div className="landing-page">
      {/* Animated background */}
      <BackgroundAnimation />

      {/* Fixed / sticky navbar */}
      <LandingNavbar />

      <main className="landing-main">
        {/* =========================
            HERO
        ========================== */}
        <section id="home" className="landing-section hero-wrapper">
          <Hero />
        </section>

        {/* =========================
            FEATURES
        ========================== */}
        <Features />

        {/* =========================
            STATISTICS
        ========================== */}
        <section id="statistics" className="landing-section">
          <Statistics />
        </section>

        {/* =========================
            TESTIMONIALS
        ========================== */}
        <section id="testimonials" className="landing-section">
          <Testimonials />
        </section>

        {/* =========================
            CTA
        ========================== */}
        <section id="contact" className="landing-section">
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to top */}
      <button
        type="button"
        className="landing-scroll-top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
};

export default Home;