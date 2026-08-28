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
}) => {
  return (
    <>
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={onSubmit}
        noValidate
      >
        {/* =================================================
            EMAIL
        ================================================= */}

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

        {/* =================================================
            PASSWORD
        ================================================= */}

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

        {/* =================================================
            REMEMBER ME
        ================================================= */}

        <div className="auth-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={onRememberChange}
            />

            <span>
              Remember me
            </span>
          </label>
        </div>

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          <span>
            {loading
              ? "Signing In..."
              : "Sign In"}
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