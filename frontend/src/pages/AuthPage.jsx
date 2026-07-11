import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
      return "Name is required.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;

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
        err?.response?.data?.message ||
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
  {isLogin ? "Welcome Back 👋" : "Create Account"}
</h2>

<p className="auth-subtitle">
  {isLogin
    ? "Login to continue managing your projects."
    : "Join TaskFlow and start managing your work."}
</p>

{error && <div className="auth-error">{error}</div>}

<form onSubmit={handleSubmit} className="auth-form">

  {!isLogin && (
    <>
      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
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
          <option>Team Member</option>
          <option>Project Manager</option>
          <option>Admin</option>
        </select>
      </div>
    </>
  )}

  <div className="input-group">
    <FaEnvelope className="input-icon" />
    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={email}
      onChange={handleChange}
      required
    />
  </div>

  <div className="input-group password-group">
    <FaLock className="input-icon" />

    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password"
      value={password}
      onChange={handleChange}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowPassword(!showPassword)
      }
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  <button
    type="submit"
    className="auth-btn"
    disabled={loading}
  >
    {loading ? (
      "Please Wait..."
    ) : (
      <>
        {isLogin ? "Login" : "Register"}
        <FaArrowRight />
      </>
    )}
  </button>
</form>

<div className="auth-footer">
  {isLogin ? (
    <>
      Don't have an account?{" "}
      <button
        type="button"
        className="link-btn"
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
      Already have an account?{" "}
      <button
        type="button"
        className="link-btn"
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