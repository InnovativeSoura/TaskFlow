import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();

  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        await register(
          name,
          email,
          password
        );

        toast.success("Account Created Successfully");
      } else {
        await login(
          email,
          password
        );

        toast.success("Welcome Back!");
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Authentication Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* LEFT */}

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="hero-badge">
            🚀 The Modern Project Management Platform
          </span>

          <h1 className="hero-title">
            Organize Projects.
            <br />
            Manage Teams.
            <br />
            <span>Deliver Faster.</span>
          </h1>

          <p className="hero-description">
            TaskFlow helps teams collaborate,
            manage projects, assign work,
            track progress and increase
            productivity from one powerful
            workspace.
          </p>

          <div className="hero-buttons">
            <Link
              to="/login"
              className="hero-primary-btn"
            >
              Get Started

              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="hero-secondary-btn"
            >
              <FaPlayCircle />

              Live Demo
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <FaCheckCircle />

              <span>No Credit Card</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Unlimited Projects</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Real-time Collaboration</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="hero-right"
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="auth-preview">

            <div className="auth-toggle">

              <button
                className={
                  !isRegister
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setIsRegister(false)
                }
              >
                Login
              </button>

              <button
                className={
                  isRegister
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setIsRegister(true)
                }
              >
                Register
              </button>

            </div>

            <form
              className="auth-preview-form"
              onSubmit={handleSubmit}
            >

              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              {isRegister && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                  ? "Create Account"
                  : "Login"}
              </button>

            </form>

            <div className="hero-card-footer">

              {isRegister ? (
                <p>
                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      setIsRegister(
                        false
                      )
                    }
                  >
                    Login
                  </button>
                </p>
              ) : (
                <p>
                  New to TaskFlow?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      setIsRegister(
                        true
                      )
                    }
                  >
                    Register
                  </button>
                </p>
              )}

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;