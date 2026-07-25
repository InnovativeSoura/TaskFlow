// src/pages/Home.jsx

import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

import "../styles/Landing.css";

const Home = () => {
  return (
    <div className="landing-page">

      {/* =====================================================
          BACKGROUND ANIMATION
      ====================================================== */}

      <BackgroundAnimation />


      {/* =====================================================
          LANDING NAVBAR
      ====================================================== */}

      <LandingNavbar />


      {/* =====================================================
          MAIN LANDING CONTENT
      ====================================================== */}

      <main>

        {/* ===================================================
            HERO
        ==================================================== */}

        <section id="home">
          <Hero />
        </section>


        {/* ===================================================
            FEATURES

            Features.jsx already contains:
            id="features"
        ==================================================== */}

        <Features />


        {/* ===================================================
            STATISTICS

            Statistics.jsx already contains:
            id="statistics"
        ==================================================== */}

        <Statistics />


        {/* ===================================================
            TESTIMONIALS

            Testimonials.jsx should contain:
            id="testimonials"
        ==================================================== */}

        <Testimonials />


        {/* ===================================================
            CTA
        ==================================================== */}

        <section id="contact">
          <CTA />
        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>
  );
};

export default Home;