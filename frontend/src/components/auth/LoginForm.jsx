// src/components/auth/LoginForm.jsx

import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import FormField from "./FormField";

const LoginForm = ({
  email,
  password,

  rememberMe,

  loading,
  error,

  showPassword,

  onChange,
  onSubmit,

  onTogglePassword,

  onRememberChange,

  onForgotPassword,
}) => {

  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  const handleSubmit = (event) => {

    /*
     * VERY IMPORTANT:
     * Prevent the browser from performing a normal
     * HTML form submission, which causes a full page reload.
     */
    event.preventDefault();

    event.stopPropagation();

    /*
     * Pass the event to the parent handler.
     */
    if (typeof onSubmit === "function") {
      onSubmit(event);
    }
  };


  return (
    <>
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}


      {/* =====================================================
          LOGIN FORM
      ===================================================== */}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate={false}
      >

        {/* ===================================================
            EMAIL
        =================================================== */}

        <FormField
          icon={FaEnvelope}
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email Address"
          autoComplete="email"
          required
        />


        {/* ===================================================
            PASSWORD
        =================================================== */}

        <FormField
          icon={FaLock}
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          autoComplete="current-password"
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          required
        />


        {/* ===================================================
            OPTIONS
        =================================================== */}

        <div className="auth-options">

          <label className="remember-me">

            <input
              type="checkbox"
              checked={Boolean(rememberMe)}
              onChange={onRememberChange}
            />

            <span>
              Remember me
            </span>

          </label>


          <button
            type="button"
            className="link-btn"
            onClick={onForgotPassword}
          >
            Forgot Password?
          </button>

        </div>


        {/* ===================================================
            SIGN IN
        =================================================== */}

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >

          <span>
            {loading
              ? "Signing In..."
              : "Sign In"
            }
          </span>

          {!loading && (
            <FaArrowRight />
          )}

        </button>

      </form>
    </>
  );
};

export default LoginForm;