import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
import DashboardPreview from "../components/landing/DashboardPreview";
import Features from "../components/landing/Features";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

import "../styles/Landing.css";

function Home() {
  return (
    <div className="landing-page">

      {/* Background Effects */}
      <BackgroundAnimation />

      {/* Navigation */}
      <LandingNavbar />

      <main>

        {/* ================= HERO ================= */}
        <section id="home">
          <Hero />
        </section>

        {/* =========== DASHBOARD PREVIEW ========== */}
        <section id="dashboard">
          <DashboardPreview />
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features">
          <Features />
        </section>

        {/* ================= STATISTICS ================= */}
        <section id="statistics">
          <Statistics />
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* ================= CTA / CONTACT ================= */}
        <section id="contact">
          <CTA />
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;