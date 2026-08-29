// src/components/auth/AuthCard.jsx

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import AuthToggle from "./AuthToggle";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialButtons from "./SocialButtons";

import "../../styles/Auth.css";
import "../../styles/AuthCard.css";


const AuthCard = ({
  compact = false,
  onAuthReady,
}) => {

  /* =========================================================
     ROUTER
  ========================================================= */

  const navigate = useNavigate();
  const location = useLocation();


  /* =========================================================
     AUTH
  ========================================================= */

  const {
    login,
    register,
  } = useAuth();


  /* =========================================================
     API URL
  ========================================================= */

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");


  /*
   * If VITE_API_URL already contains /api, don't add it again.
   */
  const AUTH_API_URL = API_URL.endsWith("/api")
    ? API_URL
    : `${API_URL}/api`;


  /* =========================================================
     AUTH MODE
  ========================================================= */

  const [isLogin, setIsLogin] = useState(
    location.pathname !== "/register"
  );


  /* =========================================================
     STATE
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
     FULL AUTH PAGE ROUTE SYNC
  ========================================================= */

  useEffect(() => {

    /*
     * The compact landing-page AuthCard does not
     * synchronize itself with /login or /register.
     */
    if (compact) {
      return;
    }

    setIsLogin(
      location.pathname !== "/register"
    );

  }, [
    location.pathname,
    compact,
  ]);


  /* =========================================================
     LANDING AUTH MODE
  ========================================================= */

  useEffect(() => {

    if (!compact) {
      return;
    }


    const handleAuthMode = (event) => {

      const mode =
        event?.detail?.mode;


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
     AUTH READY
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

    if (loading) {
      return;
    }


    if (loginMode === isLogin) {
      return;
    }


    setError("");

    setShowPassword(false);

    setShowConfirmPassword(false);


    /*
     * Clear the form when changing mode.
     */
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Team Member",
    });


    setIsLogin(loginMode);


    /*
     * On the landing page we DON'T navigate to
     * /login or /register.
     *
     * The authentication card itself simply changes
     * between Login and Register.
     */
    if (compact) {
      return;
    }


    /*
     * This is only used if the standalone auth page
     * is ever used elsewhere.
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


    if (
      !isLogin &&
      !name.trim()
    ) {
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


    if (!isLogin) {

      if (!confirmPassword.trim()) {
        return "Please confirm your password.";
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


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {

    /*
     * VERY IMPORTANT.
     *
     * Prevent the browser from doing a native
     * form submission / page reload.
     */
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }


    if (loading) {
      return;
    }


    /* -------------------------------------------------------
       VALIDATE
    ------------------------------------------------------- */

    const validationError =
      validate();


    if (validationError) {

      setError(
        validationError
      );

      return;
    }


    /* -------------------------------------------------------
       START LOADING
    ------------------------------------------------------- */

    setLoading(true);

    setError("");


    try {

      let result;


      /* =====================================================
         LOGIN
      ===================================================== */

      if (isLogin) {

        result = await login({
          email:
            formData.email.trim(),

          password:
            formData.password,
        });


        /*
         * Remember email.
         */
        if (rememberMe) {

          localStorage.setItem(
            "taskflow_remember_email",
            formData.email.trim()
          );

        } else {

          localStorage.removeItem(
            "taskflow_remember_email"
          );

        }

      }


      /* =====================================================
         REGISTER
      ===================================================== */

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


      /* =====================================================
         AUTHENTICATION FAILED
      ===================================================== */

      if (!result?.success) {

        setError(
          result?.message ||
            "Authentication failed. Please try again."
        );

        return;
      }


      /* =====================================================
         AUTHENTICATION SUCCESS
      ===================================================== */

      console.log(
        "✅ TaskFlow authentication successful."
      );


      /*
       * Clear any previous error.
       */
      setError("");


      /*
       * Reset sensitive form fields.
       */
      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));


      /*
       * IMPORTANT:
       *
       * There is ONLY ONE navigation call.
       *
       * Do NOT call navigate("/dashboard")
       * twice.
       */
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (authError) {

      console.error(
        "❌ Authentication Error:",
        authError
      );


      setError(
        authError?.response?.data?.message ||
        authError?.message ||
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

    if (loading) {
      return;
    }


    console.log(
      "🔐 Starting Google OAuth..."
    );


    window.location.href =
      `${AUTH_API_URL}/auth/google`;

  };


  /* =========================================================
     GITHUB LOGIN
  ========================================================= */

  const handleGithubLogin = () => {

    if (loading) {
      return;
    }


    console.log(
      "🔐 Starting GitHub OAuth..."
    );


    window.location.href =
      `${AUTH_API_URL}/auth/github`;

  };


  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword = () => {

    navigate(
      "/forgot-password"
    );

  };


  /* =========================================================
     CARD CLASS
  ========================================================= */

  const cardClassName = [
    "auth-card",

    compact
      ? "compact"
      : "",

    isLogin
      ? "login-mode"
      : "register-mode",

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
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >

      {/* =====================================================
          TOP PREVIEW BAR
      ===================================================== */}

      {compact && (

        <div className="auth-preview-topbar">

          <div className="auth-preview-status">

            <span className="auth-status-dot" />

            <span>
              Workspace is ready
            </span>

          </div>


          <div className="auth-preview-members">

            <span className="preview-avatar purple">
              S
            </span>

            <span className="preview-avatar blue">
              A
            </span>

            <span className="preview-avatar cyan">
              K
            </span>

            <span className="preview-more">
              +18
            </span>

          </div>

        </div>

      )}


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
          CONTENT
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
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="auth-header">

            <h2 className="auth-title">

              {isLogin ? (
                <>
                  Welcome Back 👋
                </>
              ) : (
                <>
                  Create Account
                </>
              )}

            </h2>


            <p className="auth-subtitle">

              {isLogin
                ? "Sign in to continue managing your projects."
                : "Join TaskFlow and start collaborating today."
              }

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
              LOGIN / REGISTER FORM
          ================================================= */}

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

              error=""

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

              error=""

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

                  disabled={loading}
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

                  disabled={loading}
                >
                  Login
                </button>
              </>

            )}

          </div>

        </motion.div>

      </AnimatePresence>


      {/* =====================================================
          PREVIEW STATS
      ===================================================== */}

      {compact && (

        <div className="auth-preview-stats">

          <div className="auth-preview-stat">

            <div className="auth-preview-stat-icon">
              ✓
            </div>


            <div className="auth-preview-stat-content">

              <span className="auth-preview-stat-value">
                124
              </span>

              <span className="auth-preview-stat-label">
                Tasks Completed
              </span>

            </div>

          </div>


          <div className="auth-preview-stat success">

            <div className="auth-preview-stat-icon">
              ↗
            </div>


            <div className="auth-preview-stat-content">

              <span className="auth-preview-stat-value">
                96%
              </span>

              <span className="auth-preview-stat-label">
                Project Success
              </span>

            </div>

          </div>

        </div>

      )}

    </motion.div>
  );
};


export default AuthCard;