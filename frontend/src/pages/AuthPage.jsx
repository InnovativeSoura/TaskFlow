// src/pages/AuthPage.jsx

import BackgroundAnimation from "../components/BackgroundAnimation";

import HeroSection from "../components/auth/HeroSection";
import AuthCard from "../components/auth/AuthCard";

import "../styles/Auth.css";

const AuthPage = () => {
  return (
    <div className="auth-page-wrapper">
      {/* =========================================
          BACKGROUND
      ========================================== */}
      <BackgroundAnimation />

      {/* =========================================
          AUTH PAGE
      ========================================== */}
      <main className="auth-page">

        {/* =======================================
            LEFT HERO SECTION
        ======================================== */}
        <section className="auth-hero-area">
          <HeroSection />
        </section>

        {/* =======================================
            RIGHT AUTH CARD
        ======================================== */}
        <section className="auth-card-area">
          <AuthCard />
        </section>

      </main>

      {/* =========================================
          SCROLL INDICATOR
      ========================================== */}
      <div className="auth-scroll-indicator">
        <span className="scroll-line"></span>
        <span>SCROLL TO EXPLORE</span>
      </div>
    </div>
  );
};

export default AuthPage;