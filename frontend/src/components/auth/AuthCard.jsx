// src/components/auth/AuthCard.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

import AuthToggle from "./AuthToggle";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialButtons from "./SocialButtons";

const AuthCard = ({ compact = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  /* ==========================================
      API URL
  ========================================== */

  const API_URL =
  import.meta.env.VITE_API_URL.replace(/\/$/, "");

  /* ==========================================
      LOGIN / REGISTER MODE
  ========================================== */

  const [isLogin, setIsLogin] = useState(
    location.pathname !== "/register"
  );

  useEffect(() => {
    if (!compact) {
      setIsLogin(
        location.pathname !== "/register"
      );
    }
  }, [location.pathname, compact]);

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
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
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
    if (loginMode === isLogin)
      return;

    resetForm();

    setIsLogin(loginMode);

    if (!compact) {
      navigate(
        loginMode
          ? "/login"
          : "/register",
        {
          replace: true,
        }
      );
    }
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

    if (!email.trim())
      return "Email is required.";

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
      return "Enter a valid email.";

    if (!password.trim())
      return "Password is required.";

    if (password.length < 6)
      return "Password must contain at least 6 characters.";

    if (!isLogin) {
      if (!name.trim())
        return "Full Name is required.";

      if (
        password !==
        confirmPassword
      )
        return "Passwords do not match.";
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

    if (loading) return;

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

      if (isLogin) {
        result =
          await login({
            email:
              formData.email.trim(),
            password:
              formData.password,
          });
      } else {
        result =
          await register({
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

      if (!result.success) {
        setError(
          result.message
        );
        return;
      }

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-card ${
        compact ? "compact" : ""
      }`}
    >
      <AuthToggle
        isLogin={isLogin}
        onToggle={switchMode}
      />

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
          }}
        >
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

          {isLogin ? (
            <LoginForm
              email={formData.email}
              password={formData.password}
              rememberMe={
                rememberMe
              }
              loading={loading}
              error={error}
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
              onForgotPassword={() =>
                navigate(
                  "/forgot-password"
                )
              }
            />
          ) : (
            <RegisterForm
              name={formData.name}
              email={formData.email}
              password={formData.password}
              confirmPassword={
                formData.confirmPassword
              }
              role={formData.role}
              loading={loading}
              error={error}
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

          <SocialButtons
            onGoogleLogin={
              handleGoogleLogin
            }
            onGithubLogin={
              handleGithubLogin
            }
          />

          <div className="auth-footer">
            {isLogin ? (
              <>
                <span>
                  Don't have an
                  account?
                </span>

                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    switchMode(
                      false
                    )
                  }
                >
                  Register Now
                </button>
              </>
            ) : (
              <>
                <span>
                  Already have an
                  account?
                </span>

                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    switchMode(
                      true
                    )
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