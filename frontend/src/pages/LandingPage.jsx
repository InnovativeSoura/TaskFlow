// src/pages/LandingPage.jsx

import LandingNavbar from "../components/LandingNavbar";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Hero from "../components/Hero";
import "../components/landing/Hero.css";

import FeatureSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <BackgroundAnimation />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <LandingNavbar />

      {/* =====================================================
          MAIN LANDING CONTENT
      ===================================================== */}

      <main id="home">

        <Hero />

        <FeatureSection />

        <AboutSection />

        <ContactSection />

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
};

export default LandingPage;