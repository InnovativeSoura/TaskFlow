import {
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

const API =
  import.meta.env.VITE_API_URL;

/* ==========================================
   DEFAULT OAUTH HANDLERS
========================================== */

const googleLogin = () => {
  window.location.href =
    `${API}/auth/google`;
};

const githubLogin = () => {
  window.location.href =
    `${API}/auth/github`;
};

const SocialButtons = ({
  onGoogleLogin,
  onGithubLogin,
}) => {
  return (
    <>
      {/* ======================
          DIVIDER
      ====================== */}

      <div className="divider">
        <span>
          or continue with
        </span>
      </div>

      {/* ======================
          SOCIAL BUTTONS
      ====================== */}

      <div className="social-login">

        <button
          type="button"
          className="social-btn"
          onClick={
            onGoogleLogin ||
            googleLogin
          }
        >
          <FaGoogle />

          <span>
            Continue with Google
          </span>

        </button>

        <button
          type="button"
          className="social-btn"
          onClick={
            onGithubLogin ||
            githubLogin
          }
        >
          <FaGithub />

          <span>
            Continue with GitHub
          </span>

        </button>

      </div>
    </>
  );
};

SocialButtons.defaultProps = {
  onGoogleLogin: null,
  onGithubLogin: null,
};

export default SocialButtons;