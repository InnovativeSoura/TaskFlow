// src/pages/Home.jsx

import LandingNavbar from "../components/landing/LandingNavbar";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

import Hero from "../components/landing/Hero";
import Statistics from "../components/landing/Statistics";
import Features from "../components/landing/Features";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

import "../styles/Landing.css";

const Home = () => {
  return (
    <div className="landing-page">

      {/* =====================================================
          GLOBAL ANIMATED BACKGROUND
          Stays behind every section
      ===================================================== */}
      <BackgroundAnimation />

      {/* =====================================================
          FIXED LANDING NAVBAR
      ===================================================== */}
      <LandingNavbar />

      {/* =====================================================
          MAIN LANDING CONTENT
      ===================================================== */}
      <main className="landing-main">

        {/* ===================================================
            HERO
        =================================================== */}
        <div
          id="home"
          className="landing-section landing-hero-section"
        >
          <Hero />
        </div>


        {/* ===================================================
            STATISTICS
        =================================================== */}
        <div
          id="statistics"
          className="landing-section landing-statistics-section"
        >
          <Statistics />
        </div>


        {/* ===================================================
            FEATURES
        =================================================== */}
        <div
          id="features"
          className="landing-section landing-features-section"
        >
          <Features />
        </div>


        {/* ===================================================
            TESTIMONIALS
        =================================================== */}
        <div
          id="testimonials"
          className="landing-section landing-testimonials-section"
        >
          <Testimonials />
        </div>


        {/* ===================================================
            CTA
        =================================================== */}
        <div
          id="contact"
          className="landing-section landing-cta-section"
        >
          <CTA />
        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <Footer />

    </div>
  );
};

export default Home;