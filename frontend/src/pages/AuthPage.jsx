import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
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

  const auth = useAuth();

  const login = auth?.login;
  const register = auth?.register;

  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register"
  );

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

      if (!response.success) {
        setError(response.message);
        return;
      }

        navigate("/dashboard");

      } else {
        response = await register(
          name,
          email,
          password,
          role
        );

      if (!response.success) {
        setError(response.message);
        return;
      }

      navigate("/dashboard");
    }
    } catch (err) {
    setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

  return (
    <>
      <BackgroundAnimation />

      <div className="auth-page">

        <motion.div
          className="auth-wrapper"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          {/* Auth Card */}

        </motion.div>

      </div>
    </>
  );
};

export default AuthPage;
}