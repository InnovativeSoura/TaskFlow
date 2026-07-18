import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Hero = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="hero-section">

      <div className="hero-container">

        {/* ===========================
            LEFT CONTENT
        ============================ */}

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <span className="hero-badge">
            🚀 Next Generation Project Management
          </span>

          <h1 className="hero-title">
            Manage Projects
            <br />

            Collaborate Faster
            <br />

            <span>Deliver On Time.</span>
          </h1>

          <p className="hero-description">
            TaskFlow is an all-in-one project management platform
            that helps teams organize projects, assign tasks,
            monitor progress, collaborate in real time, and boost
            productivity from one beautiful workspace.
          </p>

          <div className="hero-buttons">

            <Link
              to="/login"
              className="hero-primary-btn"
            >
              Get Started
              <FaArrowRight />
            </Link>

            <a
              href="#features"
              className="hero-secondary-btn"
            >
              Learn More
            </a>

          </div>

          <div className="hero-features">

            <div>
              <FaCheckCircle />
              <span>Unlimited Projects</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Real-time Collaboration</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Secure Cloud Storage</span>
            </div>

          </div>

        </motion.div>

        {/* ===========================
            RIGHT SIDE
        ============================ */}

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="auth-preview">

            {/* Toggle */}

            <div className="auth-toggle">

              <button
                className={!isRegister ? "active" : ""}
                onClick={() => setIsRegister(false)}
              >
                Login
              </button>

              <button
                className={isRegister ? "active" : ""}
                onClick={() => setIsRegister(true)}
              >
                Register
              </button>

            </div>

            {/* Heading */}

            <div className="auth-preview-title">

              <h2>
                {isRegister
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>

              <p>
                {isRegister
                  ? "Start managing your projects today."
                  : "Sign in to continue to TaskFlow."}
              </p>

            </div>

            {/* Form */}

            <form
  className="auth-preview-form"
  onSubmit={(e) => e.preventDefault()}
>

  {/* Register Only */}

  {isRegister && (
    <div className="auth-group">

      <label>Full Name</label>

      <input
        type="text"
        placeholder="John Doe"
      />

    </div>
  )}

  {/* Email */}

  <div className="auth-group">

    <label>Email Address</label>

    <input
      type="email"
      placeholder="john@example.com"
    />

  </div>

  {/* Password */}

  <div className="auth-group">

    <label>Password</label>

    <div className="password-group">

      <input
        type={
          showPassword
            ? "text"
            : "password"
        }
        placeholder="Enter your password"
      />

      <span
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
      </span>

    </div>

  </div>

  {/* Confirm Password */}

  {isRegister && (

    <div className="auth-group">

      <label>
        Confirm Password
      </label>

      <input
        type="password"
        placeholder="Confirm password"
      />

    </div>

  )}

  {/* Login Only */}

  {!isRegister && (

    <div className="auth-options">

      <label className="remember-me">

        <input type="checkbox" />

        Remember me

      </label>

      <Link
        to="/forgot-password"
        className="forgot-password"
      >
        Forgot Password?
      </Link>

    </div>

  )}

  {/* Submit */}

  <button
    type="submit"
    className="auth-submit"
  >
    {isRegister
      ? "Create Account"
      : "Login"}
  </button>

  {/* Divider */}

  <div className="auth-divider">

    <span>OR</span>

  </div>

  {/* Social Login */}

  <div className="auth-social">

    <button type="button">

      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        width="22"
      />

      Google

    </button>

    <button type="button">

      <img
        src="https://www.svgrepo.com/show/512317/github-142.svg"
        alt="GitHub"
        width="22"
      />

      GitHub

    </button>

  </div>

  {/* Footer */}

  <div className="auth-footer">

    {isRegister ? (

      <>
        Already have an account?

        <button
          type="button"
          onClick={() =>
            setIsRegister(false)
          }
        >
          Login
        </button>
      </>

    ) : (

      <>
        Don't have an account?

        <button
          type="button"
          onClick={() =>
            setIsRegister(true)
          }
        >
          Register
        </button>
      </>

    )}

  </div>

</form>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;