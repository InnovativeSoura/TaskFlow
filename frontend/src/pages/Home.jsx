import LandingNavbar from "../components/landing/LandingNavbar";
import Hero from "../components/landing/Hero";
// import Features from "../components/landing/Features";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import BackgroundAnimation from "../components/landing/BackgroundAnimation";

import "../styles/Landing.css";

const Home = () => {
  return (
    <div className="landing-page">
      {/* Background */}
      <BackgroundAnimation />

      {/* Navbar */}
      <LandingNavbar />

      <main>
        {/* Hero */}
        <section id="home">
          <Hero />
        </section>

        {/* Features */}
        <section id="features">
          <Features />
        </section>

        {/* Statistics */}
        <section id="statistics">
          <Statistics />
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* CTA */}
        <section id="contact">
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;