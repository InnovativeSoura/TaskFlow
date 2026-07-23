import { motion } from "framer-motion";

const AuthToggle = ({
  isLogin,
  onToggle,
}) => {
  return (
    <div className="auth-toggle">

      <motion.div
        className={`toggle-slider ${
          isLogin ? "login" : "register"
        }`}
        layout
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
        }}
      />

      <button
        type="button"
        className={isLogin ? "active" : ""}
        onClick={() => onToggle(true)}
      >
        Login
      </button>

      <button
        type="button"
        className={!isLogin ? "active" : ""}
        onClick={() => onToggle(false)}
      >
        Register
      </button>

    </div>
  );
};

export default AuthToggle;