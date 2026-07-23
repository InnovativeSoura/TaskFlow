import BackgroundAnimation from "../components/BackgroundAnimation";

import HeroSection from "../components/auth/HeroSection";
import AuthCard from "../components/auth/AuthCard";

import "../styles/Auth.css";

const AuthPage = () => {
  return (
    <>
      <BackgroundAnimation />

      <main className="auth-page">
        <HeroSection />

        <AuthCard />
      </main>
    </>
  );
};

export default AuthPage;