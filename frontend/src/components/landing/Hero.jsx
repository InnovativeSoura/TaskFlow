import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  FaArrowRight,
  FaCheck,
  FaPlay,
  FaEnvelope,
  FaLock,
  FaEye,
  FaGoogle,
  FaGithub,
  FaUsers,
  FaTasks,
  FaClock,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

import "./Hero.css";

const Hero = () => {
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollToAuth = () => {
    const authCard = document.querySelector(".tf-auth-preview");

    if (authCard) {
      authCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const openAuth = (mode) => {
    setActiveTab(mode);
    setShowPassword(false);

    setTimeout(() => {
      scrollToAuth();
    }, 50);
  };

  useEffect(() => {
    const handleAuthMode = (event) => {
      const mode = event?.detail?.mode;

      if (mode !== "login" && mode !== "register") {
        return;
      }

      setActiveTab(mode);
      setShowPassword(false);

      setTimeout(() => {
        scrollToAuth();
      }, 50);
    };

    window.addEventListener("taskflow-auth-mode", handleAuthMode);

    return () => {
      window.removeEventListener("taskflow-auth-mode", handleAuthMode);
    };
  }, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      if (activeTab === "login") {
        result = await login({
          email: email.trim(),
          password,
        });
      } else {
        result = await register({
          name: email.split("@")[0],
          email: email.trim(),
          password,
          role: "Team Member",
        });
      }

      if (!result?.success) {
        setError(result?.message || "Authentication failed. Please try again.");

        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Landing authentication error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    const baseUrl = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;

    window.location.href = `${baseUrl}/auth/google`;
  };

  const handleGithubLogin = () => {
    const apiUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    const baseUrl = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;

    window.location.href = `${baseUrl}/auth/github`;
  };

  return (
    <div className="tf-hero" id="home">
      <div className="tf-hero-glow tf-hero-glow-left" />

      <div className="tf-hero-glow tf-hero-glow-right" />

      <div className="tf-hero-ring tf-ring-one" />

      <div className="tf-hero-ring tf-ring-two" />

      <div className="tf-hero-grid" />

      <div className="tf-hero-container">
        <div className="tf-hero-content">
          <div className="tf-hero-badge">
            <FaRocket />

            <span>Next Generation Project Management</span>

            <FaArrowRight />
          </div>

          <h1 className="tf-hero-title">
            <span>Manage Projects.</span>

            <span className="tf-gradient-text">Collaborate Faster.</span>

            <span>Deliver On Time.</span>
          </h1>

          <p className="tf-hero-description">
            TaskFlow is an all-in-one project management platform built for
            modern teams. Plan projects, assign tasks, monitor progress and
            collaborate in real time — all from one intelligent workspace.
          </p>

          <div className="tf-hero-actions">
            <button
              type="button"
              className="tf-primary-cta"
              onClick={() => openAuth("register")}
            >
              <span>Start Free</span>

              <FaArrowRight />
            </button>

            <a href="#features" className="tf-secondary-cta">
              <span className="tf-play-icon">
                <FaPlay />
              </span>

              <span>Explore Features</span>
            </a>
          </div>

          <div className="tf-hero-benefits">
            <div className="tf-benefit">
              <FaCheck />

              <span>Free Forever Plan</span>
            </div>

            <div className="tf-benefit">
              <FaCheck />

              <span>2 Minute Setup</span>
            </div>

            <div className="tf-benefit">
              <FaCheck />

              <span>No Credit Card Required</span>
            </div>
          </div>

          <div className="tf-hero-stats">
            <div className="tf-stat-card">
              <div className="tf-stat-icon">
                <FaUsers />
              </div>

              <div className="tf-stat-info">
                <strong>10K+</strong>

                <span>Teams</span>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon">
                <FaTasks />
              </div>

              <div className="tf-stat-info">
                <strong>500K+</strong>

                <span>Tasks Managed</span>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon">
                <FaClock />
              </div>

              <div className="tf-stat-info">
                <strong>99.9%</strong>

                <span>Uptime</span>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon">
                <FaChartLine />
              </div>

              <div className="tf-stat-info">
                <strong>4.9/5</strong>

                <span>User Rating</span>

                <div className="tf-stars">★ ★ ★ ★ ★</div>
              </div>
            </div>
          </div>
        </div>

        <div className="tf-auth-preview">
          <div className="tf-auth-card">
            <div className="tf-auth-header">
              <div className="tf-workspace-status">
                <span className="tf-status-dot" />

                <span>Workspace is ready</span>
              </div>

              <div className="tf-team-avatars">
                <span className="tf-avatar tf-avatar-purple">S</span>

                <span className="tf-avatar tf-avatar-blue">A</span>

                <span className="tf-avatar tf-avatar-cyan">K</span>

                <span className="tf-avatar-more">+12</span>
              </div>
            </div>

            <div className="tf-auth-tabs">
              <button
                type="button"
                className={activeTab === "login" ? "active" : ""}
                onClick={() => {
                  setActiveTab("login");
                  setShowPassword(false);
                }}
              >
                Login
              </button>

              <button
                type="button"
                className={activeTab === "register" ? "active" : ""}
                onClick={() => {
                  setActiveTab("register");
                  setShowPassword(false);
                }}
              >
                Register
              </button>
            </div>

            <div className="tf-auth-title">
              <h2>
                {activeTab === "login"
                  ? "Welcome Back 👋"
                  : "Create Your Account 🚀"}
              </h2>

              <p>
                {activeTab === "login"
                  ? "Sign in to continue managing your projects."
                  : "Start managing your projects with TaskFlow."}
              </p>
            </div>

            {error && <div className="tf-auth-error">{error}</div>}

            <form className="tf-auth-form" onSubmit={handleAuthSubmit}>
              <div className="tf-input-wrapper">
                <FaEnvelope />

                <input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  aria-label="Email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
              </div>

              <div className="tf-input-wrapper">
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  autoComplete={
                    activeTab === "login" ? "current-password" : "new-password"
                  }
                  aria-label="Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="tf-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FaEye />
                </button>
              </div>

              {activeTab === "login" && (
                <div className="tf-remember-row">
                  <label className="tf-checkbox-label">
                    <input type="checkbox" defaultChecked />

                    <span className="tf-custom-checkbox">
                      <FaCheck />
                    </span>

                    <span>Remember me</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="tf-auth-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Please wait..."
                    : activeTab === "login"
                      ? "Sign In"
                      : "Create Account"}
                </span>

                {!loading && <FaArrowRight />}
              </button>
            </form>

            <div className="tf-divider">
              <span />

              <p>or continue with</p>

              <span />
            </div>

            <div className="tf-social-buttons">
              <button
                type="button"
                className="tf-social-btn"
                onClick={handleGoogleLogin}
              >
                <FaGoogle />

                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="tf-social-btn"
                onClick={handleGithubLogin}
              >
                <FaGithub />

                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="tf-auth-metrics">
              <div className="tf-auth-metric">
                <div className="tf-metric-icon">
                  <FaRocket />
                </div>

                <div>
                  <strong>124</strong>

                  <span>Projects Completed</span>
                </div>
              </div>

              <div className="tf-auth-metric">
                <div className="tf-success-circle">
                  <span>✓</span>
                </div>

                <div>
                  <strong>96%</strong>

                  <span>Project Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tf-scroll-indicator">
        <span>SCROLL TO EXPLORE</span>

        <div className="tf-scroll-line" />
      </div>
    </div>
  );
};

export default Hero;
