import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

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
  const handleSubmit = (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (typeof onSubmit === "function") {
      onSubmit(event);
    }
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate={false}>
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

        <div className="auth-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={Boolean(rememberMe)}
              onChange={onRememberChange}
            />

            <span>Remember me</span>
          </label>

          <button type="button" className="link-btn" onClick={onForgotPassword}>
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          <span>{loading ? "Signing In..." : "Sign In"}</span>

          {!loading && <FaArrowRight />}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
