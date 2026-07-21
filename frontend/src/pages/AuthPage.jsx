// src/pages/AuthPage.jsx

import { useState, useEffect } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserTie,
  FaArrowRight,
  FaGoogle,
  FaGithub,
  FaCheckCircle,
} from "react-icons/fa";

import BackgroundAnimation from "../components/BackgroundAnimation";
import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";


const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  /* ==========================================
      LOGIN / REGISTER MODE
  ========================================== */

  const [isLogin, setIsLogin] = useState(
    location.pathname === "/login"
  );

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  /* ==========================================
      UI STATES
  ========================================== */

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /* ==========================================
      FORM
  ========================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Team Member",
  });

  const {
    name,
    email,
    password,
    confirmPassword,
    role,
  } = formData;

  /* ==========================================
      SWITCH LOGIN / REGISTER
  ========================================== */

  const switchMode = (loginMode) => {
    if (loginMode === isLogin) return;

    setError("");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Team Member",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    setIsLogin(loginMode);

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
      INPUT CHANGE
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
      VALIDATION
  ========================================== */

  const validate = () => {
    if (!email.trim()) {
      return "Email is required.";
    }

    if (!password.trim()) {
      return "Password is required.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!isLogin) {
      if (!name.trim()) {
        return "Full Name is required.";
      }

      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
    }

    return "";
  };

  /* ==========================================
      SUBMIT
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const validation = validate();

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);

    setError("");

    try {
      let response;

      if (isLogin) {
        response = await login({
          email: email.trim(),
          password,
        });
      } else {
        response = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
      }

      if (!response.success) {
        setError(response.message);

        setLoading(false);

        return;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
    /* ==========================================
      JSX
  ========================================== */

  return (
    <>
      <BackgroundAnimation />

      <div className="auth-page">

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <motion.section
          className="auth-left"
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >

          <span className="hero-badge">
            🚀 Smart Project Management
          </span>

          <h1>
            Manage Projects
            <br />

            <span>
              Like Never Before
            </span>
          </h1>

          <p>
            Plan projects, organize tasks,
            collaborate with your team,
            monitor progress and boost
            productivity with one powerful
            workspace.
          </p>

          <div className="hero-features">

            <div className="hero-card">
              <FaCheckCircle />

              <span>
                Real-time Collaboration
              </span>
            </div>

            <div className="hero-card">
              <FaCheckCircle />

              <span>
                Kanban Boards
              </span>
            </div>

            <div className="hero-card">
              <FaCheckCircle />

              <span>
                Project Analytics
              </span>
            </div>

            <div className="hero-card">
              <FaCheckCircle />

              <span>
                Team Notifications
              </span>
            </div>

          </div>

        </motion.section>

        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <motion.section
          className="auth-wrapper"
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: .6,
          }}
        >

          <div className="auth-card">

            {/* ============================
                TOGGLE
            ============================= */}

            <div className="auth-toggle">

              <div
                className={`toggle-slider ${
                  isLogin
                    ? "login"
                    : "register"
                }`}
              />

              <button
                type="button"
                className={
                  isLogin
                    ? "active"
                    : ""
                }
                onClick={() =>
                  switchMode(true)
                }
              >
                Login
              </button>

              <button
                type="button"
                className={
                  !isLogin
                    ? "active"
                    : ""
                }
                onClick={() =>
                  switchMode(false)
                }
              >
                Register
              </button>

            </div>

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
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -40,
                }}
                transition={{
                  duration: .35,
                }}
              >
                                {/* ==========================
                    TITLE
                ========================== */}

                <h2 className="auth-title">
                  {isLogin
                    ? "Welcome Back 👋"
                    : "Create Your Account"}
                </h2>

                <p className="auth-subtitle">
                  {isLogin
                    ? "Login to continue managing your projects."
                    : "Join TaskFlow and start collaborating today."}
                </p>

                {/* ==========================
                    ERROR
                ========================== */}

                {error && (
                  <div className="auth-error">
                    {error}
                  </div>
                )}

                {/* ==========================
                    SOCIAL LOGIN
                ========================== */}

                <div className="social-login">

                  <button
                    type="button"
                    className="social-btn"
                  >
                    <FaGoogle />

                    <span>
                      Google
                    </span>
                  </button>

                  <button
                    type="button"
                    className="social-btn"
                  >
                    <FaGithub />

                    <span>
                      GitHub
                    </span>
                  </button>

                </div>

                {/* ==========================
                    DIVIDER
                ========================== */}

                <div className="divider">
                  <span>
                    or continue with email
                  </span>
                </div>

                {/* ==========================
                    FORM
                ========================== */}

                <form
                  className="auth-form"
                  onSubmit={handleSubmit}
                >

                  {/* ======================
                      REGISTER ONLY
                  ====================== */}

                  {!isLogin && (
                    <>

                      <div className="input-group">

                        <FaUser
                          className="input-icon"
                        />

                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          autoComplete="name"
                          required
                        />

                      </div>

                      <div className="input-group">

                        <FaUserTie
                          className="input-icon"
                        />

                        <select
                          name="role"
                          value={role}
                          onChange={handleChange}
                        >
                          <option value="Team Member">
                            Team Member
                          </option>

                          <option value="Project Manager">
                            Project Manager
                          </option>

                          <option value="Admin">
                            Admin
                          </option>

                        </select>

                      </div>

                    </>
                  )}

                  {/* ======================
                      EMAIL
                  ====================== */}

                  <div className="input-group">

                    <FaEnvelope
                      className="input-icon"
                    />

                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                    />

                  </div>
                                    {/* ======================
                      PASSWORD
                  ====================== */}

                  <div className="input-group password-group">

                    <FaLock
                      className="input-icon"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Password"
                      autoComplete={
                        isLogin
                          ? "current-password"
                          : "new-password"
                      }
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                  {/* ======================
                      CONFIRM PASSWORD
                  ====================== */}

                  {!isLogin && (

                    <div className="input-group password-group">

                      <FaLock
                        className="input-icon"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>

                    </div>

                  )}

                  {/* ======================
                      FORGOT PASSWORD
                  ====================== */}

                  {isLogin && (

                    <div className="forgot-password">

                      <button
                        type="button"
                        className="link-btn"
                      >
                        Forgot Password?
                      </button>

                    </div>

                  )}

                  {/* ======================
                      SUBMIT BUTTON
                  ====================== */}

                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={loading}
                  >

                    <span>

                      {loading
                        ? "Please Wait..."
                        : isLogin
                        ? "Login"
                        : "Create Account"}

                    </span>

                    {!loading && (
                      <FaArrowRight />
                    )}

                  </button>

                </form>

                {/* ======================
                    FOOTER
                ====================== */}

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

        </motion.section>

      </div>
          </>
  );
};

export default AuthPage;