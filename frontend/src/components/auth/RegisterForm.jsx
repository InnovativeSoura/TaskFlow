import {
  FaUser,
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import FormField from "./FormField";

const RegisterForm = ({
  name,
  email,
  password,
  confirmPassword,
  role,

  loading,
  error,

  showPassword,
  showConfirmPassword,

  onChange,
  onSubmit,

  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  return (
    <>
      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={onSubmit}>
        <FormField
          icon={FaUser}
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Full Name"
          autoComplete="name"
          required
        />

        <FormField
          icon={FaUserTie}
          type="select"
          name="role"
          value={role}
          onChange={onChange}
          options={["Team Member", "Project Manager", "Admin"]}
        />

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
          autoComplete="new-password"
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          required
        />

        <FormField
          icon={FaLock}
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          placeholder="Confirm Password"
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={onToggleConfirmPassword}
          required
        />

        <button type="submit" className="auth-btn" disabled={loading}>
          <span>{loading ? "Creating Account..." : "Create Account"}</span>

          {!loading && <FaArrowRight />}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
