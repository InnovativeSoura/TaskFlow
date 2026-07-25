// src/components/auth/AuthCard.jsx

import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

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

  const {
    login,
    register,
  } = useAuth();

  /* ==========================================
      API URL
  ========================================== */

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/$/, "");

  /* ==========================================
      LOGIN / REGISTER MODE
  ========================================== */

  const [isLogin, setIsLogin] = useState(
    location.pathname !== "/register"
  );

  /* ==========================================
      SYNC MODE WITH URL
      ONLY FOR FULL AUTH PAGE
  ========================================== */

  useEffect(() => {
    if (!compact) {
      setIsLogin(
        location.pathname !== "/register"
      );
    }
  }, [
    location.pathname,
    compact,
  ]);

  /* ==========================================
      LISTEN FOR LANDING PAGE AUTH REQUESTS
  ========================================== */

  useEffect(() => {
    if (!compact) return;

    const handleAuthMode = (event) => {
      const mode =
        event.detail?.mode;

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

      // Reset password visibility
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

  /* ==========================================
      NOTIFY PARENT THAT AUTH CARD IS READY
  ========================================== */

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

  /* ==========================================
      UI STATE
  ========================================== */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /* ==========================================
      FORM DATA
  ========================================== */

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Team Member",
    });

  /* ==========================================
      OAUTH
  ========================================== */

  const handleGoogleLogin = () => {
    window.location.href =
      `${API_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href =
      `${API_URL}/api/auth/github`;
  };

  /* ==========================================
      RESET FORM
  ========================================== */

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

  /* ==========================================
      CHANGE HANDLER
  ========================================== */

  const handleChange = (e) => {
    setError("");

    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }));
  };

  /* ==========================================
      SWITCH MODE
  ========================================== */

  const switchMode = (
    loginMode
  ) => {
    if (
      loginMode === isLogin
    ) {
      return;
    }

    resetForm();

    setIsLogin(loginMode);

    /*
      COMPACT MODE
      -------------------------------
      Stay on the landing page.
      Do NOT navigate to /login
      or /register.
    */

    if (compact) {
      return;
    }

    /*
      FULL AUTH PAGE
      -------------------------------
      Continue using normal routes.
    */

    navigate(
      loginMode
        ? "/login"
        : "/register",
      {
        replace: true,
      }
    );
  };

  /* ==========================================
      VALIDATION
  ========================================== */

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

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {
      return "Enter a valid email.";
    }

    if (!password.trim()) {
      return "Password is required.";
    }

    if (password.length < 6) {
      return (
        "Password must contain at least 6 characters."
      );
    }

    if (!isLogin) {
      if (!name.trim()) {
        return "Full Name is required.";
      }

      if (
        password !==
        confirmPassword
      ) {
        return "Passwords do not match.";
      }
    }

    return "";
  };

  /* ==========================================
      SUBMIT
  ========================================== */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const validation =
      validate();

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      /* ==============================
          LOGIN
      =============================== */

      if (isLogin) {
        result = await login({
          email:
            formData.email.trim(),

          password:
            formData.password,
        });
      }

      /* ==============================
          REGISTER
      =============================== */

      else {
        result = await register({
          name:
            formData.name.trim(),

          email:
            formData.email.trim(),

          password:
            formData.password,

          role:
            formData.role,
        });
      }

      /* ==============================
          FAILED RESPONSE
      =============================== */

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

      /* ==============================
          SUCCESS
      =============================== */

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
      FORGOT PASSWORD
  ========================================== */

  const handleForgotPassword = () => {
    navigate(
      "/forgot-password"
    );
  };

  /* ==========================================
      RENDER
  ========================================== */

  return (
    <div
      className={`auth-card ${
        compact
          ? "compact"
          : ""
      }`}
      id={
        compact
          ? "landing-auth-card"
          : undefined
      }
    >

      {/* ======================================
          LOGIN / REGISTER TOGGLE
      ======================================= */}

      <AuthToggle
        isLogin={isLogin}
        onToggle={switchMode}
      />

      {/* ======================================
          FORM ANIMATION
      ======================================= */}

      <AnimatePresence mode="wait">

        <motion.div
          key={
            isLogin
              ? "login"
              : "register"
          }
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -25,
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >

          {/* ==================================
              HEADER
          =================================== */}

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

          {/* ==================================
              LOGIN FORM
          =================================== */}

          {isLogin ? (

            <LoginForm
              email={
                formData.email
              }

              password={
                formData.password
              }

              rememberMe={
                rememberMe
              }

              loading={
                loading
              }

              error={
                error
              }

              showPassword={
                showPassword
              }

              onChange={
                handleChange
              }

              onSubmit={
                handleSubmit
              }

              onTogglePassword={() =>
                setShowPassword(
                  (prev) =>
                    !prev
                )
              }

              onRememberChange={() =>
                setRememberMe(
                  (prev) =>
                    !prev
                )
              }

              onForgotPassword={
                handleForgotPassword
              }
            />

          ) : (

            /* ==================================
                REGISTER FORM
            =================================== */

            <RegisterForm
              name={
                formData.name
              }

              email={
                formData.email
              }

              password={
                formData.password
              }

              confirmPassword={
                formData.confirmPassword
              }

              role={
                formData.role
              }

              loading={
                loading
              }

              error={
                error
              }

              showPassword={
                showPassword
              }

              showConfirmPassword={
                showConfirmPassword
              }

              onChange={
                handleChange
              }

              onSubmit={
                handleSubmit
              }

              onTogglePassword={() =>
                setShowPassword(
                  (prev) =>
                    !prev
                )
              }

              onToggleConfirmPassword={() =>
                setShowConfirmPassword(
                  (prev) =>
                    !prev
                )
              }
            />

          )}

          {/* ==================================
              SOCIAL LOGIN
          =================================== */}

          <SocialButtons
            onGoogleLogin={
              handleGoogleLogin
            }

            onGithubLogin={
              handleGithubLogin
            }
          />

          {/* ==================================
              AUTH FOOTER
          =================================== */}

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

    </div>
  );
};

export default AuthCard;