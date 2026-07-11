import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserTie,
  FaArrowRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import BackgroundAnimation from "../components/BackgroundAnimation";

import "../styles/Auth.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  const login = auth?.login;
  const register = auth?.register;

  const [isLogin, setIsLogin] = useState(true);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Team Member",
  });

  const { name, email, password, role } = formData;

  const handleChange = (e) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!email.trim()) return "Email is required";

    if (!password.trim())
      return "Password is required";

    if (!isLogin && !name.trim())
      return "Name is required";

    if (password.length < 6)
      return "Password must contain at least 6 characters";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!login || !register) {
      setError(
        "Authentication service unavailable."
      );

      return;
    }

    setLoading(true);
    setError("");

    let response;

    try {
      if (isLogin) {
        response = await login(email, password);
      } else {
        response = await register(
          name,
          email,
          password,
          role
        );
      }

      if (!response.success) {
        setError(response.message);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundAnimation />

      <LandingNavbar />

      <div className="auth-page">

        <Hero />

        <motion.div
          className="auth-wrapper"
          initial={{
            opacity: 0,
            y: 60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="auth-card">

            <div className="auth-header">

              <h2>
                {isLogin
                  ? "Welcome Back 👋"
                  : "Create Account"}
              </h2>

              <p>
                Manage your projects with
                TaskFlow
              </p>

            </div>

            <div className="toggle-container">

              <button
                className={
                  isLogin
                    ? "toggle-btn active"
                    : "toggle-btn"
                }
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
              >
                Login
              </button>

              <button
                className={
                  !isLogin
                    ? "toggle-btn active"
                    : "toggle-btn"
                }
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
              >
                Register
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
                            {!isLogin && (
                <>
                  <label>Full Name</label>

                  <div className="input-group">
                    <FaUser className="input-icon" />

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={handleChange}
                    />
                  </div>

                  <label>Role</label>

                  <div className="input-group">
                    <FaUserTie className="input-icon" />

                    <select
                      name="role"
                      value={role}
                      onChange={handleChange}
                    >
                      <option>Team Member</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </>
              )}

              <label>Email Address</label>

              <div className="input-group">
                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                />
              </div>

              <label>Password</label>

              <div className="input-group password-group">
                <FaLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
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

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? (
                  isLogin ? (
                    "Signing In..."
                  ) : (
                    "Creating Account..."
                  )
                ) : (
                  <>
                    {isLogin
                      ? "Login"
                      : "Register"}

                    <FaArrowRight />
                  </>
                )}
              </motion.button>
            </form>

            <div className="divider">

              <span>or</span>

            </div>

            <div className="auth-footer">

              {isLogin ? (
                <>
                  <span>
                    Don't have an account?
                  </span>

                  <button
                    className="footer-link"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                  >
                    Create One
                  </button>
                </>
              ) : (
                <>
                  <span>
                    Already have an account?
                  </span>

                  <button
                    className="footer-link"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;