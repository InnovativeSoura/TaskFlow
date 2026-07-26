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

      {/* Background */}
      <BackgroundAnimation />

      {/* Navbar */}
      <LandingNavbar />

      <main>

        {/* Hero */}
        <Hero />

        {/* Features */}
        <Features />

        {/* Statistics */}
        <Statistics />

        {/* Testimonials */}
        <Testimonials />

        {/* CTA */}
        <CTA />

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;