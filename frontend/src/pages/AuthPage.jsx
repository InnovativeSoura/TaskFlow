// src/pages/AuthPage.jsx

import BackgroundAnimation from "../components/BackgroundAnimation";

import HeroSection from "../components/auth/HeroSection";
import AuthCard from "../components/auth/AuthCard";

import "../styles/Auth.css";

const AuthPage = () => {
  return (
    <div className="auth-page-wrapper">
      <BackgroundAnimation />

      <main className="auth-page">
        <section className="auth-hero-area">
          <HeroSection />
        </section>

        <section className="auth-card-area">
          <AuthCard />
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
