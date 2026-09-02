import LandingNavbar from "../components/landing/LandingNavbar";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

import Hero from "../components/landing/Hero";
import Statistics from "../components/landing/Statistics";
import Features from "../components/landing/Features";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

import "../styles/Landing.css";

const LandingPage = () => {
  return (
    <div className="landing-page">

      
      <BackgroundAnimation />

      
      <LandingNavbar />

      
      <main className="landing-main">

        
        <section
          id="home"
          className="landing-section landing-hero-section"
        >
          <Hero />
        </section>

        
        <section
          id="statistics"
          className="landing-section landing-statistics-section"
        >
          <Statistics />
        </section>

        
        <section
          id="features"
          className="landing-section landing-features-section"
        >
          <Features />
        </section>

        
        <section
          id="testimonials"
          className="landing-section landing-testimonials-section"
        >
          <Testimonials />
        </section>

        
        <section
          id="contact"
          className="landing-section landing-cta-section"
        >
          <CTA />
        </section>

      </main>

      <Footer />

    </div>
  );
};

export default LandingPage;