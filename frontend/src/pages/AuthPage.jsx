import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

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
import BackgroundAnimation from "../components/BackgroundAnimation";

import "../styles/Auth.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register"
  );

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    if (!email.trim()) return "Email is required.";

    if (!password.trim()) return "Password is required.";

    if (!isLogin && !name.trim()) {
      return "Full Name is required.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

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

      console.log("LOGIN RESPONSE:", response);

      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      console.log("Login Success");
      console.log("Redirecting...");

      const redirect =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirect, {
        replace: true,
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundAnimation />

      <div className="auth-page">
        <motion.div
          className="auth-wrapper"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="auth-title">
            {isLogin
              ? "Welcome Back 👋"
              : "Create Account"}
          </h2>

          <p className="auth-subtitle">
            {isLogin
              ? "Login to continue managing your projects."
              : "Join TaskFlow and start managing your work."}
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <>
                <div className="input-group">
                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="input-group">
                  <FaUserTie className="input-icon" />

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

            <div className="input-group">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="input-group password-group">
              <FaLock className="input-icon" />

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
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <button
              className="auth-btn"
              type="submit"
            >
              {loading
                ? "Please Wait..."
                : isLogin
                ? "Login"
                : "Register"}

              {!loading && <FaArrowRight />}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <>
                Don't have an account?

                <button
                  className="link-btn"
                  type="button"
                  onClick={() => {
                    setError("");
                    setIsLogin(false);
                  }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?

                <button
                  className="link-btn"
                  type="button"
                  onClick={() => {
                    setError("");
                    setIsLogin(true);
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;