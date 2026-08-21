// src/components/auth/AuthCard.jsx

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaCheck,
  FaUsers,
  FaArrowUp,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import AuthToggle from "./auth/AuthToggle";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import SocialButtons from "./auth/SocialButtons";


/* =========================================================
   AUTH CARD
========================================================= */

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

  const getApiBaseUrl = useCallback(() => {

    const envUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    return envUrl
      .replace(/\/+$/, "")
      .replace(/\/api$/, "");

  }, []);


  const API_BASE_URL =
    getApiBaseUrl();


  /* =========================================================
     LOGIN / REGISTER MODE
  ========================================================= */

  const [isLogin, setIsLogin] =
    useState(
      location.pathname !== "/register"
    );


  /* =========================================================
     UI STATE
  ========================================================= */

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


  /* =========================================================
     FORM DATA
  ========================================================= */

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Team Member",
    });


  /* =========================================================
     SYNC MODE WITH URL
     FULL AUTH PAGE ONLY
  ========================================================= */

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


  /* =========================================================
     LANDING PAGE AUTH MODE EVENT
  ========================================================= */

  useEffect(() => {

    if (!compact) {
      return;
    }

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
     AUTH CARD READY
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
     CHANGE HANDLER
  ========================================================= */

  const handleChange = (event) => {

    setError("");

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  /* =========================================================
     SWITCH LOGIN / REGISTER
  ========================================================= */

  const switchMode = (loginMode) => {

    if (
      loginMode === isLogin
    ) {
      return;
    }

    resetForm();

    setIsLogin(loginMode);


    /*
      COMPACT MODE
      ----------------------------------
      Stay on the landing page.
    */

    if (compact) {
      return;
    }


    /*
      FULL AUTH PAGE
      ----------------------------------
      Use normal authentication routes.
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


  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleLogin = () => {

    window.location.href =
      `${API_BASE_URL}/api/auth/google`;

  };


  /* =========================================================
     GITHUB LOGIN
  ========================================================= */

  const handleGithubLogin = () => {

    window.location.href =
      `${API_BASE_URL}/api/auth/github`;

  };


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {

    event.preventDefault();


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
         FAILED RESPONSE
      ===================================================== */

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


      /* =====================================================
         SUCCESS
      ===================================================== */

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      setError(
        error?.message ||
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

    navigate(
      "/forgot-password"
    );

  };


  /* =========================================================
     CARD WIDTH
  ========================================================= */

  const cardStyle = compact
    ? {
        width: "min(390px, calc(100vw - 32px))",
        maxWidth: "390px",
        minWidth: "320px",
      }
    : undefined;


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <motion.div
      className={`auth-card ${
        compact
          ? "compact auth-card-wide"
          : ""
      }`}
      id={
        compact
          ? "landing-auth-card"
          : undefined
      }
      style={cardStyle}
      initial={
        compact
          ? {
              opacity: 0,
              x: 40,
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
          : undefined
      }
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >

      {/* =====================================================
          WORKSPACE STATUS HEADER
      ===================================================== */}

      {compact && (

        <motion.div
          className="auth-workspace-status"
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.35,
          }}
        >

          <div className="workspace-ready">

            <span className="workspace-ready-dot">
              <FaCheck />
            </span>

            <div className="workspace-ready-text">

              <span className="workspace-ready-title">
                Workspace is ready
              </span>

              <span className="workspace-ready-subtitle">
                Your project hub is online
              </span>

            </div>

          </div>


          <div className="workspace-members">

            <div
              className="workspace-avatar avatar-purple"
              title="Souradipta"
            >
              S
            </div>

            <div
              className="workspace-avatar avatar-blue"
              title="Team Member"
            >
              A
            </div>

            <div
              className="workspace-avatar avatar-cyan"
              title="Team Member"
            >
              K
            </div>

            <span className="workspace-member-count">
              +18
            </span>

          </div>

        </motion.div>

      )}


      {/* =====================================================
          LOGIN / REGISTER TOGGLE
      ===================================================== */}

      <AuthToggle
        isLogin={isLogin}
        onToggle={switchMode}
      />


      {/* =====================================================
          FORM ANIMATION
      ===================================================== */}

      <AnimatePresence
        mode="wait"
      >

        <motion.div
          key={
            isLogin
              ? "login"
              : "register"
          }
          initial={{
            opacity: 0,
            y: 22,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -22,
          }}
          transition={{
            duration: 0.32,
            ease: "easeOut",
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

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
              LOGIN FORM
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
               REGISTER FORM
            ================================================= */

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

          <SocialButtons
            onGoogleLogin={
              handleGoogleLogin
            }

            onGithubLogin={
              handleGithubLogin
            }
          />


          {/* =================================================
              AUTH FOOTER
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


          {/* =================================================
              COMPACT CARD FOOTER STATS
          ================================================= */}

          {compact && (

            <motion.div
              className="auth-mini-stats"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.35,
              }}
            >

              <div className="auth-mini-stat">

                <div className="auth-mini-stat-icon">
                  <FaTasksSafeIcon />
                </div>

                <div>
                  <strong>
                    124
                  </strong>

                  <span>
                    Tasks Completed
                  </span>
                </div>

              </div>


              <div className="auth-mini-stat">

                <div className="auth-mini-stat-icon success">
                  <FaArrowUp />
                </div>

                <div>
                  <strong>
                    96%
                  </strong>

                  <span>
                    Project Success
                  </span>
                </div>

              </div>

            </motion.div>

          )}

        </motion.div>

      </AnimatePresence>

    </motion.div>

  );
};


/* =========================================================
   SMALL INTERNAL ICON
   Avoids adding another dependency.
========================================================= */

const FaTasksSafeIcon = () => (

  <FaUsers />

);


export default AuthCard;