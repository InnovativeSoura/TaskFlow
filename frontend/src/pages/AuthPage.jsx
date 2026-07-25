// src/pages/AuthPage.jsx

import BackgroundAnimation from "../components/BackgroundAnimation";

import HeroSection from "../components/auth/HeroSection";
import AuthCard from "../components/auth/AuthCard";

import "../styles/Auth.css";


const AuthPage = () => {

  return (
    <>

      {/* ======================================
          BACKGROUND
      ======================================= */}

      <BackgroundAnimation />


      {/* ======================================
          AUTH PAGE
      ======================================= */}

      <main className="auth-page">

        {/* ====================================
            LEFT HERO
        ===================================== */}

        <HeroSection />


        {/* ====================================
            LOGIN / REGISTER CARD
        ===================================== */}

        <AuthCard />

      </main>

    </>
  );
};


export default AuthPage;