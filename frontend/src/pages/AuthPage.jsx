import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

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

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!email.trim()) {
      return "Email is required";
    }

    if (!password.trim()) {
      return "Password is required";
    }

    if (!isLogin && !name.trim()) {
      return "Name is required";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters";
    }

    return "";
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("✅ Submit clicked");

  const validationError = validate();

  if (validationError) {
    console.log(validationError);
    setError(validationError);
    return;
  }

  console.log("✅ Calling login/register");

  setLoading(true);

  let response;

  if (isLogin) {
    response = await login(email, password);
  } else {
    response = await register(name, email, password, role);
  }

  console.log("Response:", response);

  setLoading(false);

  if (!response.success) {
    setError(response.message);
    return;
  }

  navigate("/dashboard");
};

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">
          <h1>TaskFlow</h1>

          <p>
            Project Management System
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
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              <label>Role</label>

              <select
                name="role"
                value={role}
                onChange={handleChange}
              >
                <option>
                  Team Member
                </option>

                <option>
                  Manager
                </option>

                <option>
                  Admin
                </option>
              </select>
            </>
          )}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label>Password</label>

          <div className="password-box">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <button
              type="button"
              className="show-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
                    <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Signing In..."
                : "Creating Account..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <>
              <span>Don't have an account?</span>

              <button
                type="button"
                className="footer-link"
                onClick={() => {
                  setError("");
                  setIsLogin(false);
                }}
              >
                Create one
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>

              <button
                type="button"
                className="footer-link"
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

      </div>
    </div>
  );
};

export default AuthPage;