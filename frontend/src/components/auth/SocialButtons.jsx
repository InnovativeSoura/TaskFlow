import {
  FaGoogle,
  FaGithub,
} from "react-icons/fa";

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
          onClick={onGoogleLogin}
        >
          <FaGoogle />

          <span>
            Google
          </span>

        </button>

        <button
          type="button"
          className="social-btn"
          onClick={onGithubLogin}
        >
          <FaGithub />

          <span>
            GitHub
          </span>

        </button>

      </div>
    </>
  );
};

SocialButtons.defaultProps = {
  onGoogleLogin: () => {},
  onGithubLogin: () => {},
};

export default SocialButtons;