import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const completeOAuth = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      try {
        localStorage.setItem("token", token);

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        /* Fetch Current User */

        const { data } = await api.get("/auth/me");

        if (!data.success) {
          throw new Error("Authentication failed.");
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.replace("/dashboard");
      } catch (error) {
        console.error("OAuth Login Error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        delete api.defaults.headers.common["Authorization"];

        navigate("/login", {
          replace: true,
        });
      }
    };

    completeOAuth();
  }, [navigate, searchParams]);

  return (
    <div className="oauth-loading-page">
      <div className="oauth-loading-card">
        <div className="spinner"></div>

        <h2>Signing you in...</h2>

        <p>Please wait while we securely connect your account.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
