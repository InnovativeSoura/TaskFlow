// src/components/auth/AuthCard.jsx

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import AuthToggle from "./AuthToggle";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialButtons from "./SocialButtons";

const AuthCard = ({
  compact = false,
  onAuthReady,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  /* =========================================================
     API URL
  ========================================================= */

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/$/, "");

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
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Team Member",
  });

  /* =========================================================
     SYNC FULL AUTH PAGE WITH ROUTE
  ========================================================= */

  useEffect(() => {
    if (compact) return;

    setIsLogin(
      location.pathname !== "/register"
    );
  }, [location.pathname, compact]);

  /* =========================================================
     LANDING PAGE AUTH TOGGLE EVENT

     LandingNavbar / Hero buttons can dispatch:

     window.dispatchEvent(
       new CustomEvent("taskflow-auth-mode", {
         detail: { mode: "login" }
       })
     );
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

      setIsLogin(mode === "login");

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
     NOTIFY PARENT THAT AUTH CARD IS READY
  ========================================================= */

  useEffect(() => {
    if (
      compact &&
      typeof onAuthReady === "function"
    ) {
      onAuthReady();
    }
  }, [compact, onAuthReady]);

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
     INPUT CHANGE
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
     SWITCH LOGIN / REGISTER
  ========================================================= */

  const switchMode = (loginMode) => {
    if (loginMode === isLogin) {
      return;
    }

    resetForm();

    setIsLogin(loginMode);

    /* -----------------------------------------
       LANDING PAGE
       Stay on "/"
    ----------------------------------------- */

    if (compact) {
      return;
    }

    /* -----------------------------------------
       FULL AUTH PAGE
    ----------------------------------------- */

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

    if (!email.trim()) {
      return "Email is required.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return "Enter a valid email address.";
    }

    if (!password.trim()) {
      return "Password is required.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (!isLogin) {
      if (!name.trim()) {
        return "Full Name is required.";
      }

      if (!confirmPassword.trim()) {
        return "Please confirm your password.";
      }

      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
    }

    return "";
  };

  /* =========================================================
     LOGIN / REGISTER SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      /* =====================================
         LOGIN
      ===================================== */

      if (isLogin) {
        result = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      /* =====================================
         REGISTER
      ===================================== */

      else {
        result = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        });
      }

      /* =====================================
         FAILED
      ===================================== */

      if (!result?.success) {
        setError(
          result?.message ||
            "Authentication failed. Please try again."
        );

        return;
      }

      /* =====================================
         SUCCESS
      ===================================== */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Authentication Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleLogin = () => {
    window.location.href =
      `${API_URL}/auth/google`;
  };

  /* =========================================================
     GITHUB LOGIN
  ========================================================= */

  const handleGithubLogin = () => {
    window.location.href =
      `${API_URL}/auth/github`;
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  /* =========================================================
     CARD CLASS
  ========================================================= */

  const cardClassName = [
    "auth-card",
    compact ? "compact" : "",
    isLogin ? "login-mode" : "register-mode",
  ]
    .filter(Boolean)
    .join(" ");

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <motion.div
      className={cardClassName}
      id={
        compact
          ? "landing-auth-card"
          : undefined
      }
      initial={
        compact
          ? {
              opacity: 0,
              x: 35,
              scale: 0.97,
            }
          : false
      }
      animate={
        compact
          ? {
              opacity: 1,
              x: 0,
              scale: 1,
            }
          : false
      }
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      {/* =====================================================
          LOGIN / REGISTER TOGGLE
      ===================================================== */}

      <div className="auth-toggle-wrapper">
        <AuthToggle
          isLogin={isLogin}
          onToggle={switchMode}
        />
      </div>

      {/* =====================================================
          FORM CONTENT
      ===================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={
            isLogin
              ? "login-content"
              : "register-content"
          }
          className="auth-card-content"
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
            ease: "easeOut",
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="auth-header">

            <h2 className="auth-title">
              {isLogin ? (
                <>
                  Welcome
                  <br />
                  Back 👋
                </>
              ) : (
                <>
                  Create
                  <br />
                  Account
                </>
              )}
            </h2>

            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to continue managing your projects."
                : "Join TaskFlow and start collaborating today."}
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          <AnimatePresence>
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
                exit={{
                  opacity: 0,
                  y: -5,
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              LOGIN
          ================================================= */}

          {isLogin ? (
            <LoginForm
              email={formData.email}
              password={formData.password}
              rememberMe={rememberMe}
              loading={loading}
              error=""
              showPassword={showPassword}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onTogglePassword={() =>
                setShowPassword(
                  (previous) =>
                    !previous
                )
              }
              onRememberChange={() =>
                setRememberMe(
                  (previous) =>
                    !previous
                )
              }
              onForgotPassword={
                handleForgotPassword
              }
            />
          ) : (
            /* =================================================
               REGISTER
            ================================================= */

            <RegisterForm
              name={formData.name}
              email={formData.email}
              password={formData.password}
              confirmPassword={
                formData.confirmPassword
              }
              role={formData.role}
              loading={loading}
              error=""
              showPassword={showPassword}
              showConfirmPassword={
                showConfirmPassword
              }
              onChange={handleChange}
              onSubmit={handleSubmit}
              onTogglePassword={() =>
                setShowPassword(
                  (previous) =>
                    !previous
                )
              }
              onToggleConfirmPassword={() =>
                setShowConfirmPassword(
                  (previous) =>
                    !previous
                )
              }
            />
          )}

          {/* =================================================
              SOCIAL LOGIN
          ================================================= */}

          <div className="auth-social-wrapper">
            <SocialButtons
              onGoogleLogin={
                handleGoogleLogin
              }
              onGithubLogin={
                handleGithubLogin
              }
            />
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="auth-footer">

            {isLogin ? (
              <>
                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    switchMode(false)
                  }
                >
                  Register Now
                </button>
              </>
            ) : (
              <>
                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    switchMode(true)
                  }
                >
                  Login
                </button>
              </>
            )}

          </div>

        </motion.div>
      </AnimatePresence>

    </motion.div>
  );
};

export default AuthCard;