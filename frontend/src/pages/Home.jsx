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

      <BackgroundAnimation />

      <LandingNavbar />

      <main>

        <Hero />

        <DashboardPreview />

        <Features />

        <Statistics />

        <Testimonials />

        <CTA />

      </main>

      <Footer />

    </div>
  );
}

export default Home;