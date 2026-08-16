// src/pages/AuthPage.jsx

import BackgroundAnimation from "../components/BackgroundAnimation";

import HeroSection from "../components/auth/HeroSection";
import AuthCard from "../components/auth/AuthCard";

import "../styles/Auth.css";

const AuthPage = () => {
  return (
    <div className="auth-page-wrapper">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <BackgroundAnimation />

      {/* =====================================================
          AUTHENTICATION PAGE
      ===================================================== */}

      <main className="auth-page">

        {/* ===================================================
            LEFT HERO
        =================================================== */}

        <HeroSection />

        {/* ===================================================
            LOGIN / REGISTER CARD
        =================================================== */}

        <AuthCard />

      </main>

    </div>
  );
};

export default AuthPage;