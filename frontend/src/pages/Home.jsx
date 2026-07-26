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

      {/* ==========================================
          BACKGROUND ANIMATION
      ========================================== */}

      <BackgroundAnimation />


      {/* ==========================================
          LANDING NAVBAR
      ========================================== */}

      <LandingNavbar />


      {/* ==========================================
          MAIN LANDING CONTENT
      ========================================== */}

      <main>

        {/* HERO */}
        <Hero />


        {/* FEATURES */}
        <Features />


        {/* STATISTICS */}
        <Statistics />


        {/* TESTIMONIALS */}
        <Testimonials />


        {/* CTA */}
        <CTA />

      </main>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <Footer />

    </div>
  );
};

export default Home;