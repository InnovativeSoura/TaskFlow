// src/pages/LandingPage.jsx

import LandingNavbar from "../components/LandingNavbar";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

import "../styles/Landing.css";

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* =====================================================
          GLOBAL BACKGROUND
      ===================================================== */}

      <BackgroundAnimation />

      {/* =====================================================
          LANDING NAVBAR
      ===================================================== */}

      <LandingNavbar />

      {/* =====================================================
          MAIN LANDING CONTENT

          IMPORTANT:
          Do NOT put id="home" here.

          Hero.jsx already owns #home.
          Duplicate IDs were causing anchor/layout
          inconsistencies during initial rendering.
      ===================================================== */}

      <main className="landing-main">

        {/* ===================================================
            HERO
        =================================================== */}

        <Hero />

        {/* ===================================================
            FEATURES
        =================================================== */}

        <FeatureSection />

        {/* ===================================================
            ABOUT / STATISTICS
        =================================================== */}

        <AboutSection />

        {/* ===================================================
            CONTACT / CTA
        =================================================== */}

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