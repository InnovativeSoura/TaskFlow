import LandingNavbar from "../components/LandingNavbar";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <>
      <BackgroundAnimation />

      <LandingNavbar />

      <main id="home">
        <Hero />

        <FeatureSection />

        <AboutSection />

        <ContactSection />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;