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
          GLOBAL BACKGROUND
          Rendered once and stays behind the complete landing page
      ===================================================== */}
      <BackgroundAnimation />

      {/* =====================================================
          LANDING NAVBAR
      ===================================================== */}
      <LandingNavbar />

      {/* =====================================================
          MAIN LANDING CONTENT
      ===================================================== */}
      <main className="landing-main">

        {/* ===================================================
            HERO SECTION
        =================================================== */}
        <section
          id="home"
          className="landing-section landing-hero-section"
        >
          <Hero />
        </section>


        {/* ===================================================
            STATISTICS SECTION
        =================================================== */}
        <section
          id="statistics"
          className="landing-section landing-statistics-section"
        >
          <Statistics />
        </section>


        {/* ===================================================
            FEATURES SECTION
        =================================================== */}
        <section
          id="features"
          className="landing-section landing-features-section"
        >
          <Features />
        </section>


        {/* ===================================================
            TESTIMONIALS SECTION
        =================================================== */}
        <section
          id="testimonials"
          className="landing-section landing-testimonials-section"
        >
          <Testimonials />
        </section>


        {/* ===================================================
            CTA SECTION
        =================================================== */}
        <section
          id="contact"
          className="landing-section landing-cta-section"
        >
          <CTA />
        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <Footer />

    </div>
  );
};

export default Home;