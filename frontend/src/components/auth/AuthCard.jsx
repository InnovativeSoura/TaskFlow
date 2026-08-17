// src/components/auth/AuthCard.jsx

import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaArrowRight,
  FaUser,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import "../../styles/Auth.css";

const AuthCard = ({
  compact = false,
  onAuthReady,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    register,
  } = useAuth();

  /* =========================================================
     API URL
  ========================================================= */

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/+$/, "");

  /* =========================================================
     AUTH MODE
  ========================================================= */

  const [isLogin, setIsLogin] = useState(
    location.pathname !== "/register"
  );

  /* =========================================================
     UI STATE
  ========================================================= */

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =========================================================
     FORM DATA
  ========================================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Team Member",
  });

  /* =========================================================
     SYNC FULL AUTH PAGE WITH URL
  ========================================================= */

  useEffect(() => {
    if (compact) return;

    setIsLogin(
      location.pathname !== "/register"
    );
  }, [
    location.pathname,
    compact,
  ]);

  /* =========================================================
     LANDING PAGE AUTH TOGGLE
  ========================================================= */

  useEffect(() => {
    if (!compact) return;

    const handleAuthMode = (event) => {
      const mode = event.detail?.mode;

      if (
        mode !== "login" &&
        mode !== "register"
      ) {
        return;
      }

      setError("");

      setIsLogin(
        mode === "login"
      );

      setShowPassword(false);
      setShowConfirmPassword(false);
    };

    window.addEventListener(
      "taskflow-auth-mode",
      handleAuthMode
    );

    return () => {
      window.removeEventListener(
        "taskflow-auth-mode",
        handleAuthMode
      );
    };
  }, [compact]);

  /* =========================================================
     AUTH READY CALLBACK
  ========================================================= */

  useEffect(() => {
    if (
      compact &&
      typeof onAuthReady === "function"
    ) {
      onAuthReady();
    }
  }, [
    compact,
    onAuthReady,
  ]);

  /* =========================================================
     CHANGE HANDLER
  ========================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setError("");

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setError("");

    setShowPassword(false);
    setShowConfirmPassword(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Team Member",
    });
  };

  /* =========================================================
     SWITCH LOGIN / REGISTER
  ========================================================= */

  const switchMode = (loginMode) => {
    if (loginMode === isLogin) {
      return;
    }

    resetForm();

    setIsLogin(loginMode);

    if (compact) {
      return;
    }

    navigate(
      loginMode
        ? "/login"
        : "/register",
      {
        replace: true,
      }
    );
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validate = () => {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!isLogin && !name.trim()) {
      return "Full Name is required.";
    }

    if (!email.trim()) {
      return "Email is required.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {
      return "Enter a valid email address.";
    }

    if (!password.trim()) {
      return "Password is required.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (
      !isLogin &&
      password !== confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const validation = validate();

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      if (isLogin) {
        result = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        result = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        });
      }

      if (
        !result ||
        !result.success
      ) {
        setError(
          result?.message ||
            "Authentication failed."
        );

        return;
      }

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      console.error(
        "Authentication error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  /* =========================================================
     GOOGLE
  ========================================================= */

  const handleGoogleLogin = () => {
    window.location.href =
      `${API_URL}/auth/google`;
  };

  /* =========================================================
     GITHUB
  ========================================================= */

  const handleGithubLogin = () => {
    window.location.href =
      `${API_URL}/auth/github`;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <motion.section
      className={`auth-card ${
        compact ? "compact" : ""
      }`}
      id={
        compact
          ? "landing-auth-card"
          : undefined
      }
      initial={
        compact
          ? {
              opacity: 0,
              x: 30,
            }
          : false
      }
      animate={
        compact
          ? {
              opacity: 1,
              x: 0,
            }
          : undefined
      }
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
    >

      {/* =====================================================
          WORKSPACE STATUS
      ====================================================== */}

      <div className="auth-workspace-bar">

        <div className="workspace-ready">

          <span className="workspace-ready-dot">
            <span />
          </span>

          <span>
            Workspace is ready
          </span>

        </div>

        <div className="workspace-members">

          <span className="member-avatar member-purple">
            S
          </span>

          <span className="member-avatar member-blue">
            A
          </span>

          <span className="member-avatar member-cyan">
            K
          </span>

          <span className="member-count">
            +18
          </span>

        </div>

      </div>

      {/* =====================================================
          LOGIN / REGISTER TOGGLE
      ====================================================== */}

      <div className="auth-toggle">

        <button
          type="button"
          className={`auth-toggle-button ${
            isLogin ? "active" : ""
          }`}
          onClick={() =>
            switchMode(true)
          }
        >
          Login
        </button>

        <button
          type="button"
          className={`auth-toggle-button ${
            !isLogin ? "active" : ""
          }`}
          onClick={() =>
            switchMode(false)
          }
        >
          Register
        </button>

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <AnimatePresence mode="wait">

        <motion.div
          key={
            isLogin
              ? "login"
              : "register"
          }
          className="auth-content"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -12,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="auth-header">

            <h2 className="auth-title">
              {isLogin
                ? "Welcome Back 👋"
                : "Create Your Account"}
            </h2>

            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to continue managing your projects."
                : "Join TaskFlow and start collaborating today."}
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ===============================================
                NAME
            ================================================ */}

            {!isLogin && (
              <div className="auth-field">

                <label htmlFor="auth-name">
                  Full Name
                </label>

                <div className="auth-input-wrapper">

                  <FaUser className="auth-input-icon" />

                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading}
                  />

                </div>

              </div>
            )}

            {/* ===============================================
                EMAIL
            ================================================ */}

            <div className="auth-field">

              <label htmlFor="auth-email">
                Email Address
              </label>

              <div className="auth-input-wrapper">

                <FaEnvelope className="auth-input-icon" />

                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* ===============================================
                PASSWORD
            ================================================ */}

            <div className="auth-field">

              <label htmlFor="auth-password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <FaLock className="auth-input-icon" />

                <input
                  id="auth-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isLogin
                      ? "current-password"
                      : "new-password"
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* ===============================================
                CONFIRM PASSWORD
            ================================================ */}

            {!isLogin && (
              <div className="auth-field">

                <label htmlFor="auth-confirm-password">
                  Confirm Password
                </label>

                <div className="auth-input-wrapper">

                  <FaLock className="auth-input-icon" />

                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>
            )}

            {/* ===============================================
                ERROR
            ================================================ */}

            {error && (
              <motion.div
                className="auth-error"
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                {error}
              </motion.div>
            )}

            {/* ===============================================
                LOGIN OPTIONS
            ================================================ */}

            {isLogin && (
              <div className="auth-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() =>
                      setRememberMe(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={
                    handleForgotPassword
                  }
                >
                  Forgot Password?
                </button>

              </div>
            )}

            {/* ===============================================
                SUBMIT
            ================================================ */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner" />
                  <span>
                    Please wait...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </span>

                  <FaArrowRight />
                </>
              )}

            </button>

          </form>

          {/* =================================================
              DIVIDER
          ================================================== */}

          <div className="auth-divider">

            <span />

            <p>
              or continue with
            </p>

            <span />

          </div>

          {/* =================================================
              SOCIAL BUTTONS
          ================================================== */}

          <div className="social-buttons">

            <button
              type="button"
              className="social-button"
              onClick={
                handleGoogleLogin
              }
              disabled={loading}
            >
              <FaGoogle />
              <span>
                Continue with Google
              </span>
            </button>

            <button
              type="button"
              className="social-button"
              onClick={
                handleGithubLogin
              }
              disabled={loading}
            >
              <FaGithub />
              <span>
                Continue with GitHub
              </span>
            </button>

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="auth-footer">

            <span>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              className="link-button"
              onClick={() =>
                switchMode(!isLogin)
              }
            >
              {isLogin
                ? "Register Now"
                : "Login"}
            </button>

          </div>

        </motion.div>

      </AnimatePresence>

      {/* =====================================================
          BOTTOM STATS
      ====================================================== */}

      <div className="auth-stats">

        <div className="auth-stat">

          <div className="auth-stat-icon">
            <FaTasks />
          </div>

          <div>
            <strong>124</strong>
            <span>
              Tasks Completed
            </span>
          </div>

        </div>

        <div className="auth-stat">

          <div className="auth-stat-icon success">
            <FaChartLine />
          </div>

          <div>
            <strong>96%</strong>
            <span>
              Project Success
            </span>
          </div>

        </div>

      </div>

    </motion.section>
  );
};

export default AuthCard;